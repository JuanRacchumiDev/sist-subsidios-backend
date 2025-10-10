import UsuarioRepository from '../../repositories/Usuario/UsuarioRepository';
import { IUsuario, UsuarioResponse } from '../../interfaces/Usuario/IUsuario';

/**
 * @class UpdateEstadoService
 * @description Servicio para actualizar el estado de un usuario.
 */
class UpdateEstadoService {
    protected usuarioRepository: UsuarioRepository

    constructor() {
        this.usuarioRepository = new UsuarioRepository()
    }

    /**
     * Ejecuta la operación para actualizar el estado de un usuario.
     * @param {string} id - El ID UUID del usuario a actualizar.
     * @param {IUsuario} data - Los datos parciales o completos del usuario a actualizar.
     * @returns {Promise<UsuarioResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IUsuario): Promise<UsuarioResponse> {
        const { estado } = data
        return await this.usuarioRepository.updateEstado(id, estado as boolean);
    }
}

export default new UpdateEstadoService();