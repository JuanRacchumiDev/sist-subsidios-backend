import ColaboradorRepository from "../../repositories/Colaborador/ColaboradorRepository";
import { ColaboradorResponse } from '../../interfaces/Colaborador/IColaborador';

/**
 * @class GetColaboradorService
 * @description Servicio para obtener un colaborador por ID
 */
class GetColaboradorService {
    /**
     * Ejecuta la operación para obtener un colaborador por ID
     * @param {string} id - El ID UUID de la sede a buscar
     * @returns {Promise<ColaboradorResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<ColaboradorResponse> {
        return await ColaboradorRepository.getById(id)
    }
}

export default new GetColaboradorService()