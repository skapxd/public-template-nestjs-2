import { join } from 'node:path';

export const connectionName1 = 'sqlite-connection-1';
export const connectionName2 = 'sqlite-connection-2';

export const database =
  process.env.NODE_ENV === 'production'
    ? ':memory:'
    : join(process.cwd(), 'db', 'db.sqlite');
// : join(__dirname, 'db.sqlite');
