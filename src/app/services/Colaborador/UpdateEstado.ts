import ColaboradorRepository from '../../repositories/Colaborador/ColaboradorRepository';
import { IColaborador, ColaboradorResponse } from '../../interfaces/Colaborador/IColaborador';

/**
 * @class UpdateEstadoService
 * @description Servicio para actualizar el estado de un colaborador
 */
class UpdateEstadoService {
    protected colaboradorRepository: ColaboradorRepository

    constructor() {
        this.colaboradorRepository = new ColaboradorRepository()
    }

    /**
     * Ejecuta la operación para actualizar el estado de un colaborador.
     * @param {string} id - El ID UUID del colaborador a actualizar.
     * @param {IColaborador} data - Los datos parciales o completos del colaborador a actualizar.
     * @returns {Promise<ColaboradorResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IColaborador): Promise<ColaboradorResponse> {
        const { estado } = data
        return await this.colaboradorRepository.updateEstado(id, estado as boolean);
    }
}

export default new UpdateEstadoService();