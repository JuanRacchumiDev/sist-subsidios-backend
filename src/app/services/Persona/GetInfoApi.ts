import TipoDocumentoRepository from "../../repositories/TipoDocumento/TipoDocumentoRepository"
import PersonaApiRepository from "../../repositories/Persona/PersonaApiRepository"
import { ITipoDocumento } from "../../interfaces/TipoDocumento/ITipoDocumento";
import { TTipoDocumentoSearch } from "../../types/TipoDocumento/TTipoDocumentoSearch";

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
        // Obtenemos el tipo de documento
        const paramSearch: TTipoDocumentoSearch = {
            nombre: undefined,
            abreviatura
        }

        const responseTipoDocumento = await TipoDocumentoRepository.getBySearch(paramSearch);

        const { result, data } = responseTipoDocumento

        if (!result || !data) {
            return {
                result: false,
                error: "Tipo de documento no encontrado",
                status: 404
            }
        }

        // const { id } = data as ITipoDocumento

        // const idStr = id as string

        return await PersonaApiRepository.getInfoApi(abreviatura, numeroDocumento)

        // Validamos si la persona se encuentra registrada
        // const responsePersona = await PersonaRepository.getByIdTipoDocAndNumDoc(idStr, numeroDocumento)

        // const { result: resultPersona, data: dataPersona } = responsePersona

        // // Validamos si la persona no existe
        // if (!resultPersona && !dataPersona) {
        //     return await PersonaRepository.getInfoApi(abreviatura, numeroDocumento)
        // }

        // return {
        //     ...responsePersona
        // }
    }
}

export default new GetInfoApiService()