import PaisRepository from '../../repositories/Pais/PaisRepository';
import { IPais, PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class UpdatePaisService
 * @description Servicio para actualizar un país existente, incluyendo el cambio de estado.
 */
class UpdatePaisService {
    /**
     * Ejecuta la operación para actualizar un país.
     * Puede actualizar cualquier campo definido en IPais, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del país a actualizar.
     * @param {IPais} data - Los datos parciales o completos del país a actualizar.
     * @returns {Promise<PaisResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IPais): Promise<PaisResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
            return await PaisRepository.updateEstado(id, data.estado);
        }
        return await PaisRepository.update(id, data);
    }
}

export default new UpdatePaisService();