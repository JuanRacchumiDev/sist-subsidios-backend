import PerfilRepository from "../../repositories/Perfil/PerfilRepository";
import { PerfilResponsePaginate } from '../../interfaces/Perfil/IPerfil';

/**
 * @class GetPerfilesPaginateService
 * @description Servicio para obtener todas los perfiles con paginación, opcionalmente filtrados por estado
 */
class GetPerfilesPaginateService {
    protected perfilRepository: PerfilRepository

    constructor() {
        this.perfilRepository = new PerfilRepository()
    }

    /**
     * Ejecuta la operación para obtener perfiles paginados
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {boolean | undefined} estado - Opcional. Filtra los perfiles por su estado
     * @returns {Promise<PerfilResponsePaginate>} La respuesta de obtener los perfiles
     */
    async execute(page: number, limit: number, estado?: boolean): Promise<PerfilResponsePaginate> {
        return await this.perfilRepository.getAllWithPaginate(page, limit, estado)
    }
}

export default new GetPerfilesPaginateService()