import CargoRepository from '../../repositories/Cargo/CargoRepository';
import { CargoResponse } from '../../interfaces/Cargo/ICargo';

/**
 * @class DeleteCargoService
 * @description Servicio para eliminar (soft delete) un cargo.
 */
class DeleteCargoService {
    private cargoRepository: CargoRepository

    constructor() {
        this.cargoRepository = new CargoRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un cargo.
     * @param {string} id - El ID UUID del cargo a eliminar.
     * @returns {Promise<CargoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<CargoResponse> {
        return await this.cargoRepository.delete(id);
    }
}

export default new DeleteCargoService();