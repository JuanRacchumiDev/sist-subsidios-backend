import AreaRepository from "../../repositories/Area/AreaRepository";
import { AreaResponsePaginate } from '../../interfaces/Area/IArea';

/**
 * @class GetAreasPaginateService
 * @description Servicio para obtener todas las áreas con paginación, opcionalmente filtrados por estado
 */
class GetAreasPaginateService {
    private areaRepository: AreaRepository

    constructor() {
        this.areaRepository = new AreaRepository()
    }

    /**
     * Ejecuta la operación para obtener áreas paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<AreaResponsePaginate>} La respuesta de obtener las áreas
     */
    async execute(page: number, limit: number): Promise<AreaResponsePaginate> {
        return await this.areaRepository.getAllWithPaginate(page, limit)
    }
}

export default new GetAreasPaginateService()