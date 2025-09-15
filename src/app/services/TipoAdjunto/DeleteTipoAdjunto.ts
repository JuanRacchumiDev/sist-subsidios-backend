import TipoAdjuntoRepository from '../../repositories/TipoAdjunto/TipoAdjuntoRepository';
import { TipoAdjuntoResponse } from '../../interfaces/TipoAdjunto/ITipoAdjunto';

/**
 * @class DeleteTipoAdjuntoService
 * @description Servicio para eliminar (soft delete) un tipo de adjunto.
 */
class DeleteTipoAdjuntoService {
    protected tipoAdjuntoRepository: TipoAdjuntoRepository

    constructor() {
        this.tipoAdjuntoRepository = new TipoAdjuntoRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un tipo de adjunto.
     * @param {string} id - El ID UUID del tipo de adjunto a eliminar.
     * @returns {Promise<TipoAdjuntoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<TipoAdjuntoResponse> {
        return await this.tipoAdjuntoRepository.delete(id);
    }
}

export default new DeleteTipoAdjuntoService();