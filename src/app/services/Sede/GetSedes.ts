import SedeRepository from "../../repositories/Sede/SedeRepository";
import { SedeResponse } from '../../interfaces/Sede/ISede';

/**
 * @class GetSedesService
 * @description Servicio para obtener todas las sedes, opcionalmente filtrados por estado
 */
class GetSedesService {
    protected sedeRepository: SedeRepository

    constructor() {
        this.sedeRepository = new SedeRepository()
    }

    /**
     * Ejecuta la operación para obtener sedes
     * @param {boolean | undefined} estado - Opcional. Filtra las sedes por su estado
     * @returns {Promise<SedeResponse>} La respuesta de obtener las sedes
     */
    async execute(estado?: boolean): Promise<SedeResponse> {
        // if (typeof estado === 'boolean') {
        //     return await SedeRepository.getAllByEstado(estado)
        // }

        return await this.sedeRepository.getAll()
    }
}

export default new GetSedesService()