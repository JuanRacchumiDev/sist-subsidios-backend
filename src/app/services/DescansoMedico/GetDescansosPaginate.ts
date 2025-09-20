import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { DescansoMedicoResponsePaginate } from '../../interfaces/DescansoMedico/IDescansoMedico';

/**
 * @class GetDescansosPaginateService
 * @description Servicio para obtener todas los descansos médicos con paginación, opcionalmente filtrados por estado
 */
class GetDescansosPaginateService {
    protected descansoMedicoRepository: DescansoMedicoRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para obtener descansos médicos paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<DescansoMedicoResponsePaginate>} La respuesta de obtener los descansos médicos
     */
    async execute(page: number, limit: number): Promise<DescansoMedicoResponsePaginate> {
        return await this.descansoMedicoRepository.getAllWithPaginate(page, limit)
    }
}

export default new GetDescansosPaginateService()