import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository";
import { EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class GetEmpresabyNombreService
 * @description Servicio para obtener una sola empresa por nombre
 */
class GetEmpresaByNombreService {
    protected empresaRepository: EmpresaRepository

    constructor() {
        this.empresaRepository = new EmpresaRepository()
    }

    /**
     * Ejecuta la operación para obtener una empresa por razón social
     * @param {string} razonSocial - Razón social de la empresa a buscar 
     * @returns {Promise<EmpresaResponse>} La respuesta de la operación
     */
    async execute(razonSocial: string): Promise<EmpresaResponse> {
        return await this.empresaRepository.getByNombre(razonSocial)
    }
}

export default new GetEmpresaByNombreService()