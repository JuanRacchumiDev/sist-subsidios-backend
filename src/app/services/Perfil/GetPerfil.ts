import PerfilRepository from "../../repositories/Perfil/PerfilRepository";
import { PerfilResponse } from '../../interfaces/Perfil/IPerfil';

/**
 * @class GetPerfilService
 * @description Servicio para obtener un solo perfil por ID
 */
class GetPerfilService {
    /**
     * Ejecuta la operación para obtener un perfil por ID
     * @param {string} id - El ID UUID del perfil a buscar
     * @returns {Promise<PerfilResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<PerfilResponse> {
        return await PerfilRepository.getById(id)
    }
}

export default new GetPerfilService()