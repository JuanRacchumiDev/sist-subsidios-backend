import TrabajadorSocialRepository from '../../repositories/TrabajadorSocial/TrabajadorSocialRepository';
import { ITrabajadorSocial, TrabajadorSocialResponse } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';

/**
 * @class CreateTrabajadorSocialService
 * @description Servicio para crear un nuevo trabajador social.
 */
class CreateTrabajadorSocialService {
    protected trabajadorSocialRepository: TrabajadorSocialRepository

    constructor() {
        this.trabajadorSocialRepository = new TrabajadorSocialRepository()
    }

    /**
     * Ejecuta la operación para crear un trabajador social.
     * @param {ITrabajadorSocial} data - Los datos del trabajador social a crear.
     * @returns {Promise<TrabajadorSocialResponse>} La respuesta de la operación.
     */
    async execute(data: ITrabajadorSocial): Promise<TrabajadorSocialResponse> {
        return await this.trabajadorSocialRepository.create(data);
    }
}

export default new CreateTrabajadorSocialService();