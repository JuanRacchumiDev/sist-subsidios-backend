import { ETipoDato } from '@/enums/ETipoDato';

export default class HConfig {
    /**
     * Convierte la cadena almacenada en BD al tipo de dato primitivo o estructurado
     * según el valor del Enum ETipoDato.
     * 
     * @param valor Valor en string almacenado en la BD
     * @param tipoDato Tipo de dato definido por el Enum ETipoDato
     * @returns El valor casteado al tipo correspondiente (number, boolean, object/array o string)
     */
    static parseValue<T = any>(valor: string, tipoDato: ETipoDato): T | null {
        if (valor === null || valor === undefined) return null;

        switch (tipoDato) {
            case ETipoDato.NUMBER:
                return Number(valor) as T;

            case ETipoDato.BOOLEAN:
                return (valor.toLowerCase() === 'true' || valor === '1') as T;

            case ETipoDato.JSON:
                try {
                    return JSON.parse(valor) as T;
                } catch {
                    return null;
                }

            case ETipoDato.STRING:
            default:
                return valor as T;
        }
    }
}

// const diasSubsidio = HConfig.parseValue<number>('20', ETipoDato.NUMBER); // Retorna 20 (number)
// const esActivo = HConfig.parseValue<boolean>('true', ETipoDato.BOOLEAN); // Retorna true (boolean)