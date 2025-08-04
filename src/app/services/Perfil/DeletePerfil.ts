import PerfilRepository from '../../repositories/Perfil/PerfilRepository';
import { PerfilResponse } from '../../interfaces/Perfil/IPerfil';

/**
 * @class DeletePerfilService
 * @description Servicio para eliminar (soft delete) un perfil.
 */
class DeletePerfilService {
    /**
     * Ejecuta la operación de eliminación para un perfil.
     * @param {string} id - El ID UUID del perfil a eliminar.
     * @returns {Promise<PerfilResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<PerfilResponse> {
        return await PerfilRepository.delete(id);
    }
}

export default new DeletePerfilService();