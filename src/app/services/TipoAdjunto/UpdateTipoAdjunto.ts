import TipoAdjuntoRepository from '../../repositories/TipoAdjunto/TipoAdjuntoRepository';
import { ITipoAdjunto, TipoAdjuntoResponse } from '../../interfaces/TipoAdjunto/ITipoAdjunto';

/**
 * @class UpdateTipoAdjuntoService
 * @description Servicio para actualizar un tipo de adjunto existente, incluyendo el cambio de estado.
 */
class UpdateTipoAdjuntoService {
    protected tipoAdjuntoRepository: TipoAdjuntoRepository

    constructor() {
        this.tipoAdjuntoRepository = new TipoAdjuntoRepository()
    }

    /**
     * Ejecuta la operación para actualizar un tipo de adjunto.
     * Puede actualizar cualquier campo definido en ITipoAdjunto, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del tipo de adjunto a actualizar.
     * @param {ITipoAdjunto} data - Los datos parciales o completos del tipo de adjunto a actualizar.
     * @returns {Promise<TipoAdjuntoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ITipoAdjunto): Promise<TipoAdjuntoResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo

        // if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
        //     return await TipoAdjuntoRepository.updateEstado(id, data.estado);
        // }

        return await this.tipoAdjuntoRepository.update(id, data);
    }
}

export default new UpdateTipoAdjuntoService();