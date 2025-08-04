import TipoDocumentoRepository from '../../repositories/TipoDocumento/TipoDocumentoRepository';
import { TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';

/**
 * @class GetByAbreviaturaService
 * @description Servicio para obtener un tipo de documento por su abreviatura.
 */
class GetByAbreviaturaService {
    /**
     * Ejecuta la operación para obtener un tipo de documento por abreviatura.
     * @param {string} abreviatura - La abreviatura del tipo de documento a buscar.
     * @returns {Promise<TipoDocumentoResponse>} La respuesta de la operación.
     */
    async execute(abreviatura: string): Promise<TipoDocumentoResponse> {
        return await TipoDocumentoRepository.getByAbreviatura(abreviatura);
    }
}

export default new GetByAbreviaturaService();