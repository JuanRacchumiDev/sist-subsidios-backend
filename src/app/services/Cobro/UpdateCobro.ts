import CargoRepository from '../../repositories/Cargo/CargoRepository';
import { ICargo, CargoResponse } from '../../interfaces/Cargo/ICargo';

/**
 * @class UpdateCargoService
 * @description Servicio para actualizar un cargo existente, incluyendo el cambio de estado.
 */
class UpdateCargoService {
    /**
     * Ejecuta la operación para actualizar un cargo.
     * Puede actualizar cualquier campo definido en ICargo, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del cargo a actualizar.
     * @param {ICargo} data - Los datos parciales o completos del cargo a actualizar.
     * @returns {Promise<CargoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ICargo): Promise<CargoResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
            return await CargoRepository.updateEstado(id, data.estado);
        }
        return await CargoRepository.update(id, data);
    }
}

export default new UpdateCargoService();