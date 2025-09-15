import TrabajadorSocialRepository from '../../repositories/TrabajadorSocial/TrabajadorSocialRepository';
import { TrabajadorSocialResponse } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';

/**
 * @class DeleteTrabajadorSocialService
 * @description Servicio para eliminar (soft delete) un trabajador social.
 */
class DeleteTrabajadorSocialService {
    protected trabajadorSocialRepository: TrabajadorSocialRepository

    constructor() {
        this.trabajadorSocialRepository = new TrabajadorSocialRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un trabajador social.
     * @param {string} id - El ID UUID del trabajador social a eliminar.
     * @returns {Promise<TrabajadorSocialResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<TrabajadorSocialResponse> {
        return await this.trabajadorSocialRepository.delete(id);
    }
}

export default new DeleteTrabajadorSocialService();