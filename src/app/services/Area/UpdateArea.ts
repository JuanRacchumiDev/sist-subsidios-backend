import AreaRepository from '../../repositories/Area/AreaRepository';
import { IArea, AreaResponse } from '../../interfaces/Area/IArea';

/**
 * @class UpdateAreaService
 * @description Servicio para actualizar un área existente, incluyendo el cambio de estado.
 */
class UpdateAreaService {
    /**
     * Ejecuta la operación para actualizar un área.
     * Puede actualizar cualquier campo definido en IArea, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del área a actualizar.
     * @param {IArea} data - Los datos parciales o completos del área a actualizar.
     * @returns {Promise<AreaResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IArea): Promise<AreaResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
            return await AreaRepository.updateEstado(id, data.estado);
        }
        return await AreaRepository.update(id, data);
    }
}

export default new UpdateAreaService();