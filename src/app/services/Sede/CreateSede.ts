import SedeRepository from '../../repositories/Sede/SedeRepository';
import { ISede, SedeResponse } from '../../interfaces/Sede/ISede';

/**
 * @class CreateSedeService
 * @description Servicio para crear una nueva sede.
 */
class CreateSedeService {
    protected sedeRepository: SedeRepository

    constructor() {
        this.sedeRepository = new SedeRepository()
    }

    /**
     * Ejecuta la operación para crear una sede.
     * @param {ISede} data - Los datos de la sede a crear.
     * @returns {Promise<SedeResponse>} La respuesta de la operación.
     */
    async execute(data: ISede): Promise<SedeResponse> {
        return await this.sedeRepository.create(data);
    }
}

export default new CreateSedeService();