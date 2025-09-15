import PerfilRepository from '../../repositories/Perfil/PerfilRepository';
import { PerfilResponse } from '../../interfaces/Perfil/IPerfil';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un perfil por su nombre.
 */
class GetByNombreService {
    protected perfilRepository: PerfilRepository

    constructor() {
        this.perfilRepository = new PerfilRepository()
    }

    /**
     * Ejecuta la operación para obtener un perfil por nombre.
     * @param {string} nombre - El nombre del perfil a buscar.
     * @returns {Promise<PerfilResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<PerfilResponse> {
        return await this.perfilRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();