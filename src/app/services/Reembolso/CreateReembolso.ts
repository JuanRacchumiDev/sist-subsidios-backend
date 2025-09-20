import ReembolsoRepository from '../../repositories/Reembolso/ReembolsoRepository';
import { IReembolso, ReembolsoResponse } from '../../interfaces/Reembolso/IReembolso';

/**
 * @class CreateReembolsoService
 * @description Servicio para crear un solo reembolso.
 */
class CreateReembolsoService {
    private reembolsoRepository: ReembolsoRepository

    constructor() {
        this.reembolsoRepository = new ReembolsoRepository()
    }
    /**
     * Ejecuta la operación para crear un reembolso.
     * @param {IReembolso} data - Los datos del reembolso a crear.
     * @returns {Promise<ReembolsoResponse>} La respuesta de la operación.
     */
    async execute(data: IReembolso): Promise<ReembolsoResponse> {
        return await this.reembolsoRepository.create(data);
    }
}

export default new CreateReembolsoService();