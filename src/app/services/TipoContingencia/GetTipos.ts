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
     * @param {boolean | undefined} estado - Opcional. Filtra los tipo de contigencias por su estado
     * @returns {Promise<TipoContingenciaResponse>} La respuesta de obtener los tipo de contingencias
     */
    async execute(estado?: boolean): Promise<TipoContingenciaResponse> {
        // if (typeof estado === 'boolean') {
        //     return await TipoContingenciaRepository.getAllByEstado(estado)
        // }

        return await this.tipoContingenciaRepository.getAll()
    }
}

export default new GetTiposService()