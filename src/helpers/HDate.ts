import { addDays, subDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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

    /**
   * Suma días a una fecha en formato string y devuelve un string.
   * @param {string} dateString - La fecha original en formato 'YYYY-MM-DD'.
   * @param {number} daysToAdd - El número de días a sumar.
   * @returns {string} La nueva fecha en formato 'YYYY-MM-DD'.
   */
    static addDaysToDate(dateString: string, dias: number): string {
        const date = new Date(dateString)
        const newDate = addDays(date, dias)
        return format(newDate, 'yyyy-MM-dd')
    }

    /**
   * Resta días a una fecha en formato string y devuelve un string.
   * @param {string} dateString - La fecha original en formato 'YYYY-MM-DD'.
   * @param {number} daysToSubstract - El número de días a restar.
   * @returns {string} La nueva fecha en formato 'YYYY-MM-DD'.
   */
    static subDayFromDate(dateString: string, dias: number): string {
        const date = new Date(dateString)
        const newDate = subDays(date, dias)
        return format(newDate, 'yyyy-MM-dd')
    }

    /**
     * Devuelve el nombre del mes de una fecha determinada
     * @param {string} dateString - La fecha en formato 'YYYY-MM-DD'.
     * @returns {string} El nombre del mes en mayúsculas (por ejemplo, 'AGOSTO').
     */
    static getMonthName(dateString: string): string {
        const date = new Date(dateString)
        const monthName = format(date, 'MMMM', { locale: es })
        return monthName.toUpperCase()
    }

    /**
     * Obtiene la fecha actual
     * @returns {string} La fecha en formato 'YYYY-MM-DD'
     */
    static getCurrentDateToString(formatDate: string): string {
        const fechaActual = new Date()
        const fechaString = format(fechaActual, formatDate)
        return fechaString
    }

    static formatDate(dateString: string | null | undefined, dateFormat: string): string {
        if (!dateString) {
            return ''
        }

        try {
            const date = parseISO(dateString)
            return format(date, dateFormat, { locale: es })
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return '';
        }
    }

    /**
     * Calcula la diferencia en días entre dos fechas.
     * @param fechaInicial La fecha inicial en formato 'yyyy-mm-dd'.
     * @param fechaFinal La fecha final en formato 'yyyy-mm-dd'.
     * @returns La diferencia de fechas en días.
     */
    static differenceDates(fechaInicial: string, fechaFinal: string): number {
        const fecha1 = new Date(fechaInicial);
        const fecha2 = new Date(fechaFinal);

        // Calcula la diferencia en milisegundos.
        const diferenciaMilisegundos = fecha2.getTime() - fecha1.getTime();

        // Convierte los milisegundos a días.
        const milisegundosEnUnDia = 1000 * 60 * 60 * 24;
        const diferenciaDias = diferenciaMilisegundos / milisegundosEnUnDia;

        return diferenciaDias;
    }

}