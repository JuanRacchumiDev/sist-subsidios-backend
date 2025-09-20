import CargoRepository from "../../repositories/Cargo/CargoRepository";
import { CargoResponse } from '../../interfaces/Cargo/ICargo';

/**
 * @class GetCargosService
 * @description Servicio para obtener todos los cargos, opcionalmente filtrados por estado
 */
class GetCargosService {
    private cargoRepository: CargoRepository

    constructor() {
        this.cargoRepository = new CargoRepository()
    }

    /**
     * Ejecuta la operación para obtener cargos
     * @returns {Promise<CargoResponse>} La respuesta de obtener los cargos
     */
    async execute(): Promise<CargoResponse> {
        return await this.cargoRepository.getAll()
    }
}

export default new GetCargosService()