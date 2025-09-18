import AuthRepository from "../../repositories/Auth/AuthRepository";
import { TCodigoTemp } from '../../types/DescansoMedico/TCodigoTemp'

/**
 * @class CreateCodigoTempService
 * @description Servicio para crear un código temporal
 */
class CreateCodigoTempService {
    private authRepository: AuthRepository

    constructor() {
        this.authRepository = new AuthRepository()
    }

    /**
     * Ejecuta la operación para obtener datos de inicio de sesión
     * @returns {Promise<TCodigoTemp>} La respuesta de la operación
     */
    async execute(): Promise<TCodigoTemp> {
        return await this.authRepository.createCodigoTemp()
    }
}

export default new CreateCodigoTempService()