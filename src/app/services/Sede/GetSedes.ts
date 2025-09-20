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
     * @returns {Promise<SedeResponse>} La respuesta de obtener las sedes
     */
    async execute(): Promise<SedeResponse> {
        return await this.sedeRepository.getAll()
    }
}

export default new GetSedesService()