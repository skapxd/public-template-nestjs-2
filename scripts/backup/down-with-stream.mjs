import { createWriteStream } from 'node:fs';
import { join } from 'node:path';

import { EJSON } from 'bson';
import { Duration } from 'luxon';
import prompts from 'prompts';

/**
 * @param {import('mongodb').Db} db
 * @param {string} folder
 */
const down = async (db, folder) => {
  const humanFormat = "h 'h' m 'min' s 'sec' S 'mili sec'";
  let totalTime = 0;

  const collections = await db.collections();
  let nameMoreLong = '';
  collections.forEach((e) => {
    if (e.collectionName.length > nameMoreLong.length) {
      nameMoreLong = e.collectionName;
    }
  });

  /**@type {Record<string, {total: number; current: number; progress: string; time: string, completeWriteFile: boolean}>} */
  const fedBackObj = {};

  collections.forEach((e) => {
    fedBackObj[e.collectionName.padEnd(nameMoreLong.length, ' ')] = {
      total: 0,
      current: 0,
      progress: '0%',
      time: '0',
      completeWriteFile: false,
    };
  });

  const awaitForWriteAllFiles = async () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const allComplete = Object.values(fedBackObj).every(
          (e) => e.completeWriteFile,
        );

        if (allComplete) {
          clearInterval(interval);
          resolve();
        }
      }, 300);
    });
  };

  let refresh = 0;
  const interval = setInterval(() => {
    console.clear();
    console.table({
      ...fedBackObj,
      totalTime: Duration.fromMillis(totalTime).toFormat(humanFormat),
      refresh: refresh++,
    });
  }, 300);

  for (const collection of collections) {
    const startPerformance = performance.now();

    const fedBack =
      fedBackObj[collection.collectionName.padEnd(nameMoreLong.length, ' ')];

    fedBack.total = await collection.countDocuments();
    const asyncIterableCollection = collection.find().stream();

    const path = (() => {
      // @ts-expect-error: ERR
      const url = import.meta.url;
      const __dirname = new URL('.', url).pathname;
      const path = join(
        __dirname,
        'data',
        folder,
        collection.namespace + '.json',
      );

      return path;
    })();

    const writeStream = createWriteStream(path);

    writeStream.write('[\n');

    for await (const document of asyncIterableCollection) {
      fedBack.current++;
      const isEndStream = fedBack.current === fedBack.total;

      const tempProgress = ((fedBack.current / fedBack.total) * 100)
        .toFixed(3)
        .padStart(6, ' ');

      fedBack.progress = tempProgress + '%';

      writeStream.write(EJSON.stringify(document));
      if (isEndStream) {
        writeStream.write('\n');
      } else {
        writeStream.write(',\n');
      }
    }

    if (fedBack.current !== fedBack.total)
      throw new Error(
        `Por alguna razón el documento ${collection.collectionName} no se pudo iterar completamente`,
      );

    writeStream.end(']\n', () => {
      fedBack.completeWriteFile = true;
    });

    const endPerformance = performance.now();
    fedBack.time = Duration.fromMillis(endPerformance - startPerformance)
      .toFormat(humanFormat)
      .padStart(30, ' ');

    totalTime += endPerformance - startPerformance;
  }

  await awaitForWriteAllFiles();
  clearInterval(interval);
  console.clear();
  console.table({
    ...fedBackObj,
    totalTime: Duration.fromMillis(totalTime).toFormat(humanFormat),
    refresh: refresh++,
  });
};

async function main() {
  try {
    console.clear();

    const getDbDev = async () => {
      const url = process.env.MONGODB_URL;
      const dbName = process.env.MONGODB_DB_NAME;
      const client = new mongodb.MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      return {
        db: db,
        client: 'dev',
      };
    };

    const env = await getDbDev();

    const mongoDbUrl = new URL(env.db?.client?.s?.url);

    const answerConfirmBackUp = await prompts({
      type: 'toggle',
      name: 'value',
      message: `Confirm backup down form ${mongoDbUrl.pathname}`,
      initial: false,
      active: 'yes',
      inactive: 'no',
    });

    if (answerConfirmBackUp.value === false) {
      process.exit(1);
    }

    console.log(`Starting backup for ${mongoDbUrl.pathname}`);

    await down(env.db, env.client);
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
}

main();
