import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository";
import { EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class GetEmpresaByParamsService
 * @description Servicio para obtener empresas por filtros opcionales (razonSocial, ruc)
 */
class GetEmpresaByParamsService {
    protected empresaRepository: EmpresaRepository;

    constructor() {
        this.empresaRepository = new EmpresaRepository();
    }

    /**
     * Ejecuta la operación de filtrado
     * @param {string} [razonSocial] - Razón social opcional
     * @param {string} [ruc] - RUC opcional
     * @returns {Promise<EmpresaResponse>}
     */
    async execute(razonSocial?: string, ruc?: string): Promise<EmpresaResponse> {
        return await this.empresaRepository.getByParams(razonSocial, ruc);
    }
}

export default new GetEmpresaByParamsService();