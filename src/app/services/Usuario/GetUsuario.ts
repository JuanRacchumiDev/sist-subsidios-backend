import UsuarioRepository from "../../repositories/Usuario/UsuarioRepository";
import { UsuarioResponse } from '../../interfaces/Usuario/IUsuario';

/**
 * @class GetUsuarioService
 * @description Servicio para obtener un solo usuario por ID
 */
class GetUsuarioService {
    /**
     * Ejecuta la operación para obtener un usuario por ID
     * @param {string} id - El ID UUID del usuario a buscar
     * @returns {Promise<UsuarioResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<UsuarioResponse> {
        return await UsuarioRepository.getById(id)
    }
}

export default new GetUsuarioService()