import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: (process.env.DB_DIALECT || 'postgres') as any,
    logging: console.log
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres' as const,
    logging: false
  }
};

export = config;

// {
//   "development": {
//     "username": "postgres",
//     "password": "postgres",
//     "database": "dms_sophia_db",
//     "host": "127.0.0.1",
//     "dialect": "postgres"
//   },
//   "test": {
//     "username": "postgres",
//     "password": "postgres",
//     "database": "dms_sophia_test_db",
//     "host": "127.0.0.1",
//     "dialect": "postgres"
//   },
//   "production": {
//     "username": "postgres",
//     "password": "postgres",
//     "database": "dms_sophia_prod_db",
//     "host": "127.0.0.1",
//     "dialect": "postgres"
//   }
// }
