import ColaboradorRepository from '../../repositories/Colaborador/ColaboradorRepository';
import { ColaboradorResponse } from '../../interfaces/Colaborador/IColaborador';

/**
 * @class DeleteColaborador
 * @description Servicio para eliminar (soft delete) un colaborador.
 */
class DeleteColaborador {
    private colaboradorRepository: ColaboradorRepository

    constructor() {
        this.colaboradorRepository = new ColaboradorRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un colaborador.
     * @param {string} id - El ID UUID del colaborador a eliminar.
     * @returns {Promise<ColaboradorResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<ColaboradorResponse> {
        return await this.colaboradorRepository.delete(id);
    }
}

export default new DeleteColaborador();