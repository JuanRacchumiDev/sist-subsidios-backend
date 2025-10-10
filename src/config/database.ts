import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

// console.log('variables en process.env', process.env)

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT, DATABASE_URL, NODE_ENV } = process.env

let sequelize: Sequelize

if (NODE_ENV === 'production' && DATABASE_URL) {
    console.log('Modo Producción: Usuario DATABASE_URL')

    // Conexión usando la URL unificada
    sequelize = new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
        timezone: '-05:00'
    })
} else {
    if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME || !DB_PORT) {
        throw new Error('No se encontraron algunas variables de entorno')
    }

    console.log('Modo Desarrollo: Usando variables separadas')

    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
        host: DB_HOST,
        dialect: 'postgres',
        port: parseInt(DB_PORT, 10),
        timezone: '-05:00',
        logging: false
    })
}

export default sequelize

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
//     host: DB_HOST,
//     dialect: 'postgres',
//     port: 5432,
//     timezone: '-05:00',
//     logging: false
// });

// export default sequelize