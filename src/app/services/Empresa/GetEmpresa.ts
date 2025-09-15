import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository";
import { EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class GetEmpresaService
 * @description Servicio para obtener una sola empresa por ID
 */
class GetEmpresaService {
    protected empresaRepository: EmpresaRepository

    constructor() {
        this.empresaRepository = new EmpresaRepository()
    }

    /**
     * Ejecuta la operación para obtener una empresa por ID
     * @param {string} id - El ID UUID de la empresa a buscar
     * @returns {Promise<EmpresaResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<EmpresaResponse> {
        return await this.empresaRepository.getById(id)
    }
}

export default new GetEmpresaService()