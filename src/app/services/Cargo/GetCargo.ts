import CargoRepository from "../../repositories/Cargo/CargoRepository";
import { CargoResponse } from '../../interfaces/Cargo/ICargo';

/**
 * @class GetCargoService
 * @description Servicio para obtener un solo cargo por ID
 */
class GetCargoService {
    private cargoRepository: CargoRepository

    constructor() {
        this.cargoRepository = new CargoRepository()
    }

    /**
     * Ejecuta la operación para obtener un cargo por ID
     * @param {string} id - El ID UUID del cargo a buscar
     * @returns {Promise<CargoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<CargoResponse> {
        return await this.cargoRepository.getById(id)
    }
}

export default new GetCargoService()