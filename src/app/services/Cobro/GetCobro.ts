import CobroRepository from "../../repositories/Cobro/CobroRepository";
import { CobroResponse } from '../../interfaces/Cobro/ICobro';

/**
 * @class GetCobroService
 * @description Servicio para obtener un solo cobro por ID
 */
class GetCobroService {
    private cobroRepository: CobroRepository

    constructor() {
        this.cobroRepository = new CobroRepository()
    }

    /**
     * Ejecuta la operación para obtener un cobro por ID
     * @param {string} id - El ID UUID del cobro a buscar
     * @returns {Promise<CobroResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<CobroResponse> {
        return await this.cobroRepository.getById(id)
    }
}

export default new GetCobroService()