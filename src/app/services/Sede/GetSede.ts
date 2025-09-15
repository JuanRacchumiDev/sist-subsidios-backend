import SedeRepository from "../../repositories/Sede/SedeRepository";
import { SedeResponse } from '../../interfaces/Sede/ISede';

/**
 * @class GetSedeService
 * @description Servicio para obtener una sola sede por ID
 */
class GetSedeService {
    protected sedeRepository: SedeRepository

    constructor() {
        this.sedeRepository = new SedeRepository()
    }

    /**
     * Ejecuta la operación para obtener una sede por ID
     * @param {string} id - El ID UUID de la sede a buscar
     * @returns {Promise<SedeResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<SedeResponse> {
        return await this.sedeRepository.getById(id)
    }
}

export default new GetSedeService()