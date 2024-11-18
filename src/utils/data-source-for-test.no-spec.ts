import { randomUUID } from 'node:crypto';

import { DataType, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

import { EntityClasses } from './utility-types/entity';

export const setupDataSource = async (entities: EntityClasses) => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: randomUUID,
      impure: true,
    });
  });

  db.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 13.3',
  });

  const ds: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities,
  });

  await ds.initialize();
  await ds.synchronize();

  return ds;
};
