import DetalleParametroRepository from "../../repositories/DetalleParametro/DetalleParametroRepository";
import { DetalleParametroResponsePaginate } from '../../interfaces/DetalleParametro/IDetalleParametro';

/**
 * @class GetDetallesPaginateService
 * @description Servicio para obtener todas los detalles con paginación, opcionalmente filtrados por estado
 */
class GetDetallesPaginateService {
    private detalleParametroRepository: DetalleParametroRepository

    constructor() {
        this.detalleParametroRepository = new DetalleParametroRepository()
    }

    /**
     * Ejecuta la operación para obtener detalles paginadas
     * @param {number} clase - El tipo de clase de un detalle 
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {string} filter - La cadena de búsqueda
     * @returns {Promise<DetalleParametroResponsePaginate>} La respuesta de obtener los detalles
     */
    async execute(clase: number, page: number, limit: number, filter: string): Promise<DetalleParametroResponsePaginate> {
        return await this.detalleParametroRepository.getAllPaginate(clase, page, limit, filter)
    }
}

export default new GetDetallesPaginateService()
