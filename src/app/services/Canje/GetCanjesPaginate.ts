import CanjeRepository from "../../repositories/Canje/CanjeRepository";
import { CanjeResponsePaginate } from '../../interfaces/Canje/ICanje';
import { ICanjeFilter } from "../../interfaces/Canje/ICanjeFilter";

/**
 * @class GetCanjesPaginateService
 * @description Servicio para obtener todas los canjes con paginación, opcionalmente filtrados por estado
 */
class GetCanjesPaginateService {
    private canjeRepository: CanjeRepository

    constructor() {
        this.canjeRepository = new CanjeRepository()
    }

    /**
     * Ejecuta la operación para obtener canjes paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {ICanjeFilter} filters - Los parámetros a enviar para buscar
     * @returns {Promise<CanjeResponsePaginate>} La respuesta de obtener los canjes
     */
    async execute(page: number, limit: number, filters: ICanjeFilter = {}): Promise<CanjeResponsePaginate> {
        return await this.canjeRepository.getAllWithPaginate(page, limit, filters)
    }
}

export default new GetCanjesPaginateService()