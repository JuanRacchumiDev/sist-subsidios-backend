import AuthRepository from "../../repositories/Auth/AuthRepository";
import { AuthCredenciales, AuthResponse } from '../../types/Auth/TAuth'

/**
 * @class LoginService
 * @description Servicio para obtener datos de inicio de sesión
 */
class LoginService {
    /**
     * Ejecuta la operación para obtener datos de inicio de sesión
     * @param {AuthCredenciales} data - Los datos de inicio de sesión 
     * @returns {Promise<AuthResponse>} La respuesta de la operación
     */
    async execute(data: AuthCredenciales): Promise<AuthResponse> {
        return await AuthRepository.login(data)
    }
}

export default new LoginService()