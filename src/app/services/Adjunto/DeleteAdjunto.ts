import AdjuntoRepository from '../../repositories/Adjunto/AdjuntoRepository';
import { AdjuntoResponse } from '../../interfaces/Adjunto/IAdjunto';

/**
 * @class DeleteAdjuntoService
 * @description Servicio para eliminar (soft delete) un adjunto.
 */
class DeleteAdjuntoService {
    private adjuntoRepository: AdjuntoRepository

    constructor() {
        this.adjuntoRepository = new AdjuntoRepository()
    }
    /**
     * Ejecuta la operación de eliminación para un adjunto.
     * @param {string} id - El ID UUID del adjunto a eliminar.
     * @returns {Promise<AdjuntoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<AdjuntoResponse> {
        return await this.adjuntoRepository.delete(id);
    }
}

export default new DeleteAdjuntoService();