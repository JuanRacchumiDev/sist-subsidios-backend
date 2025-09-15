import RepresentanteRepository from "../../repositories/RepresentanteLegal/RepresentanteRepository";
import { RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class GetRepresentanteService
 * @description Servicio para obtener un representante legal por ID
 */
class GetRepresentanteService {
    protected representanteRepository: RepresentanteRepository

    constructor() {
        this.representanteRepository = new RepresentanteRepository()
    }

    /**
     * Ejecuta la operación para obtener un representante legal por ID
     * @param {string} id - El ID UUID del representante legal a buscar
     * @returns {Promise<RepresentanteLegalResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<RepresentanteLegalResponse> {
        return await this.representanteRepository.getById(id)
    }
}

export default new GetRepresentanteService()