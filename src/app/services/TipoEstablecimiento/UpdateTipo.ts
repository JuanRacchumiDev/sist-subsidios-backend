import TipoEstablecimientoRepository from '../../repositories/TipoEstablecimiento/TipoEstablecimientoRepository';
import { ITipoEstablecimiento, TipoEstablecimientoResponse } from '../../interfaces/TipoEstablecimiento/ITipoEstablecimiento';

/**
 * @class UpdateTipoService
 * @description Servicio para actualizar un tipo de establecimiento existente, incluyendo el cambio de estado.
 */
class UpdateTipoService {
    protected tipoEstablecimientoRepository: TipoEstablecimientoRepository

    constructor() {
        this.tipoEstablecimientoRepository = new TipoEstablecimientoRepository()
    }

    /**
     * Ejecuta la operación para actualizar un tipo de establecimiento.
     * Puede actualizar cualquier campo definido en ITipoEstablecimiento, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del tipo de establecimiento a actualizar.
     * @param {ITipoEstablecimiento} data - Los datos parciales o completos del tipo de establecimiento a actualizar.
     * @returns {Promise<TipoEstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ITipoEstablecimiento): Promise<TipoEstablecimientoResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo

        // if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
        //     return await TipoEstablecimientoRepository.updateEstado(id, data.estado);
        // }

        return await this.tipoEstablecimientoRepository.update(id, data);
    }
}

export default new UpdateTipoService();