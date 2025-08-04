import EmpresaRepository from '../../repositories/Empresa/EmpresaRepository';
import { IEmpresa, EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class CreateEmpresaService
 * @description Servicio para crear una nueva empresa.
 */
class CreateEmpresaService {
    /**
     * Ejecuta la operación para crear una empresa.
     * @param {IEmpresa} data - Los datos de la empresa a crear.
     * @returns {Promise<EmpresaResponse>} La respuesta de la operación.
     */
    async execute(data: IEmpresa): Promise<EmpresaResponse> {
        return await EmpresaRepository.create(data);
    }
}

export default new CreateEmpresaService();