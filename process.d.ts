declare namespace NodeJS {
  export interface ProcessEnv {
    TZ: string;
    PORT: string;
    API_SECRET: string;
    MONGO_DB: string;
    NODE_ENV: 'development' | 'production' | 'test' | 'local';
    URL_FRONT: string;
  }
}
