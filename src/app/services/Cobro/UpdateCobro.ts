import CobroRepository from '../../repositories/Cobro/CobroRepository';
import { ICargo, CargoResponse } from '../../interfaces/Cargo/ICargo';

/**
 * @class UpdateCobroService
 * @description Servicio para actualizar un cobro existente, incluyendo el cambio de estado.
 */
class UpdateCobroService {
    private cobroRepository: CobroRepository

    constructor() {
        this.cobroRepository = new CobroRepository()
    }

    /**
     * Ejecuta la operación para actualizar un cargo.
     * Puede actualizar cualquier campo definido en ICargo, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del cargo a actualizar.
     * @param {ICargo} data - Los datos parciales o completos del cargo a actualizar.
     * @returns {Promise<CargoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ICargo): Promise<CargoResponse> {
        return await this.cobroRepository.update(id, data);
    }
}

export default new UpdateCobroService();