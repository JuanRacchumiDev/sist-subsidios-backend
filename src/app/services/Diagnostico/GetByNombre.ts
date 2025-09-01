import DiagnosticoRepository from '../../repositories/Diagnostico/DiagnosticoRepository';
import { DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un diagnóstico por su nombre.
 */
class GetByNombreService {
    /**
     * Ejecuta la operación para obtener un diagnóstico por nombre.
     * @param {string} nombre - El nombre del diagnóstico a buscar.
     * @returns {Promise<DiagnosticoResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<DiagnosticoResponse> {
        return await DiagnosticoRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();