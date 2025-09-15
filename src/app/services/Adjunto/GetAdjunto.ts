import AdjuntoRepository from "../../repositories/Adjunto/AdjuntoRepository";
import { AdjuntoResponse } from '../../interfaces/Adjunto/IAdjunto';

/**
 * @class GetAdjuntoService
 * @description Servicio para obtener un solo adjunto por ID
 */
class GetAdjuntoService {
    private adjuntoRepository: AdjuntoRepository

    constructor() {
        this.adjuntoRepository = new AdjuntoRepository()
    }
    /**
     * Ejecuta la operación para obtener un adjunto por ID
     * @param {string} id - El ID UUID del adjunto a buscar
     * @returns {Promise<AdjuntoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<AdjuntoResponse> {
        return await this.adjuntoRepository.getById(id)
    }
}

export default new GetAdjuntoService()