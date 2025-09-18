import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import path from 'path'

// Determina el entorno
const { env } = process
const { NODE_ENV } = env

const getEnv = NODE_ENV || 'development'

const envFilePath = path.resolve(process.cwd(), `.env.${getEnv}`)

// console.log({ getEnv })

// console.log({ envFilePath })

dotenv.config({ path: envFilePath })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER_GMAIL,
        pass: process.env.EMAIL_PASS_GMAIL
    }
    // host: process.env.EMAIL_HOST,
    // port: parseInt(process.env.EMAIL_PORT as string),
    // secure: process.env.EMAIL_SECURE === 'true',
    // auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    // }
})

export default transporter