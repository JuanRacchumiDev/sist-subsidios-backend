import * as crypto from 'crypto';

export default class HString {
    static convertToUrlString(text: String): string {
        let urlString: string = text.toLocaleLowerCase()

        // Reemplazamos caracteres especiales
        urlString = urlString.normalize("NFD") // Descomponer caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas diacríticas
            .replace(/ñ/g, 'n') // Convertir ñ a n
            .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres no permitidos
            .trim() // Eliminar espacios al inicio y al final
            .replace(/\s+/g, '-') // Reemplazar espacios por guiones
            .replace(/-+/g, '-') // Eliminar guiones duplicados

        return urlString
    }

    static generateRandomString(length: number): string {
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result: string = ''
        const charactersLength: number = characters.length
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }

    static encrypt(text: string): string {
        const { env } = process
        const { EMAIL_ALGORITHM = 'aes-256-gcm', EMAIL_ENCRYPTION_KEY } = env

        if (!EMAIL_ENCRYPTION_KEY) {
            throw new Error('EMAIL_ENCRYPTION_KEY no está definido en las variables de entorno.')
        }

        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(
            EMAIL_ALGORITHM,
            Buffer.from(EMAIL_ENCRYPTION_KEY as string),
            iv
        ) as crypto.CipherGCM;

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');

        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    }

    static decrypt(encryptedText: string): string {
        const { env } = process
        const { EMAIL_ALGORITHM = 'aes-256-gcm', EMAIL_ENCRYPTION_KEY } = env

        if (!EMAIL_ENCRYPTION_KEY) {
            throw new Error('EMAIL_ENCRYPTION_KEY no está definido en las variables de entorno.')
        }

        const parts = encryptedText.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];

        const decipher = crypto.createDecipheriv(
            EMAIL_ALGORITHM,
            Buffer.from(EMAIL_ENCRYPTION_KEY),
            iv
        ) as crypto.DecipherGCM;

        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}