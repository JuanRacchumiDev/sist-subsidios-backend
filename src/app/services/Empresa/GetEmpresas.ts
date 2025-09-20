import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository";
import { EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class GetEmpresasService
 * @description Servicio para obtener todas las empresas, opcionalmente filtrados por estado
 */
class GetEmpresasService {
    protected empresaRepository: EmpresaRepository

    constructor() {
        this.empresaRepository = new EmpresaRepository()
    }

    /**
     * Ejecuta la operación para obtener empresas
     * @returns {Promise<EmpresaResponse>} La respuesta de obtener las empresas
     */
    async execute(): Promise<EmpresaResponse> {
        return await this.empresaRepository.getAll()
    }
}

export default new GetEmpresasService()