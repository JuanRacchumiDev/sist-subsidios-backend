import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { s3Client, S3_BUCKET_NAME } from "../../../config/s3.config"
import { IStorageProvider } from "./IStorageProvider"

export class S3StorageProvider implements IStorageProvider {
    async uploadFile(file: Express.Multer.File, keyPath: string): Promise<string> {
        // Normalizar separadores de ruta de windows a formato S3
        const normalizedKey = keyPath.replace(/\\/g, '/')

        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: normalizedKey,
            Body: file.buffer,
            ContentType: file.mimetype
        })

        await s3Client.send(command)

        // Retorna la key almacenada en S3
        return normalizedKey
    }

    async deleteFile(keyPath: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: keyPath
        })

        await s3Client.send(command)
    }

}