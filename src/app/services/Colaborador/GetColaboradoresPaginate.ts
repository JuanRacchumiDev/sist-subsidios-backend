import ColaboradorRepository from "../../repositories/Colaborador/ColaboradorRepository";
import { ColaboradorResponsePaginate } from '../../interfaces/Colaborador/IColaborador';
import { IColaboradorFilter } from "../../interfaces/Colaborador/IColaboradorFilter";

/**
 * @class GetColaboradoresPaginateService
 * @description Servicio para obtener todas los colaboradores con paginación, opcionalmente filtrados por estado
 */
class GetColaboradoresPaginateService {
    private colaboradorRepository: ColaboradorRepository

    constructor() {
        this.colaboradorRepository = new ColaboradorRepository()
    }

    /**
     * Ejecuta la operación para obtener colaboradores paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {IColaboradorFilter} filters - Los parámetros a enviar para buscar
     * @returns {Promise<ColaboradorResponsePaginate>} La respuesta de obtener los colaboradores
     */
    async execute(page: number, limit: number, filters: IColaboradorFilter = {}): Promise<ColaboradorResponsePaginate> {
        return await this.colaboradorRepository.getAllWithPaginate(page, limit, filters)
    }
}

export default new GetColaboradoresPaginateService()
