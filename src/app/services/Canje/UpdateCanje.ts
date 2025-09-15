import CanjeRepository from '../../repositories/Canje/CanjeRepository';
import { ICanje, CanjeResponse } from '../../interfaces/Canje/ICanje';

/**
 * @class UpdateCanjeService
 * @description Servicio para actualizar un canje existente, incluyendo el cambio de estado.
 */
class UpdateCanjeService {
    private canjeRepository: CanjeRepository

    constructor() {
        this.canjeRepository = new CanjeRepository()
    }

    /**
     * Ejecuta la operación para actualizar un canje.
     * Puede actualizar cualquier campo definido en ICanje, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del canje a actualizar.
     * @param {ICanje} data - Los datos parciales o completos del canje a actualizar.
     * @returns {Promise<CanjeResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ICanje): Promise<CanjeResponse> {
        return await this.canjeRepository.update(id, data);
    }
}

export default new UpdateCanjeService();