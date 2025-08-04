import SedeRepository from '../../repositories/Sede/SedeRepository';
import { ISede, SedeResponse } from '../../interfaces/Sede/ISede';

/**
 * @class UpdateSedeService
 * @description Servicio para actualizar una sede existente, incluyendo el cambio de estado.
 */
class UpdateSedeService {
    /**
     * Ejecuta la operación para actualizar una sede.
     * Puede actualizar cualquier campo definido en ISede, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID de la sede a actualizar.
     * @param {ISede} data - Los datos parciales o completos de la sede a actualizar.
     * @returns {Promise<SedeResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ISede): Promise<SedeResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
            return await SedeRepository.updateEstado(id, data.estado);
        }
        return await SedeRepository.update(id, data);
    }
}

export default new UpdateSedeService();