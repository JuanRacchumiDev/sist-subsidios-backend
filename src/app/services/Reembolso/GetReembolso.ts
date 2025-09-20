import ReembolsoRepository from "../../repositories/Reembolso/ReembolsoRepository";
import { ReembolsoResponse } from '../../interfaces/Reembolso/IReembolso';

/**
 * @class GetReembolsoService
 * @description Servicio para obtener un solo reembolso por ID
 */
class GetReembolsoService {
    private reembolsoRepository: ReembolsoRepository

    constructor() {
        this.reembolsoRepository = new ReembolsoRepository()
    }

    /**
     * Ejecuta la operación para obtener un reembolso por ID
     * @param {string} id - El ID UUID del reembolso a buscar
     * @returns {Promise<ReembolsoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<ReembolsoResponse> {
        return await this.reembolsoRepository.getById(id)
    }
}

export default new GetReembolsoService()