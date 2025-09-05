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
}