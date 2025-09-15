import TipoDescansoMedicoRepository from "../../repositories/TipoDescansoMedico/TipoDescansoMedicoRepository";
import { TipoDescansoMedicoResponse } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';

/**
 * @class GetTipoService
 * @description Servicio para obtener un solo tipo de descanso médico por ID
 */
class GetTipoService {
    protected tipoDescansoMedicoRepository: TipoDescansoMedicoRepository

    constructor() {
        this.tipoDescansoMedicoRepository = new TipoDescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para obtener un tipo de descanso médico por ID
     * @param {string} id - El ID UUID del tipo de descanso médico a buscar
     * @returns {Promise<TipoDescansoMedicoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<TipoDescansoMedicoResponse> {
        return await this.tipoDescansoMedicoRepository.getById(id)
    }
}

export default new GetTipoService()