import PaisRepository from "../../repositories/Pais/PaisRepository";
import { PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class GetPaisService
 * @description Servicio para obtener un solo país por ID
 */
class GetPaisService {
    protected paisRepository: PaisRepository

    constructor() {
        this.paisRepository = new PaisRepository()
    }

    /**
     * Ejecuta la operación para obtener un país por ID
     * @param {string} id - El ID UUID del país a buscar
     * @returns {Promise<PaisResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<PaisResponse> {
        return await this.paisRepository.getById(id)
    }
}

export default new GetPaisService()