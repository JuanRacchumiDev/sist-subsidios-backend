import PaisRepository from "../../repositories/Pais/PaisRepository";
import { PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class GetPaisesServixe
 * @description Servicio para obtener todos los países, opcionalmente filtrados por estado
 */
class GetPaisesServixe {
    /**
     * Ejecuta la operación para obtener países
     * @param {boolean | undefined} estado - Opcional. Filtra los países por su estado
     * @returns {Promise<PaisResponse>} La respuesta de obtener los países
     */
    async execute(estado?: boolean): Promise<PaisResponse> {
        if (typeof estado === 'boolean') {
            return await PaisRepository.getAllByEstado(estado)
        }
        return await PaisRepository.getAll()
    }
}

export default new GetPaisesServixe()