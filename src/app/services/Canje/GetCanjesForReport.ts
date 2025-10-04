import CanjeRepository from "../../repositories/Canje/CanjeRepository";

class GetCanjesForReportService {
    protected canjeRepository: CanjeRepository

    constructor() {
        this.canjeRepository = new CanjeRepository()
    }

    async execute(
        type: 'non_consecutive' | 'consecutive' | 'global',
        limit: number
    ) {
        return await this.canjeRepository.getSubsidiosOverLimit(type, limit)
    }
}

export default new GetCanjesForReportService()