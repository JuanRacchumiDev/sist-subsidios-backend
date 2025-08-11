import UsuarioRepository from '../../repositories/Usuario/UsuarioRepository';
import { IUsuario, UsuarioResponse } from '../../interfaces/Usuario/IUsuario';

/**
 * @class CreateUsuarioService
 * @description Servicio para crear un nuevo usuario.
 */
class CreateUsuarioService {
    /**
     * Ejecuta la operación para crear un usuario.
     * @param {IUsuario} data - Los datos del usuario a crear.
     * @returns {Promise<UsuarioResponse>} La respuesta de la operación.
     */
    async execute(data: IUsuario): Promise<UsuarioResponse> {
        return await UsuarioRepository.create(data);
    }
}

export default new CreateUsuarioService();