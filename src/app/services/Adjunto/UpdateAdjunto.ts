import AdjuntoRepository from '../../repositories/Adjunto/AdjuntoRepository';
import { IAdjunto, AdjuntoResponse } from '../../interfaces/Adjunto/IAdjunto';

/**
 * @class UpdateAdjuntoService
 * @description Servicio para actualizar un adjunto existente, incluyendo el cambio de estado.
 */
class UpdateAdjuntoService {
    private adjuntoRepository: AdjuntoRepository

    constructor() {
        this.adjuntoRepository = new AdjuntoRepository()
    }
    /**
     * Ejecuta la operación para actualizar un adjunto.
     * Puede actualizar cualquier campo definido en IAdjunto
     * @param {string} id_descansomedico - El ID UUID del descanso médico.
     * @param {string} id_documento - El ID UUID del documento.
     * @param {IAdjunto} data - Los datos parciales o completos del adjunto a actualizar.
     * @returns {Promise<AdjuntoResponse>} La respuesta de la operación.
     */
    async execute(id_descansomedico: string, id_documento: string, data: IAdjunto): Promise<AdjuntoResponse> {
        return await this.adjuntoRepository.update(id_descansomedico, id_documento, data);
    }
}

export default new UpdateAdjuntoService();