import AreaRepository from "../../repositories/Area/AreaRepository";
import { AreaResponse } from '../../interfaces/Area/IArea';

/**
 * @class GetAreaService
 * @description Servicio para obtener una sola área por ID
 */
class GetAreaService {
    private areaRepository: AreaRepository

    constructor() {
        this.areaRepository = new AreaRepository()
    }
    /**
     * Ejecuta la operación para obtener un área por ID
     * @param {string} id - El ID UUID del área a buscar
     * @returns {Promise<AreaResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<AreaResponse> {
        return await this.areaRepository.getById(id)
    }
}

export default new GetAreaService()