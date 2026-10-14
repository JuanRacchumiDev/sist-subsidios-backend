import path from 'path'
import HDate from './HDate'

export interface IFilePathOptions {
    originalName: string
    ruc?: string
    numero_documento?: string
}

class HFile {
    static generateS3Key(options: IFilePathOptions): string {
        const { originalName, ruc, numero_documento } = options
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const extension = path.extname(originalName)
        const filename = `${uniqueSuffix}${extension}`

        if (ruc && numero_documento) {
            const currentYear = HDate.getCurrentYear()
            return `uploads/${ruc}/${currentYear}/${numero_documento}/${filename}`
        }

        return `uploads/${filename}`
    }
}

export default HFile