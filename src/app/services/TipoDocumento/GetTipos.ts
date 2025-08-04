import TipoDocumentoRepository from "../../repositories/TipoDocumento/TipoDocumentoRepository";
import { TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';

/**
 * @class GetTiposService
 * @description Servicio para obtener todos los tipo de documentos, opcionalmente filtrados por estado
 */
class GetTiposService {
    /**
     * Ejecuta la operación para obtener tipo de documentos
     * @param {boolean | undefined} estado - Opcional. Filtra los tipo de documentos por su estado
     * @returns {Promise<TipoDocumentoResponse>} La respuesta de obtener los tipo de documentos
     */
    async execute(estado?: boolean): Promise<TipoDocumentoResponse> {
        if (typeof estado === 'boolean') {
            return await TipoDocumentoRepository.getAllByEstado(estado)
        }
        return await TipoDocumentoRepository.getAll()
    }
}

export default new GetTiposService()