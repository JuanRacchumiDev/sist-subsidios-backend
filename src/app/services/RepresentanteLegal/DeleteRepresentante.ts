import RepresentanteRepository from '../../repositories/RepresentanteLegal/RepresentanteRepository';
import { RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class DeleteRepresentante
 * @description Servicio para eliminar (soft delete) un representante legal.
 */
class DeleteRepresentante {
    /**
     * Ejecuta la operación de eliminación para un representante legal.
     * @param {string} id - El ID UUID del representante legal a eliminar.
     * @returns {Promise<RepresentanteLegalResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<RepresentanteLegalResponse> {
        return await RepresentanteRepository.delete(id);
    }
}

export default new DeleteRepresentante();