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
     * @param {boolean | undefined} estado - Opcional. Filtra los cargos por su estado
     * @returns {Promise<CargoResponsePaginate>} La respuesta de obtener los cargos
     */
    async execute(page: number, limit: number, estado?: boolean): Promise<CargoResponsePaginate> {
        return await this.cargoRepository.getAllWithPaginate(page, limit, estado)
    }
}

export default new GetCargosPaginateService()
