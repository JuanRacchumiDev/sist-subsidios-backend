import CargoRepository from '../../repositories/Cargo/CargoRepository';
import { ICargo, CargoResponse } from '../../interfaces/Cargo/ICargo';

/**
 * @class CreateCargoService
 * @description Servicio para crear un nuevo cargo.
 */
class CreateCargoService {
    private cargoRepository: CargoRepository

    constructor() {
        this.cargoRepository = new CargoRepository()
    }

    /**
     * Ejecuta la operación para crear un cargo.
     * @param {ICargo} data - Los datos del cargo a crear.
     * @returns {Promise<CargoResponse>} La respuesta de la operación.
     */
    async execute(data: ICargo): Promise<CargoResponse> {
        return await this.cargoRepository.create(data);
    }
}

export default new CreateCargoService();