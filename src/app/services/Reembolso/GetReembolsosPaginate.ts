import ReembolsoRepository from "../../repositories/Reembolso/ReembolsoRepository";
import { ReembolsoResponsePaginate } from '../../interfaces/Reembolso/IReembolso';

/**
 * @class GetReembolsosPaginateService
 * @description Servicio para obtener todas los reembolsos con paginación, opcionalmente filtrados por estado
 */
class GetReembolsosPaginateService {
    private reembolsoRepository: ReembolsoRepository

    constructor() {
        this.reembolsoRepository = new ReembolsoRepository()
    }

    /**
     * Ejecuta la operación para obtener reembolsos paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<ReembolsoResponsePaginate>} La respuesta de obtener los reembolsos
     */
    async execute(page: number, limit: number): Promise<ReembolsoResponsePaginate> {
        return await this.reembolsoRepository.getAllWithPaginate(page, limit)
    }
}

export default new GetReembolsosPaginateService()