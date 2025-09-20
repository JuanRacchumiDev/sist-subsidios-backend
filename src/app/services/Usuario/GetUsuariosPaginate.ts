import UsuarioRepository from "../../repositories/Usuario/UsuarioRepository";
import { UsuarioResponsePaginate } from '../../interfaces/Usuario/IUsuario';

/**
 * @class GetUsuariosPaginateService
 * @description Servicio para obtener todas los usuarios con paginación, opcionalmente filtrados por estado
 */
class GetUsuariosPaginateService {
    protected usuarioRepository: UsuarioRepository

    constructor() {
        this.usuarioRepository = new UsuarioRepository()
    }

    /**
     * Ejecuta la operación para obtener usuarios paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<UsuarioResponsePaginate>} La respuesta de obtener los usuarios
     */
    async execute(page: number, limit: number): Promise<UsuarioResponsePaginate> {
        return await this.usuarioRepository.getAllWithPaginate(page, limit)
    }
}

export default new GetUsuariosPaginateService()