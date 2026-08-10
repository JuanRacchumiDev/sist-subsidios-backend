import { Sequelize } from 'sequelize';
import config from './config';

const env = process.env.NODE_ENV || 'development';
const dbConfig = (config as any)[env];

const sequelizeInstance = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        define: {
            timestamps: true
        }
    }
);

export default sequelizeInstance;