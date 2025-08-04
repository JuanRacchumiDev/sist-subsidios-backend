import PerfilRepository from "../../repositories/Perfil/PerfilRepository";
import { PerfilResponse } from '../../interfaces/Perfil/IPerfil';

/**
 * @class GetSedesService
 * @description Servicio para obtener todos los perfiles, opcionalmente filtrados por estado
 */
class GetSedesService {
    /**
     * Ejecuta la operación para obtener sedes
     * @param {boolean | undefined} estado - Opcional. Filtra los perfiles por su estado
     * @returns {Promise<PerfilResponse>} La respuesta de obtener los perfiles
     */
    async execute(estado?: boolean): Promise<PerfilResponse> {
        if (typeof estado === 'boolean') {
            return await PerfilRepository.getAllByEstado(estado)
        }
        return await PerfilRepository.getAll()
    }
}

export default new GetSedesService()