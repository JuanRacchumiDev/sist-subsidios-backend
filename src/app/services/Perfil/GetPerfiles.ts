import PerfilRepository from "../../repositories/Perfil/PerfilRepository";
import { PerfilResponse } from '../../interfaces/Perfil/IPerfil';

/**
 * @class GetSedesService
 * @description Servicio para obtener todos los perfiles, opcionalmente filtrados por estado
 */
class GetSedesService {
    protected perfilRepository: PerfilRepository

    constructor() {
        this.perfilRepository = new PerfilRepository()
    }

    /**
     * Ejecuta la operación para obtener sedes
     * @returns {Promise<PerfilResponse>} La respuesta de obtener los perfiles
     */
    async execute(): Promise<PerfilResponse> {
        return await this.perfilRepository.getAll()
    }
}

export default new GetSedesService()