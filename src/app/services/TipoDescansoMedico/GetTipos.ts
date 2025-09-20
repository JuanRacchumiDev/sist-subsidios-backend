import TipoDescansoMedicoRepository from "../../repositories/TipoDescansoMedico/TipoDescansoMedicoRepository";
import { TipoDescansoMedicoResponse } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';

/**
 * @class GetTiposService
 * @description Servicio para obtener todos los tipos de descanso médicos, opcionalmente filtrados por estado
 */
class GetTiposService {
    protected tipoDescansoMedicoRepository: TipoDescansoMedicoRepository

    constructor() {
        this.tipoDescansoMedicoRepository = new TipoDescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para obtener tipo de descanso médicos
     * @returns {Promise<TipoDescansoMedicoResponse>} La respuesta de obtener los tipo de descanso médicos
     */
    async execute(): Promise<TipoDescansoMedicoResponse> {
        return await this.tipoDescansoMedicoRepository.getAll()
    }
}

export default new GetTiposService()