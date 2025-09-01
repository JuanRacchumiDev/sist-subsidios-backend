import RepresentanteRepository from "../../repositories/RepresentanteLegal/RepresentanteRepository";
import { RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class GetRepresentantesByEmpresaService
 * @description Servicio para obtener todos los representantes legales filtrados por empresa
 */
class GetRepresentantesByEmpresaService {
    /**
     * Obtiene los representantes legales por ID de empresa
     * @param {string} idEmpresa - Identificador único de una empresa 
     * @returns {Promise<RepresentanteLegalResponse>}
     */
    async execute(idEmpresa: string): Promise<RepresentanteLegalResponse> {
        return await RepresentanteRepository.getByIdEmpresa(idEmpresa)
    }
}

export default new GetRepresentantesByEmpresaService()