import CargoRepository from '../../repositories/Cargo/CargoRepository';
import { ICargo, CargoResponse } from '../../interfaces/Cargo/ICargo';

/**
 * @class UpdateEstadoService
 * @description Servicio para actualizar el estado de un cargo.
 */
class UpdateEstadoService {
    protected cargoRepository: CargoRepository

    constructor() {
        this.cargoRepository = new CargoRepository()
    }

    /**
     * Ejecuta la operación para actualizar el estado de un cargo.
     * @param {string} id - El ID UUID del cargo a actualizar.
     * @param {ICargo} data - Los datos parciales o completos del cargo a actualizar.
     * @returns {Promise<CargoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ICargo): Promise<CargoResponse> {
        const { estado } = data
        return await this.cargoRepository.updateEstado(id, estado as boolean);
    }
}

export default new UpdateEstadoService();