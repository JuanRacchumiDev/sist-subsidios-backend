import TipoDocumentoRepository from '../../repositories/TipoDocumento/TipoDocumentoRepository';
import { TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un tipo de documento por su nombre.
 */
class GetByNombreService {
    /**
     * Ejecuta la operación para obtener un tipo de documento por nombre.
     * @param {string} nombre - El nombre del tipo de documento a buscar.
     * @returns {Promise<TipoDocumentoResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<TipoDocumentoResponse> {
        return await TipoDocumentoRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();