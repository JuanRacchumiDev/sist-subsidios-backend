export default class HDate {
    static validateAndFormatDate(dateString: string): (string | null) {
        // Expresión regular para validar el formato "dd/mm/yyyy"
        const dd_mm_yy_regex = /^(\d{2})\/(\d{2})\/(\d{4})$/

        // Expresión regular para validar el formato "yyyy-mm-dd"
        const yyyy_mm_dd_regex = /^(\d{4})-(\d{2})-(\d{2})$/

        // Validar si la fecha tiene el formato "dd/mm/yyyy"
        const validate_dd_mm_yyyy = dateString.match(dd_mm_yy_regex)

        if (validate_dd_mm_yyyy) {
            const [, day, month, year] = validate_dd_mm_yyyy
            return `${year}-${month}-${day}`
        }

        // Validar si la fecha tiene el formato "yyyy-mm-dd"
        const validate_yyyy_mm_dd = dateString.match(yyyy_mm_dd_regex)

        if (validate_yyyy_mm_dd) {
            return dateString
        }

        return null
    }
}