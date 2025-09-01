import RepresentanteRepository from '../../repositories/RepresentanteLegal/RepresentanteRepository';
import { IRepresentanteLegal, RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class UpdateRepresentante
 * @description Servicio para actualizar un representante legal existente, incluyendo el cambio de estado.
 */
class UpdateRepresentante {
    /**
     * Ejecuta la operación para actualizar un representante legal.
     * Puede actualizar cualquier campo definido en IRepresentanteLegal, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID de la sede a actualizar.
     * @param {IRepresentanteLegal} data - Los datos parciales o completos del representante legal a actualizar.
     * @returns {Promise<RepresentanteLegalResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IRepresentanteLegal): Promise<RepresentanteLegalResponse> {
        return await RepresentanteRepository.update(id, data);
    }
}

export default new UpdateRepresentante();