import EmpresaRepository from '../../repositories/Empresa/EmpresaRepository';
import { EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class DeleteEmpresaService
 * @description Servicio para eliminar (soft delete) una empresa.
 */
class DeleteEmpresaService {
    /**
     * Ejecuta la operación de eliminación para una empresa.
     * @param {string} id - El ID UUID de la empresa a eliminar.
     * @returns {Promise<EmpresaResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<EmpresaResponse> {
        return await EmpresaRepository.delete(id);
    }
}

export default new DeleteEmpresaService();