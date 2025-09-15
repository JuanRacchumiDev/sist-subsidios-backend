import TipoAdjuntoRepository from "../../repositories/TipoAdjunto/TipoAdjuntoRepository";
import { TipoAdjuntoResponse } from '../../interfaces/TipoAdjunto/ITipoAdjunto';

/**
 * @class GetTipoAdjuntosService
 * @description Servicio para obtener todos los tipos de adjuntos, opcionalmente filtrados por estado
 */
class GetTipoAdjuntosService {
    protected tipoAdjuntoRepository: TipoAdjuntoRepository

    constructor() {
        this.tipoAdjuntoRepository = new TipoAdjuntoRepository()
    }

    /**
     * Ejecuta la operación para obtener tipos de adjuntos
     * @param {boolean | undefined} estado - Opcional. Filtra los tipos de adjuntos por su estado
     * @returns {Promise<TipoAdjuntoResponse>} La respuesta de obtener los tipos de adjuntos
     */
    async execute(estado?: boolean): Promise<TipoAdjuntoResponse> {
        // if (typeof estado === 'boolean') {
        //     return await TipoAdjuntoRepository.getAllByEstado(estado)
        // }

        return await this.tipoAdjuntoRepository.getAll()
    }
}

export default new GetTipoAdjuntosService()