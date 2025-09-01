import RepresentanteRepository from "../../repositories/RepresentanteLegal/RepresentanteRepository";
import { RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class GetRepresentantesService
 * @description Servicio para obtener todas los representantes legales, opcionalmente filtrados por estado
 */
class GetRepresentantesService {
    /**
     * Ejecuta la operación para obtener representantes legales
     * @param {boolean | undefined} estado - Opcional. Filtra los representantes legales por su estado
     * @returns {Promise<RepresentanteLegalResponse>} La respuesta de obtener los representantes legales
     */
    async execute(estado?: boolean): Promise<RepresentanteLegalResponse> {
        return await RepresentanteRepository.getAll()
    }
}

export default new GetRepresentantesService()