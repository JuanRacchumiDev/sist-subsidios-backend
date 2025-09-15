import TipoDescansoMedicoRepository from '../../repositories/TipoDescansoMedico/TipoDescansoMedicoRepository';
import { TipoDescansoMedicoResponse } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un tipo de descanso médico por su nombre.
 */
class GetByNombreService {
    protected tipoDescansoMedicoRepository: TipoDescansoMedicoRepository

    constructor() {
        this.tipoDescansoMedicoRepository = new TipoDescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para obtener un tipo de descanso médico por nombre.
     * @param {string} nombre - El nombre del tipo de descanso médico a buscar.
     * @returns {Promise<TipoDescansoMedicoResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<TipoDescansoMedicoResponse> {
        return await this.tipoDescansoMedicoRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();