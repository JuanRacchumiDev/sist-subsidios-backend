import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { DescansoMedicoResponsePaginate } from '../../interfaces/DescansoMedico/IDescansoMedico';

/**
 * @class GetDescansosByColaboradorPaginate
 * @description Servicio para obtener todas los descansos médicos por colaborador con paginación, opcionalmente filtrados por estado
 */
class GetDescansosByColaboradorPaginate {
    protected descansoMedicoRepository: DescansoMedicoRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para obtener descansos médicos por colaborador paginadas
     * @param {string} idColaborador - Identificador único del colaborador
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<DescansoMedicoResponsePaginate>} La respuesta de obtener los descansos médicos por colaborador paginado
     */
    async execute(idColaborador: string, page: number, limit: number): Promise<DescansoMedicoResponsePaginate> {
        return await this.descansoMedicoRepository.getAllByColaboradorPaginate(idColaborador, page, limit)
    }
}

export default new GetDescansosByColaboradorPaginate()