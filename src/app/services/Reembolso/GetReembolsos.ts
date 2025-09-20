import ReembolsoRepository from "../../repositories/Reembolso/ReembolsoRepository";
import { ReembolsoResponse } from '../../interfaces/Reembolso/IReembolso';

/**
 * @class GetReembolsosService
 * @description Servicio para obtener todos los reembolsos, opcionalmente filtrados por estado
 */
class GetReembolsosService {
    private reembolsoRepository: ReembolsoRepository

    constructor() {
        this.reembolsoRepository = new ReembolsoRepository()
    }

    /**
     * Ejecuta la operación para obtener reembolsos
     * @returns {Promise<ReembolsoResponse>} La respuesta de obtener los reembolsos
     */
    async execute(): Promise<ReembolsoResponse> {
        return await this.reembolsoRepository.getAll()
    }
}

export default new GetReembolsosService()