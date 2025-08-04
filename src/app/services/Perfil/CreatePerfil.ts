import PerfilRepository from '../../repositories/Perfil/PerfilRepository';
import { IPerfil, PerfilResponse } from '../../interfaces/Perfil/IPerfil';

/**
 * @class CreatePerfilService
 * @description Servicio para crear un nuevo perfil.
 */
class CreatePerfilService {
    /**
     * Ejecuta la operación para crear un perfil.
     * @param {IPerfil} data - Los datos del perfil a crear.
     * @returns {Promise<PerfilResponse>} La respuesta de la operación.
     */
    async execute(data: IPerfil): Promise<PerfilResponse> {
        return await PerfilRepository.create(data);
    }
}

export default new CreatePerfilService();