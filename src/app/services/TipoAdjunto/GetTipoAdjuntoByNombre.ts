import { TipoAdjuntoResponse } from "../../interfaces/TipoAdjunto/ITipoAdjunto"
import TipoAdjuntoRepository from "../../repositories/TipoAdjunto/TipoAdjuntoRepository"

class GetTipoAdjuntoByNombreService {
    protected tipoAdjuntoRepository: TipoAdjuntoRepository

    constructor() {
        this.tipoAdjuntoRepository = new TipoAdjuntoRepository()
    }

    /**
     * Ejecuta la operación para obtener un tipo de adjunto por nombre
     * @param {string} nombre - El nombre del tipo de adjunto a buscar 
     * @returns {Promise<TipoAdjuntoResponse>} La respuesta de la operación
     */
    async execute(nombre: string): Promise<TipoAdjuntoResponse> {
        return await this.tipoAdjuntoRepository.getByNombre(nombre)
    }
}

export default new GetTipoAdjuntoByNombreService()