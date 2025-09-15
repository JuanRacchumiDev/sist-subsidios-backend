import SedeRepository from '../../repositories/Sede/SedeRepository';
import { SedeResponse } from '../../interfaces/Sede/ISede';

/**
 * @class GetByNombreService
 * @description Servicio para obtener una sede por su nombre.
 */
class GetByNombreService {
    protected sedeRepository: SedeRepository

    constructor() {
        this.sedeRepository = new SedeRepository()
    }

    /**
     * Ejecuta la operación para obtener una sede por nombre.
     * @param {string} nombre - El nombre de la sede a buscar.
     * @returns {Promise<SedeResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<SedeResponse> {
        return await this.sedeRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();