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
     * @returns {Promise<PaisResponse>} La respuesta de obtener los países
     */
    async execute(): Promise<PaisResponse> {
        return await this.paisRepository.getAll()
    }
}

export default new GetPaisesServixe()