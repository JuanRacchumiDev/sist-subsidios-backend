import ColaboradorRepository from '../../repositories/Colaborador/ColaboradorRepository';
import { IColaborador, ColaboradorResponse } from '../../interfaces/Colaborador/IColaborador';

/**
 * @class UpdateColaborador
 * @description Servicio para actualizar un colaborador existente, incluyendo el cambio de estado.
 */
class UpdateColaborador {
    /**
     * Ejecuta la operación para actualizar un colaborador.
     * Puede actualizar cualquier campo definido en IColaborador, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID de la sede a actualizar.
     * @param {IColaborador} data - Los datos parciales o completos del colaborador a actualizar.
     * @returns {Promise<ColaboradorResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IColaborador): Promise<ColaboradorResponse> {
        return await ColaboradorRepository.update(id, data);
    }
}

export default new UpdateColaborador();