import CobroRepository from "../../repositories/Cobro/CobroRepository";
import { CobroResponsePaginate } from '../../interfaces/Cobro/ICobro';

/**
 * @class GetCobrosPaginateService
 * @description Servicio para obtener todas los cobros con paginación, opcionalmente filtrados por estado
 */
class GetCobrosPaginateService {
    private cobroRepository: CobroRepository

    constructor() {
        this.cobroRepository = new CobroRepository()
    }

    /**
     * Ejecuta la operación para obtener cobros paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<CobroResponsePaginate>} La respuesta de obtener los cobros
     */
    async execute(page: number, limit: number): Promise<CobroResponsePaginate> {
        return await this.cobroRepository.getAllWithPaginate(page, limit)
    }
}

export default new GetCobrosPaginateService()