import TrabajadorSocialRepository from '../../repositories/TrabajadorSocial/TrabajadorSocialRepository';
import { ITrabajadorSocial, TrabajadorSocialResponse } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';

/**
 * @class UpdateTrabajadorSocialService
 * @description Servicio para actualizar un trabajador social existente, incluyendo el cambio de estado.
 */
class UpdateTrabajadorSocialService {
    /**
     * Ejecuta la operación para actualizar un trabajador social.
     * Puede actualizar cualquier campo definido en ITrabajadorSocial, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID de la sede a actualizar.
     * @param {ITrabajadorSocial} data - Los datos parciales o completos del trabajador social a actualizar.
     * @returns {Promise<TrabajadorSocialResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ITrabajadorSocial): Promise<TrabajadorSocialResponse> {
        return await TrabajadorSocialRepository.update(id, data);
    }
}

export default new UpdateTrabajadorSocialService();