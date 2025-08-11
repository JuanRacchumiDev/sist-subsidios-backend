import UsuarioRepository from '../../repositories/Usuario/UsuarioRepository';
import { IUsuario, UsuarioResponse } from '../../interfaces/Usuario/IUsuario';

/**
 * @class UpdateUsuarioService
 * @description Servicio para actualizar un usuario existente, incluyendo el cambio de estado.
 */
class UpdateUsuarioService {
    /**
     * Ejecuta la operación para actualizar un usuario.
     * Puede actualizar cualquier campo definido en IUsuario, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del usuario a actualizar.
     * @param {IUsuario} data - Los datos parciales o completos del usuario a actualizar.
     * @returns {Promise<UsuarioResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IUsuario): Promise<UsuarioResponse> {
        return await UsuarioRepository.update(id, data);
    }
}

export default new UpdateUsuarioService();