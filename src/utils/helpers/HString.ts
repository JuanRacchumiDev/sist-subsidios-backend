export default class HString {
    static convertToUrlString(text: String) {
        let urlString = text.toLocaleLowerCase()

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
}