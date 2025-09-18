import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

// console.log('variables en process.env', process.env)

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('No se encontraron algunas variables de entorno')
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql',
    timezone: '-05:00',
    logging: false
});

export default sequelize