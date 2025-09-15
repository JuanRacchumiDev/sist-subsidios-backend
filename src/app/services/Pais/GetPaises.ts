import PaisRepository from "../../repositories/Pais/PaisRepository";
import { PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class GetPaisesServixe
 * @description Servicio para obtener todos los países, opcionalmente filtrados por estado
 */
class GetPaisesServixe {
    protected paisRepository: PaisRepository

    constructor() {
        this.paisRepository = new PaisRepository()
    }

    /**
     * Ejecuta la operación para obtener países
     * @param {boolean | undefined} estado - Opcional. Filtra los países por su estado
     * @returns {Promise<PaisResponse>} La respuesta de obtener los países
     */
    async execute(estado?: boolean): Promise<PaisResponse> {
        // if (typeof estado === 'boolean') {
        //     return await PaisRepository.getAllByEstado(estado)
        // }
        return await this.paisRepository.getAll()
    }
}

export default new GetPaisesServixe()