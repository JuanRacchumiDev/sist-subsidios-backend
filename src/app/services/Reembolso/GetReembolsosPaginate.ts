import ReembolsoRepository from "../../repositories/Reembolso/ReembolsoRepository";
import { ReembolsoResponsePaginate } from '../../interfaces/Reembolso/IReembolso';
import { IReembolsoFilter } from '../../interfaces/Reembolso/IReembolsoFilter'

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
     * @param {IReembolsoFilter} filters - Los parámetros a enviar para buscar
     * @returns {Promise<ReembolsoResponsePaginate>} La respuesta de obtener los reembolsos
     */
    async execute(page: number, limit: number, filters: IReembolsoFilter = {}): Promise<ReembolsoResponsePaginate> {
        return await this.reembolsoRepository.getAllPaginate(page, limit, filters)
    }
}

export default new GetReembolsosPaginateService()