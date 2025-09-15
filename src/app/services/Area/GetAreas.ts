import AreaRepository from "../../repositories/Area/AreaRepository";
import { AreaResponse } from '../../interfaces/Area/IArea';

/**
 * @class GetAreasService
 * @description Servicio para obtener todas las áreas, opcionalmente filtradas por estado
 */
class GetAreasService {
    private areaRepository: AreaRepository

    constructor() {
        this.areaRepository = new AreaRepository()
    }

    /**
     * Ejecuta la operación para obtener áreas
     * @param {boolean | undefined} estado - Opcional. Filtra las áreas por su estado
     * @returns {Promise<AreaResponse>} La respuesta de obtener las áreas
     */
    async execute(estado?: boolean): Promise<AreaResponse> {
        // if (typeof estado === 'boolean') {
        //     return await this.areaRepository.getAllByEstado(estado)
        // }
        return await this.areaRepository.getAll()
    }
}

export default new GetAreasService()