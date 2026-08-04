import ReembolsoRepository from '../../repositories/Reembolso/ReembolsoRepository';
import { IReembolso, ReembolsoResponse } from '../../interfaces/Reembolso/IReembolso';
import { IPersona } from "../../interfaces/Persona/IPersona"
import { EReembolso } from '../../enums/EReembolso';
// import { TDetallEReembolso } from '../../types/TDetalleEmail';
import { IDescansoMedico } from '../../interfaces/DescansoMedico/IDescansoMedico';
// import { notificationCanjeObservado } from '../../utils/emailTemplate';
import HDate from '../../../helpers/HDate';
// import { EmailRepository } from '../../repositories/Email/EmailRepository'

/**
 * @class UpdateReembolsoService
 * @description Servicio para actualizar un canje existente, incluyendo el cambio de estado.
 */
class UpdateReembolsoService {
    private reembolsoRepository: ReembolsoRepository
    // private emailRepository: EmailRepository

    constructor() {
        this.reembolsoRepository = new ReembolsoRepository()
        // this.reembolsoRepository = new ReembolsoRepository()
        // this.emailRepository = new EmailRepository()
    }

    /**
     * Ejecuta la operación para actualizar un canje.
     * Puede actualizar cualquier campo definido en IReembolso, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del canje a actualizar.
     * @param {IReembolso} payload - Los datos parciales o completos del reembolso a actualizar.
     * @returns {Promise<ReembolsoResponse>} La respuesta de la operación.
     */
    async execute(id: string, payload: IReembolso): Promise<ReembolsoResponse> {
        const responseReembolso = await this.reembolsoRepository.update(id, payload);

        return {
            ...responseReembolso
        }
    }
}

export default new UpdateReembolsoService();