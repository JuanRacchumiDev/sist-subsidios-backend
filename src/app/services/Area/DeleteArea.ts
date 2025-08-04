import AreaRepository from '../../repositories/Area/AreaRepository';
import { AreaResponse } from '../../interfaces/Area/IArea';

/**
 * @class DeleteAreaService
 * @description Servicio para eliminar (soft delete) un área.
 */
class DeleteAreaService {
    /**
     * Ejecuta la operación de eliminación para un área.
     * @param {string} id - El ID UUID del área a eliminar.
     * @returns {Promise<AreaResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<AreaResponse> {
        return await AreaRepository.delete(id);
    }
}

export default new DeleteAreaService();