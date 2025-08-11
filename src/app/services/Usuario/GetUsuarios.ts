import UsuarioRepository from "../../repositories/Usuario/UsuarioRepository";
import { UsuarioResponse } from '../../interfaces/Usuario/IUsuario';

/**
 * @class GetUsuariosService
 * @description Servicio para obtener todas los usuarios, opcionalmente filtrados por estado
 */
class GetUsuariosService {
    /**
     * Ejecuta la operación para obtener usuarios
     * @returns {Promise<UsuarioResponse>} La respuesta de obtener los usuarios
     */
    async execute(): Promise<UsuarioResponse> {
        return await UsuarioRepository.getAll()
    }
}

export default new GetUsuariosService()