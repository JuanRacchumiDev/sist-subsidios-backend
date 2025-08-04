import TipoDescansoMedicoRepository from '../../repositories/TipoDescansoMedico/TipoDescansoMedicoRepository';
import { ITipoDescansoMedico, TipoDescansoMedicoResponse } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';

/**
 * @class UpdateTipoService
 * @description Servicio para actualizar un tipo de descanso médico existente, incluyendo el cambio de estado.
 */
class UpdateTipoService {
    /**
     * Ejecuta la operación para actualizar un tipo de descanso médico.
     * Puede actualizar cualquier campo definido en ITipoDescansoMedico, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del tipo de descanso médico a actualizar.
     * @param {ITipoDescansoMedico} data - Los datos parciales o completos del tipo de descanso médico a actualizar.
     * @returns {Promise<TipoDescansoMedicoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ITipoDescansoMedico): Promise<TipoDescansoMedicoResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
            return await TipoDescansoMedicoRepository.updateEstado(id, data.estado);
        }
        return await TipoDescansoMedicoRepository.update(id, data);
    }
}

export default new UpdateTipoService();