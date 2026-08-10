import CanjeRepository from "../../repositories/Canje/CanjeRepository";
import { TItemReport } from "../../types/Canje/TItemReport";

export type TReportType = 'no_consecutivos_90' | 'consecutivos_150' | 'global_340';

class GetCanjesForReportService {
    protected canjeRepository: CanjeRepository;

    constructor() {
        this.canjeRepository = new CanjeRepository();
    }

    /**
     * Obtiene reporte de 90 días no consecutivos (is_continuo = false)
     */
    async getReporte90DiasNoConsecutivos(fechaInicio?: string, fechaFinal?: string): Promise<TItemReport[]> {
        return await this.canjeRepository.getReporte90DiasNoConsecutivos(fechaInicio, fechaFinal);
    }

    /**
     * Obtiene reporte de 150 días consecutivos (is_continuo = true)
     */
    async getReporte150DiasConsecutivos(fechaInicio?: string, fechaFinal?: string): Promise<TItemReport[]> {
        return await this.canjeRepository.getReporte150DiasConsecutivos(fechaInicio, fechaFinal);
    }

    /**
     * Obtiene reporte de 340 días globales (acumulado general)
     */
    async getReporte340DiasGlobales(fechaInicio?: string, fechaFinal?: string): Promise<TItemReport[]> {
        return await this.canjeRepository.getReporte340DiasGlobales(fechaInicio, fechaFinal);
    }

    /**
     * Método ejecutor unificado por tipo de reporte
     */
    async execute(
        type: TReportType,
        fechaInicio?: string,
        fechaFinal?: string
    ): Promise<TItemReport[]> {
        return await this.canjeRepository.getSubsidiosOverLimit(type, fechaInicio, fechaFinal);
    }
}

export default new GetCanjesForReportService();