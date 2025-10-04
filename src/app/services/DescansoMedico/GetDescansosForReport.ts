import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';
import { TItemReportDescansos } from "../../types/DescansoMedico/TItemReport";

type TReportDescansosResponse = {
    result: boolean
    message?: string
    data?: TItemReportDescansos | TItemReportDescansos[]
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
     * @returns {Promise<TReportDescansosResponse>} La respuesta de obtener los descansos médicos
     */
    async execute(): Promise<TReportDescansosResponse> {
        return await this.descansoMedicoRepository.getDescansosReport()
    }
}

export default new GetDescansosForReportService()


// getAllFilteredForReports