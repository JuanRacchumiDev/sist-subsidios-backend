import TipoDocumentoRepository from "../../repositories/TipoDocumento/TipoDocumentoRepository"
import PersonaApiRepository from "../../repositories/Persona/PersonaApiRepository"
import { ITipoDocumento } from "../../interfaces/TipoDocumento/ITipoDocumento";
import { TTipoDocumentoSearch } from "../../types/TipoDocumento/TTipoDocumentoSearch";
import PersonaRepository from "../../repositories/Persona/PersonaRepository";

/**
 * @class GetInfoApiService
 * @description Servicio para obtener datos de una persona desde la API
 */
class GetInfoApiService {
    protected tipoDocumentoRepository: TipoDocumentoRepository
    protected personaApiRepository: PersonaApiRepository
    protected personaRepository: PersonaRepository

    constructor() {
        this.tipoDocumentoRepository = new TipoDocumentoRepository()
        this.personaApiRepository = new PersonaApiRepository()
        this.personaRepository = new PersonaRepository()
    }

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

        const responseTipoDocumento = await this.tipoDocumentoRepository.getBySearch(paramSearch);

        console.log({ responseTipoDocumento })

        const { result, data } = responseTipoDocumento

        if (!result || !data) {
            return {
                result: false,
                error: "Tipo de documento no encontrado",
                status: 404
            }
        }

        const { id } = data as ITipoDocumento

        const idStr = id as string

        // Validamos si la persona se encuentra registrada
        const responsePersona = await this.personaRepository.getByIdTipoDocAndNumDoc(idStr, numeroDocumento)

        const { result: resultPersona, data: dataPersona } = responsePersona

        // // Validamos si la persona no existe
        if (resultPersona && dataPersona) {
            return responsePersona
        }

        return await this.personaApiRepository.getInfoApi(abreviatura, numeroDocumento)
    }
}

export default new GetInfoApiService()