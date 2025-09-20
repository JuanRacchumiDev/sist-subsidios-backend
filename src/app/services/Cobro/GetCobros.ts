import CobroRepository from "../../repositories/Cobro/CobroRepository";
import { CobroResponse } from '../../interfaces/Cobro/ICobro';

/**
 * @class GetCobrosService
 * @description Servicio para obtener todos los cobros, opcionalmente filtrados por estado
 */
class GetCobrosService {
    private cobroRepository: CobroRepository

    constructor() {
        this.cobroRepository = new CobroRepository()
    }

    /**
     * Ejecuta la operación para obtener cobros
     * @returns {Promise<CobroResponse>} La respuesta de obtener los cobros
     */
    async execute(): Promise<CobroResponse> {
        return await this.cobroRepository.getAll()
    }
}

export default new GetCobrosService()