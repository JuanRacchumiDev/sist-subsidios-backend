import AuthRepository from "../../repositories/Auth/AuthRepository";
import { AuthResponse, IAuth } from "../../interfaces/Auth/IAuth";

/**
 * @class LoginService
 * @description Servicio para obtener datos de inicio de sesión
 */
class LoginService {
    /**
     * Ejecuta la operación para obtener datos de inicio de sesión
     * @param {IAuth} data - Los datos de inicio de sesión 
     * @returns {Promise<AuthResponse>} La respuesta de la operación
     */
    async execute(data: IAuth): Promise<AuthResponse> {
        return await AuthRepository.login(data)
    }
}

export default new LoginService()