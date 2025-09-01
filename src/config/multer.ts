import path from 'path';
import multer from 'multer';
import fs from 'fs'

// Definir la ruta destino
const uploadDirectory = path.join(__dirname, '..', '..', 'public', 'uploads')

// Crea el directorio si no existe
fs.mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix: string = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const setName: string = path.extname(file.originalname)
        const filename = `${uniqueSuffix}${setName}`
        cb(null, filename);
    }
})

const upload = multer({ storage })

export { upload }