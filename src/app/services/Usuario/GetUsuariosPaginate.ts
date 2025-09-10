import UsarioRepository from "../../repositories/Usuario/UsuarioRepository";
import { UsuarioResponsePaginate } from '../../interfaces/Usuario/IUsuario';

/**
 * @class GetUsuariosPaginateService
 * @description Servicio para obtener todas los usuarios con paginación, opcionalmente filtrados por estado
 */
class GetUsuariosPaginateService {
    /**
     * Ejecuta la operación para obtener usuarios paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {boolean | undefined} estado - Opcional. Filtra los usuarios por su estado
     * @returns {Promise<UsuarioResponsePaginate>} La respuesta de obtener los usuarios
     */
    async execute(page: number, limit: number, estado?: boolean): Promise<UsuarioResponsePaginate> {
        return await UsarioRepository.getAllWithPaginate(page, limit, estado)
    }
}

export default new GetUsuariosPaginateService()