import AdjuntoRepository from "../../repositories/Adjunto/AdjuntoRepository";
import { AdjuntoResponsePaginate } from '../../interfaces/Adjunto/IAdjunto';

/**
 * @class GetAdjuntosPaginateService
 * @description Servicio para obtener todas los adjuntos con paginación, opcionalmente filtrados por estado
 */
class GetAdjuntosPaginateService {
    private adjuntoRepository: AdjuntoRepository

    constructor() {
        this.adjuntoRepository = new AdjuntoRepository()
    }
    /**
     * Ejecuta la operación para obtener adjuntos paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<AdjuntoResponsePaginate>} La respuesta de obtener las empresas
     */
    async execute(page: number, limit: number): Promise<AdjuntoResponsePaginate> {
        return await this.adjuntoRepository.getAllWithPaginate(page, limit)
    }
}

export default new GetAdjuntosPaginateService()