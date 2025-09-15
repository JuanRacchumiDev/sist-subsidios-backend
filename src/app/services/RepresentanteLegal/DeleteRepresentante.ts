import RepresentanteRepository from '../../repositories/RepresentanteLegal/RepresentanteRepository';
import { RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class DeleteRepresentante
 * @description Servicio para eliminar (soft delete) un representante legal.
 */
class DeleteRepresentante {
    protected representanteRepository: RepresentanteRepository

    constructor() {
        this.representanteRepository = new RepresentanteRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un representante legal.
     * @param {string} id - El ID UUID del representante legal a eliminar.
     * @returns {Promise<RepresentanteLegalResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<RepresentanteLegalResponse> {
        return await this.representanteRepository.delete(id);
    }
}

export default new DeleteRepresentante();