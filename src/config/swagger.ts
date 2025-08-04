import swaggerJSDoc from 'swagger-jsdoc'
import dotenv from 'dotenv'

dotenv.config()

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de Gestión de subsidios',
        version: '1.0.0',
        description: 'API para la gestión de trabajadores, colaboradores, empresas, usuarios, descansos médicos, canjes, reembolsos y cobros',
        contact: {
            name: "Sophia Human",
            url: "http://website.com",
            email: "juan.racchumi.nima@gmail.com"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
                description: 'Servidor de desarrollo'
            }
        ]
    }
}

const options: swaggerJSDoc.Options = {
    definition: swaggerDefinition,
    apis: [
        './src/app/controllers/**/*.ts',
        './src/app/routes/**/*.ts',
        './src/app/interfaces/**/*.ts',
    ]
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec