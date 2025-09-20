import CargoRepository from "../../repositories/Cargo/CargoRepository";
import { CargoResponsePaginate } from '../../interfaces/Cargo/ICargo';

/**
 * @class GetCargosPaginateService
 * @description Servicio para obtener todas los cargos con paginación, opcionalmente filtrados por estado
 */
class GetCargosPaginateService {
    private cargoRepository: CargoRepository

    constructor() {
        this.cargoRepository = new CargoRepository()
    }

    /**
     * Ejecuta la operación para obtener cargos paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<CargoResponsePaginate>} La respuesta de obtener los cargos
     */
    async execute(page: number, limit: number): Promise<CargoResponsePaginate> {
        return await this.cargoRepository.getAllWithPaginate(page, limit)
    }
}

export default new GetCargosPaginateService()
