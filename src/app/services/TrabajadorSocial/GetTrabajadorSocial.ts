import TrabajadorSocialRepository from "../../repositories/TrabajadorSocial/TrabajadorSocialRepository";
import { TrabajadorSocialResponse } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';

/**
 * @class GetTrabajadorSocialService
 * @description Servicio para obtener un trabajador social por ID
 */
class GetTrabajadorSocialService {
    /**
     * Ejecuta la operación para obtener un trabajador social por ID
     * @param {string} id - El ID UUID de la sede a buscar
     * @returns {Promise<TrabajadorSocialResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<TrabajadorSocialResponse> {
        return await TrabajadorSocialRepository.getById(id)
    }
}

export default new GetTrabajadorSocialService()