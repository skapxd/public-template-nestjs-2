import { join } from 'node:path';

export const connectionName1 = 'save-events-sqlite-connection-1';

export const database = (() => {
  if (process.env.NODE_ENV === 'production') return ':memory:';
  if (process.env.NODE_ENV === 'test') return ':memory:';

  return join(__dirname, 'db.sqlite');
})();
