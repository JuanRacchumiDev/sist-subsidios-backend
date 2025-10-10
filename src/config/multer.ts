import multer from "multer";

// Usando memoryStorage
const storage = multer.memoryStorage()

const upload = multer({ storage })

export { upload }

// Usando diskStorage
// import path from 'path';
// import fs from 'fs'
// import { Request } from 'express'
// import HDate from '../helpers/HDate';

// // Definir la ruta destino
// const baseUploadDir = path.join(__dirname, '..', '..', 'public', 'uploads')

// // Crea el directorio si no existe
// fs.mkdirSync(baseUploadDir, { recursive: true })

// const storage = multer.diskStorage({
//     destination: (req: Request, file, cb) => {
//         let pathDestination: string = ""

//         const { body } = req

//         console.log({ body })

//         const { ruc, numero_documento } = body

//         const currentYear = HDate.getCurrentYear()

//         if (ruc && numero_documento) {
//             pathDestination = path.join(baseUploadDir, ruc, currentYear, numero_documento)

//             // Crear el subdirectorio si no existe
//             fs.mkdirSync(pathDestination, { recursive: true });
//         } else {
//             pathDestination = baseUploadDir
//         }

//         console.log({ pathDestination })

//         cb(null, pathDestination);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix: string = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
//         const setName: string = path.extname(file.originalname)
//         const filename = `${uniqueSuffix}${setName}`
//         cb(null, filename);
//     }
// })

// const upload = multer({ storage })

// export { upload }