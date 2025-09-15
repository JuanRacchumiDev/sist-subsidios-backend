import TipoContingenciaRepository from '../../repositories/TipoContingencia/TipoContingenciaRepository';
import { TipoContingenciaResponse } from '../../interfaces/TipoContingencia/ITipoContingencia';

/**
 * @class DeleteTipoService
 * @description Servicio para eliminar (soft delete) un tipo de contingencia.
 */
class DeleteTipoService {
    protected tipoContingenciaRepository: TipoContingenciaRepository

    constructor() {
        this.tipoContingenciaRepository = new TipoContingenciaRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un tipo de contingencia.
     * @param {string} id - El ID UUID del tipo de contingencia a eliminar.
     * @returns {Promise<TipoContingenciaResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<TipoContingenciaResponse> {
        return await this.tipoContingenciaRepository.delete(id);
    }
}

export default new DeleteTipoService();