import ColaboradorRepository from "../../repositories/Colaborador/ColaboradorRepository";
import { ColaboradorResponse } from "../../interfaces/Colaborador/IColaborador";

/**
 * @class GetByIdTipoAndNumDocService
 * @description Servicio para obtener un colaborador por tipo y número de documento
 */
class GetByIdTipoAndNumDocService {
    /**
     * 
     * @param {string} idTipoDoc - El ID del tipo de documento del colaborador a buscar 
     * @param {string} numDoc - El número de documento del colaborador a buscar
     * @returns {Promise<ColaboradorResponse>} La respuesta de la operación
     */
    async execute(idTipoDoc: string, numDoc: string): Promise<ColaboradorResponse> {
        return await ColaboradorRepository.getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)
    }
}

export default new GetByIdTipoAndNumDocService()