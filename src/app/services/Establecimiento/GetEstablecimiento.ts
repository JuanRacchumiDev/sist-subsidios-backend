import EstablecimientoRepository from "../../repositories/Establecimiento/EstablecimientoRepository";
import { EstablecimientoResponse } from '../../interfaces/Establecimiento/IEstablecimiento';

/**
 * @class GetEstablecimientoService
 * @description Servicio para obtener un solo establecimiento por ID
 */
class GetEstablecimientoService {
    protected establecimientoRepository: EstablecimientoRepository

    constructor() {
        this.establecimientoRepository = new EstablecimientoRepository()
    }

    /**
     * Ejecuta la operación para obtener un establecimiento por ID
     * @param {string} id - El ID UUID del establecimiento a buscar
     * @returns {Promise<EstablecimientoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<EstablecimientoResponse> {
        return await this.establecimientoRepository.getById(id)
    }
}

export default new GetEstablecimientoService()