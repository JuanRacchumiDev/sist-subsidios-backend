import CobroRepository from '../../repositories/Cobro/CobroRepository';
import { CobroResponse } from '../../interfaces/Cobro/ICobro';

/**
 * @class DeleteCobroService
 * @description Servicio para eliminar (soft delete) un cobro.
 */
class DeleteCobroService {
    private cobroRepository: CobroRepository

    constructor() {
        this.cobroRepository = new CobroRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un cobro.
     * @param {string} id - El ID UUID del cobro a eliminar.
     * @returns {Promise<CobroResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<CobroResponse> {
        return await this.cobroRepository.delete(id);
    }
}

export default new DeleteCobroService();