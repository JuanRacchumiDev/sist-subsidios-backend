import TipoDescansoMedicoRepository from '../../repositories/TipoDescansoMedico/TipoDescansoMedicoRepository';
import { TipoDescansoMedicoResponse } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';

/**
 * @class DeleteTipoService
 * @description Servicio para eliminar (soft delete) un tipo de descanso médico.
 */
class DeleteTipoService {
    protected tipoDescansoMedicoRepository: TipoDescansoMedicoRepository

    constructor() {
        this.tipoDescansoMedicoRepository = new TipoDescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un tipo de descanso médico.
     * @param {string} id - El ID UUID del tipo de descanso médico a eliminar.
     * @returns {Promise<TipoDescansoMedicoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<TipoDescansoMedicoResponse> {
        return await this.tipoDescansoMedicoRepository.delete(id);
    }
}

export default new DeleteTipoService();