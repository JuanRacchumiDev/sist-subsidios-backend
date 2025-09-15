import PaisRepository from '../../repositories/Pais/PaisRepository';
import { PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class DeletePaisService
 * @description Servicio para eliminar (soft delete) un país.
 */
class DeletePaisService {
    protected paisRepository: PaisRepository

    constructor() {
        this.paisRepository = new PaisRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un país.
     * @param {string} id - El ID UUID del país a eliminar.
     * @returns {Promise<PaisResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<PaisResponse> {
        return await this.paisRepository.delete(id);
    }
}

export default new DeletePaisService();