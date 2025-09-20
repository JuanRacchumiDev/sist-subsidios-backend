import TipoContingenciaRepository from "../../repositories/TipoContingencia/TipoContingenciaRepository";
import { TipoContingenciaResponse } from '../../interfaces/TipoContingencia/ITipoContingencia';

/**
 * @class GetTiposService
 * @description Servicio para obtener todos los tipos de contingencia, opcionalmente filtrados por estado
 */
class GetTiposService {
    protected tipoContingenciaRepository: TipoContingenciaRepository

    constructor() {
        this.tipoContingenciaRepository = new TipoContingenciaRepository()
    }

    /**
     * Ejecuta la operación para obtener tipo de contingencias
     * @returns {Promise<TipoContingenciaResponse>} La respuesta de obtener los tipo de contingencias
     */
    async execute(): Promise<TipoContingenciaResponse> {
        return await this.tipoContingenciaRepository.getAll()
    }
}

export default new GetTiposService()