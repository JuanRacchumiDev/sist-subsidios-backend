import TrabajadorSocialRepository from "../../repositories/TrabajadorSocial/TrabajadorSocialRepository";
import { TrabajadorSocialResponse } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';

/**
 * @class GetTrabajadoresSocialesService
 * @description Servicio para obtener todas los trabajadores sociales, opcionalmente filtrados por estado
 */
class GetTrabajadoresSocialesService {
    protected trabajadorSocialRepository: TrabajadorSocialRepository

    constructor() {
        this.trabajadorSocialRepository = new TrabajadorSocialRepository()
    }

    /**
     * Ejecuta la operación para obtener trabajadores sociales
     * @returns {Promise<TrabajadorSocialResponse>} La respuesta de obtener los trabajadores sociales
     */
    async execute(): Promise<TrabajadorSocialResponse> {
        return await this.trabajadorSocialRepository.getAll()
    }
}

export default new GetTrabajadoresSocialesService()