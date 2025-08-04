import { Sequelize, Options } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config() // Carga las variables de entorno

/**
 * @class Database
 * @description Clase para manejar la conexión y configuración de Sequelize
 */
class Database {
    public sequelize: Sequelize
    private config: Options

    constructor() {
        const env = process.env.NODE_ENV || 'development'

        // Carga la configuración desde config.json
        const dbConfig = require(path.join(__dirname, 'config.json'))[env]

        if (!dbConfig) {
            throw new Error(`Configuración de base de datos para el entorno '${env} no encontrado`)
        }

        this.config = dbConfig

        // Añadir explícitamente las opciones de `dialectOptions` si usas MySQL y queremos manejo de fechas preciso
        if (dbConfig.dialect === 'mysql') {
            this.config = {
                ...this.config,
                dialectOptions: {
                    dateStrings: true,
                    typeCast: true
                },
                timezone: 'SYSTEM'
            }
        }

        if (dbConfig.use_env_variable && process.env[dbConfig.use_env_variable]) {
            this.sequelize = new Sequelize(process.env[dbConfig.use_env_variable] as string, this.config)
        } else {
            this.sequelize = new Sequelize(
                dbConfig.database,
                dbConfig.username,
                dbConfig.password,
                this.config
            )
        }

        // if (dbConfig.use_env_variable && process.env[dbConfig.use_env_variable]) {
        //     this.config = {
        //         dialect: dbConfig.dialect,
        //         host: dbConfig.host,
        //         logging: dbConfig.logging,
        //         ...dbConfig
        //     }
        //     this.sequelize = new Sequelize(process.env[dbConfig.use_env_variable] as string, this.config)
        // } else {
        //     this.config = dbConfig
        //     this.sequelize = new Sequelize(
        //         dbConfig.database,
        //         dbConfig.username,
        //         dbConfig.password,
        //         this.config
        //     )
        // }
    }

    /**
     * Probando la conexión
     */
    public async authenticate(): Promise<void> {
        try {
            await this.sequelize.authenticate()
            console.log('Conexión a la base de datos establecida correctamente.')
        } catch (error) {
            console.error('Error en la conexión a la base de datos:', error)
            throw error;
        }
    }

    /**
     * Sincroniza los modelos con la base de datos
     * @param options Opciones de sincronización
     */
    public async syncModel(options?: { force?: boolean; alter?: boolean }): Promise<void> {
        try {
            await this.sequelize.sync(options)
            console.log('Todos los modelos fueron sincronizados satisfactoriamente')
        } catch (error) {
            console.error('Error al sincronizar los modelos:', error)
            throw error
        }
    }
}

export default new Database();