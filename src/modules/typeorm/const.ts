import { join } from 'node:path';

export const database =
  process.env.NODE_ENV === 'production'
    ? ':memory:'
    : join(__dirname, 'db.sqlite');
