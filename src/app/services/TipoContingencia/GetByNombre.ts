import TipoContingenciaRepository from '../../repositories/TipoContingencia/TipoContingenciaRepository';
import { TipoContingenciaResponse } from '../../interfaces/TipoContingencia/ITipoContingencia';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un tipo de contingencia por su nombre.
 */
class GetByNombreService {
    protected tipoContingenciaRepository: TipoContingenciaRepository

    constructor() {
        this.tipoContingenciaRepository = new TipoContingenciaRepository()
    }

    /**
     * Ejecuta la operación para obtener un tipo de contingencia por nombre.
     * @param {string} nombre - El nombre del tipo de contingencia a buscar.
     * @returns {Promise<TipoContingenciaResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<TipoContingenciaResponse> {
        return await this.tipoContingenciaRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();