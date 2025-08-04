import app from "./app"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// import express, { Application, Request, Response } from 'express'
// import dotenv from 'dotenv'
// import database from './config/database.old'
// import swaggerUi from 'swagger-ui-express'
// import swaggerSpec from './config/swagger'
// import apiRoutes from './app/routes'
// import cors from 'cors';

// const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '*'

// dotenv.config()

// const app: Application = express()
// const PORT = process.env.PORT || 3000

// app.use(cors({
//     origin: allowedOrigin,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))

// app.use(express.json())

// // Documentación Server Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// // Agregamos API rutas principales
// app.use('/api/v1', apiRoutes)

// // Basic root route
// app.get('/', (req: Request, res: Response) => {
//     res.status(200).json({
//         message: 'Bienvenido a la API! Visita /api-docs para documentación'
//     })
// })

// // Global error handler (example)
// app.use((err: Error, req: Request, res: Response) => {
//     console.error(err.stack);
//     res.status(500).json({
//         result: false,
//         message: 'Something went wrong!',
//         error: err.message,
//         status: 500,
//     });
// });

// async function startServer() {
//     try {
//         await database.authenticate()
//         // En producción, es recomendable gestionar las migraciones manualmente con `npx sequelize-cli db:migrate`.
//         // Para desarrollo, `alter: true` puede ser útil para aplicar cambios de modelo automáticamente.
//         // Si usas migraciones, comenta o elimina la siguiente línea para evitar conflictos.
//         // await database.syncModel({ force: false, alter: true }) // You can use { alter: true } for dev
//         // await database.syncModel({ force: false })

//         // require('./app/models/index')(database.sequelize)

//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`)
//             console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`)
//         })
//     } catch (error) {
//         console.error('Failed to start server:', error);
//         process.exit(1);
//     }
// }

// startServer()