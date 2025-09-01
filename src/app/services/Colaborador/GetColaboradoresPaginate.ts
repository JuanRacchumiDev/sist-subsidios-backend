import ColaboradorRepository from "../../repositories/Colaborador/ColaboradorRepository";
import { ColaboradorResponsePaginate } from '../../interfaces/Colaborador/IColaborador';

/**
 * @class GetColaboradoresPaginateService
 * @description Servicio para obtener todas los colaboradores con paginación, opcionalmente filtrados por estado
 */
class GetColaboradoresPaginateService {
    /**
     * Ejecuta la operación para obtener colaboradores paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {boolean | undefined} estado - Opcional. Filtra los colaboradores por su estado
     * @returns {Promise<ColaboradorResponsePaginate>} La respuesta de obtener los colaboradores
     */
    async execute(page: number, limit: number, estado?: boolean): Promise<ColaboradorResponsePaginate> {
        return await ColaboradorRepository.getAllWithPaginate(page, limit, estado)
    }
}

export default new GetColaboradoresPaginateService()
