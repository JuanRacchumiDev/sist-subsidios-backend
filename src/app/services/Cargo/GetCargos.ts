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
     * @param {boolean | undefined} estado - Opcional. Filtra los cargos por su estado
     * @returns {Promise<CargoResponse>} La respuesta de obtener los cargos
     */
    async execute(estado?: boolean): Promise<CargoResponse> {
        // if (typeof estado === 'boolean') {
        //     return await CargoRepository.getAllByEstado(estado)
        // }
        return await this.cargoRepository.getAll()
    }
}

export default new GetCargosService()