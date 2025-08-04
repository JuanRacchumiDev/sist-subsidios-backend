import TrabajadorSocialRepository from '../../repositories/TrabajadorSocial/TrabajadorSocialRepository';
import { TrabajadorSocialResponse } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';

/**
 * @class DeleteTrabajadorSocialService
 * @description Servicio para eliminar (soft delete) un trabajador social.
 */
class DeleteTrabajadorSocialService {
    /**
     * Ejecuta la operación de eliminación para un trabajador social.
     * @param {string} id - El ID UUID del trabajador social a eliminar.
     * @returns {Promise<TrabajadorSocialResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<TrabajadorSocialResponse> {
        return await TrabajadorSocialRepository.delete(id);
    }
}

export default new DeleteTrabajadorSocialService();