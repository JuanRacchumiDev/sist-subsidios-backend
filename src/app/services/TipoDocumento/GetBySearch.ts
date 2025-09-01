import TipoDocumentoRepository from '../../repositories/TipoDocumento/TipoDocumentoRepository';
import { TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';
import { TTipoDocumentoSearch } from '../../types/TipoDocumento/TTipoDocumentoSearch';

/**
 * @class GetBySearchService
 * @description Servicio para obtener un tipo de documento por su búsqueda.
 */
class GetBySearchService {
    /**
     * Ejecuta la operación para obtener un tipo de documento por búsqueda.
     * @param {object} search - Objeto de búsqueda que puede contener 'nombre' y/o 'abreviatura'.
     * @returns {Promise<TipoDocumentoResponse>} La respuesta de la operación.
     */
    async execute(search: TTipoDocumentoSearch): Promise<TipoDocumentoResponse> {
        return await TipoDocumentoRepository.getBySearch(search);
    }
}

export default new GetBySearchService();