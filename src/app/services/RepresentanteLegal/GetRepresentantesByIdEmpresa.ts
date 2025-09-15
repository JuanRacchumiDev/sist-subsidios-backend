import RepresentanteRepository from "../../repositories/RepresentanteLegal/RepresentanteRepository";
import { RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class GetRepresentantesByEmpresaService
 * @description Servicio para obtener todos los representantes legales filtrados por empresa
 */
class GetRepresentantesByEmpresaService {
    protected representanteRepository: RepresentanteRepository

    constructor() {
        this.representanteRepository = new RepresentanteRepository()
    }

    /**
     * Obtiene los representantes legales por ID de empresa
     * @param {string} idEmpresa - Identificador único de una empresa 
     * @returns {Promise<RepresentanteLegalResponse>}
     */
    async execute(idEmpresa: string): Promise<RepresentanteLegalResponse> {
        return await this.representanteRepository.getByIdEmpresa(idEmpresa)
    }
}

export default new GetRepresentantesByEmpresaService()