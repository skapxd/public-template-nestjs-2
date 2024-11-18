import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EJSON } from 'bson';
import { ObjectId } from 'mongodb';

import { getDb } from '../db.mjs';

/**
 * @param {import('mongodb').Db} db
 * @param {'dev' | 'qa' | 'prod' | 'pre-prod'} folder
 */
const up = async (db, folder) => {
  // @ts-expect-error: ERR
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = dirname(currentFilePath);
  const path = join(currentDirPath, 'data', folder);
  const collections = readdirSync(path).filter((file) =>
    file.endsWith('.json'),
  );

  for (const collection of collections) {
    const collectionName = collection.split('.')[1];
    console.time(collectionName);
    const text = readFileSync(join(path, collection), 'utf-8');
    const json = EJSON.parse(text);
    if (Array.isArray(json) && json.length === 0) continue;
    await db
      .createCollection(collectionName)
      .catch(() => console.log(`Collection ${collectionName} already exists`));

    await db
      .collection(collectionName)
      .drop()
      .catch(() => console.log(`Collection ${collectionName} does not exist`));

    const data =
      Array.isArray(json) &&
      json.map((row) => {
        const { _id, ...rest } = row;

        /**@type {import("mongodb").AnyBulkWriteOperation} */
        const operation = {
          updateOne: {
            filter: { _id: new ObjectId(row._id) },
            update: { $set: rest },
            upsert: true,
          },
        };

        return operation;
      });
    await db
      .collection(collectionName)
      .bulkWrite(data, { ordered: false })
      .catch((e) =>
        console.log(
          `Collection ${collectionName} Error inserting data into ${collectionName}`,
        ),
      );

    console.timeEnd(collectionName);
  }
};

async function main() {
  try {
    const env = await getDb.preProd();
    await up(env.db, 'prod');
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
}

main();
