import PersonaRepository from "../../repositories/Persona/PersonaRepository"

/**
 * @class GetInfoApiService
 * @description Servicio para obtener datos de una persona desde la API
 */
class GetInfoApiService {
    /**
     * Ejecuta la operación para obtener una persona desde la API
     * @param {string} abreviatura - La abreviatura del tipo de documento
     * @param {string} numeroDocumento - El número de documento de la persona a buscar
     * @returns La respuesta de la operación
     */
    async execute(abreviatura: string, numeroDocumento: string) {
        return await PersonaRepository.getInfoApi(abreviatura, numeroDocumento)
    }
}

export default new GetInfoApiService()