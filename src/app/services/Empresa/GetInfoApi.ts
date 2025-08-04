import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository"

/**
 * @class GetInfoApiService
 * @description Servicio para obtener datos de una empresa desde la API
 */
class GetInfoApiService {
    /**
     * Ejecuta la operación para obtener una empresa desde la API
     * @param {string} ruc - El ruc de la empresa a buscar
     * @returns La respuesta de la operación
     */
    async execute(ruc: string) {
        return await EmpresaRepository.getInfoApi(ruc)
    }
}

export default new GetInfoApiService()