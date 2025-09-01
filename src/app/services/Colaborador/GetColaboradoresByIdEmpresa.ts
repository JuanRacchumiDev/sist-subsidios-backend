import ColaboradorRepository from "../../repositories/Colaborador/ColaboradorRepository";
import { ColaboradorResponse } from '../../interfaces/Colaborador/IColaborador';

/**
 * @class GetColaboradoresByEmpresaService
 * @description Servicio para obtener todos los colaboradores filtrados por empresa
 */
class GetColaboradoresByEmpresaService {
    /**
     * Obtiene los colaboradores por ID de empresa
     * @param {string} idEmpresa - Identificador único de una empresa 
     * @returns {Promise<ColaboradorResponse>}
     */
    async execute(idEmpresa: string): Promise<ColaboradorResponse> {
        return await ColaboradorRepository.getByIdEmpresa(idEmpresa)
    }
}

export default new GetColaboradoresByEmpresaService()