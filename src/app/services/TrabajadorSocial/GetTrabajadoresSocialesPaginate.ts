import TrabajadorSocialRepository from "../../repositories/TrabajadorSocial/TrabajadorSocialRepository";
import { TrabajadorSocialResponsePaginate } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';
import { ITrabajadorSocialFilter } from "../../interfaces/TrabajadorSocial/ITrabajadorSocialFilter";

/**
 * @class GetTrabajadoresSocialesPaginateService
 * @description Servicio para obtener todas los trabajadores sociales con paginación, opcionalmente filtrados por estado
 */
class GetTrabajadoresSocialesPaginateService {
    private trabajadorSocialRepository: TrabajadorSocialRepository

    constructor() {
        this.trabajadorSocialRepository = new TrabajadorSocialRepository()
    }

    /**
     * Ejecuta la operación para obtener trabajadores sociales paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {ITrabajadorSocialFilter} filters - Los parámetros a enviar para buscar
     * @returns {Promise<TrabajadorSocialResponsePaginate>} La respuesta de obtener los trabajadores sociales
     */
    async execute(page: number, limit: number, filters: ITrabajadorSocialFilter = {}): Promise<TrabajadorSocialResponsePaginate> {
        return await this.trabajadorSocialRepository.getAllWithPaginate(page, limit, filters)
    }
}

export default new GetTrabajadoresSocialesPaginateService()
