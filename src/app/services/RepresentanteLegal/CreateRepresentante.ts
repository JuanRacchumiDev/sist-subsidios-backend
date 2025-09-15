import RepresentanteRepository from '../../repositories/RepresentanteLegal/RepresentanteRepository';
import { IRepresentanteLegal, RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class CreateRepresentanteService
 * @description Servicio para crear un nuevo representante legal.
 */
class CreateRepresentanteService {
    protected representanteRepository: RepresentanteRepository

    constructor() {
        this.representanteRepository = new RepresentanteRepository()
    }

    /**
     * Ejecuta la operación para crear un representante legal.
     * @param {IRepresentanteLegal} data - Los datos del representante legal a crear.
     * @returns {Promise<RepresentanteLegalResponse>} La respuesta de la operación.
     */
    async execute(data: IRepresentanteLegal): Promise<RepresentanteLegalResponse> {
        return await this.representanteRepository.create(data);
    }
}

export default new CreateRepresentanteService();