import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';
import { TItemReport } from "../../types/DescansoMedico/TItemReport";

type TReportResponse = {
    result: boolean
    message?: string
    data?: TItemReport | TItemReport[]
    error?: string
    status?: number
}

/**
 * @class GetDescansosForReportService
 * @description Servicio para obtener todos los descansos médicos para reportes
 */
class GetDescansosForReportService {
    protected descansoMedicoRepository: DescansoMedicoRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para obtener descansos médicos
     * @returns {Promise<TReportResponse>} La respuesta de obtener los descansos médicos
     */
    async execute(): Promise<TReportResponse> {
        return await this.descansoMedicoRepository.getAllFilteredForReports()
    }
}

export default new GetDescansosForReportService()


// getAllFilteredForReports