import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { TItemReportSubsidios } from "../../types/DescansoMedico/TItemReport";

type TReportSubsidiosResponse = {
    result: boolean
    message?: string
    data?: TItemReportSubsidios | TItemReportSubsidios[]
    error?: string
    status?: number
}

/**
 * @class GetDescansosWithCanjesForReportService
 * @description Servicio para obtener todos los descansos médicos con canjes para reportes
 */
class GetDescansosWithCanjesForReportService {
    protected descansoMedicoRepository: DescansoMedicoRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para obtener descansos médicos con canjes
     * @returns {Promise<TReportSubsidiosResponse>} La respuesta de obtener los descansos médicos con canjes
     */
    async execute(): Promise<TReportSubsidiosResponse> {
        return await this.descansoMedicoRepository.getDescansosWithCanjesReports()
    }
}

export default new GetDescansosWithCanjesForReportService()


// getAllFilteredForReports