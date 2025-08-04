import TrabajadorSocialRepository from "../../repositories/TrabajadorSocial/TrabajadorSocialRepository";
import { TrabajadorSocialResponse } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';

/**
 * @class GetTrabajadoresSocialesService
 * @description Servicio para obtener todas los trabajadores sociales, opcionalmente filtrados por estado
 */
class GetTrabajadoresSocialesService {
    /**
     * Ejecuta la operación para obtener trabajadores sociales
     * @param {boolean | undefined} estado - Opcional. Filtra los trabajadores sociales por su estado
     * @returns {Promise<TrabajadorSocialResponse>} La respuesta de obtener los trabajadores sociales
     */
    async execute(estado?: boolean): Promise<TrabajadorSocialResponse> {
        return await TrabajadorSocialRepository.getAll()
    }
}

export default new GetTrabajadoresSocialesService()