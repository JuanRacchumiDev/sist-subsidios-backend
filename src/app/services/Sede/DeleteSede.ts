import SedeRepository from '../../repositories/Sede/SedeRepository';
import { SedeResponse } from '../../interfaces/Sede/ISede';

/**
 * @class DeleteSedeService
 * @description Servicio para eliminar (soft delete) una sede.
 */
class DeleteSedeService {
    /**
     * Ejecuta la operación de eliminación para una sede.
     * @param {string} id - El ID UUID de la sede a eliminar.
     * @returns {Promise<SedeResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<SedeResponse> {
        return await SedeRepository.delete(id);
    }
}

export default new DeleteSedeService();