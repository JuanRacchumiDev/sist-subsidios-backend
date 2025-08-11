import { UsuarioResponse } from "../../interfaces/Usuario/IUsuario";
import AuthRepository from "../../repositories/Auth/AuthRepository";

/**
 * @class LogoutService
 * @description Servicio para obtener cerrar sesión de usuario
 */
class LogoutService {
    /**
     * Ejecuta la operación para cerrar sesión de usuario por ID
     * @param {string} usuarioId - El ID UUID del usuario a buscar 
     * @returns {Promise<UsuarioResponse>} La respuesta de la operación
     */
    async execute(usuarioId: string): Promise<UsuarioResponse> {
        return await AuthRepository.logout(usuarioId)
    }
}

export default new LogoutService()