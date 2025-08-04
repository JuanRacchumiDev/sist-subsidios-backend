import ParentescoRepository from '../../repositories/Parentesco/ParentescoRepository';
import { ParentescoResponse } from '../../interfaces/Parentesco/IParentesco';

/**
 * @class DeleteParentescoService
 * @description Servicio para eliminar (soft delete) un parentesco.
 */
class DeleteParentescoService {
    /**
     * Ejecuta la operación de eliminación para un parentesco.
     * @param {string} id - El ID UUID del parentesco a eliminar.
     * @returns {Promise<ParentescoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<ParentescoResponse> {
        return await ParentescoRepository.delete(id);
    }
}

export default new DeleteParentescoService();