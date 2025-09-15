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
     * Puede actualizar cualquier campo definido en IAdjunto, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del adjunto a actualizar.
     * @param {IAdjunto} data - Los datos parciales o completos del adjunto a actualizar.
     * @returns {Promise<AdjuntoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IAdjunto): Promise<AdjuntoResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        // if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
        //     return await AdjuntoRepository.updateEstado(id, data.estado);
        // }
        return await this.adjuntoRepository.update(id, data);
    }
}

export default new UpdateAdjuntoService();