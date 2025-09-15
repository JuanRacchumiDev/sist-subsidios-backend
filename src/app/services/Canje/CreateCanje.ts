import CanjeRepository from '../../repositories/Canje/CanjeRepository';
import { ICanje, CanjeResponse } from '../../interfaces/Canje/ICanje';

/**
 * @class CreateCanjeService
 * @description Servicio para crear un solo canje.
 */
class CreateCanjeService {
    private canjeRepository: CanjeRepository

    constructor() {
        this.canjeRepository = new CanjeRepository()
    }
    /**
     * Ejecuta la operación para crear un canje.
     * @param {ICanje} data - Los datos del canje a crear.
     * @returns {Promise<CanjeResponse>} La respuesta de la operación.
     */
    async execute(data: ICanje): Promise<CanjeResponse> {
        return await this.canjeRepository.create(data);
    }
}

export default new CreateCanjeService();