import TipoContingenciaRepository from '../../repositories/TipoContingencia/TipoContingenciaRepository';
import { ITipoContingencia, TipoContingenciaResponse } from '../../interfaces/TipoContingencia/ITipoContingencia';

/**
 * @class UpdateTipoService
 * @description Servicio para actualizar un tipo de contingencia existente, incluyendo el cambio de estado.
 */
class UpdateTipoService {
    /**
     * Ejecuta la operación para actualizar un tipo de contingencia.
     * Puede actualizar cualquier campo definido en ITipoContingencia, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del tipo de contingencia a actualizar.
     * @param {ITipoContingencia} data - Los datos parciales o completos del tipo de contingencia a actualizar.
     * @returns {Promise<TipoContingenciaResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ITipoContingencia): Promise<TipoContingenciaResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
            return await TipoContingenciaRepository.updateEstado(id, data.estado);
        }
        return await TipoContingenciaRepository.update(id, data);
    }
}

export default new UpdateTipoService();