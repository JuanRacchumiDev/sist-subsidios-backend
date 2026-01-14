import DetalleRepository from '../../repositories/DetalleParametro/DetalleParametroRepository';
import { IDetalleParametro, DetalleParametroResponse } from '../../interfaces/DetalleParametro/IDetalleParametro';

/**
 * @class UpdateDetalleService
 * @description Servicio para actualizar un detalle existente, incluyendo el cambio de estado.
 */
class UpdateDetalleService {
    private detalleRepository: DetalleRepository

    constructor() {
        this.detalleRepository = new DetalleRepository()
    }

    /**
     * Ejecuta la operación para actualizar un detalle.
     * Puede actualizar cualquier campo definido en IDetalleParametro, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del cargo a actualizar.
     * @param {IDetalleParametro} data - Los datos parciales o completos del cargo a actualizar.
     * @returns {Promise<DetalleParametroResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IDetalleParametro): Promise<DetalleParametroResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        // if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
        //     return await DetalleRepository.updateEstado(id, data.estado);
        // }
        return await this.detalleRepository.update(id, data);
    }
}

export default new UpdateDetalleService();