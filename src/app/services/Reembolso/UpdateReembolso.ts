import ReembolsoRepository from '../../repositories/Reembolso/ReembolsoRepository';
import { IReembolso, ReembolsoResponse } from '../../interfaces/Reembolso/IReembolso';
import { IPersona } from "../../interfaces/Persona/IPersona"
import { EReembolso } from '../../enums/EReembolso';
// import { TDetallEReembolso } from '../../types/TDetalleEmail';
import { IDescansoMedico } from '../../interfaces/DescansoMedico/IDescansoMedico';
// import { notificationCanjeObservado } from '../../utils/emailTemplate';
import HDate from '../../../helpers/HDate';
import { TDetalleReembolso } from '../../types/TDetalleEmail';
import { notificationCanjeObservado } from '../../utils/emailTemplate';
import { CobroResponse, ICobro } from '../../interfaces/Cobro/ICobro';
import { ECobro } from '../../enums/ECobro';
import CobroRepository from '../../repositories/Cobro/CobroRepository';
import { EmailRepository } from '../../repositories/Email/EmailRepository';
import { ICanje } from '../../interfaces/Canje/ICanje';
// import { EmailRepository } from '../../repositories/Email/EmailRepository'

/**
 * @class UpdateReembolsoService
 * @description Servicio para actualizar un canje existente, incluyendo el cambio de estado.
 */
class UpdateReembolsoService {
    private reembolsoRepository: ReembolsoRepository
    private cobroRepository: CobroRepository
    private emailRepository: EmailRepository
    // private emailRepository: EmailRepository

    constructor() {
        this.reembolsoRepository = new ReembolsoRepository()
        this.cobroRepository = new CobroRepository()
        // this.reembolsoRepository = new ReembolsoRepository()
        this.emailRepository = new EmailRepository()
    }

    /**
     * Ejecuta la operación para actualizar un canje.
     * Puede actualizar cualquier campo definido en IReembolso, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del canje a actualizar.
     * @param {IReembolso} payload - Los datos parciales o completos del reembolso a actualizar.
     * @returns {Promise<ReembolsoResponse>} La respuesta de la operación.
     */
    async execute(id: string, payload: IReembolso): Promise<ReembolsoResponse | CobroResponse> {
        const responseReembolso = await this.reembolsoRepository.update(id, payload);

        console.log({ responseReembolso })

        const { result, data } = responseReembolso

        if (!result) {
            return responseReembolso
        }

        // Si el estado es incorrecto, enviar correo de notificación al colaborador
        const reembolso = data as IReembolso
        console.log('reembolso update', reembolso)

        const { estado_registro, user_crea, user_actualiza, fecha_registro, observacion, canje, nombre_colaborador } = reembolso

        if (estado_registro === EReembolso.REEMBOLSO_OBSERVADO) {
            const detalleReembolso: TDetalleReembolso = {
                fecha_registro,
                observacion
            }

            const dataEmail = {
                nombreCompleto: nombre_colaborador as string,
                detalle: detalleReembolso,
                appUrl: process.env.APP_URL || "http://localhost:300"
            }

            console.log({ dataEmail })

            const htmlContent = notificationCanjeObservado(dataEmail)

            // await this.emailRepository.sendEmail({
            //     to: canje?.colaborador?.email_personal as string,
            //     subject: '¡ESTADO DEL PROCESO DE CANJE!',
            //     html: htmlContent
            // });

            console.log(`Correo de notificación de estado de descanso médico ${nombre_colaborador as string}`);
        } else if (estado_registro === EReembolso.REEMBOLSO_CORRECTO) {
            // Registrar nuevo cobro
            const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')

            const payloadCobro: ICobro = {
                id_reembolso: id,
                fecha_registro: fechaActual,
                estado_registro: ECobro.COBRO_INGRESADO,
                user_crea: (user_actualiza ? user_actualiza : user_crea) as string
            }

            console.log({ payloadCobro })

            const responseCobro = await this.cobroRepository.create(payloadCobro)

            console.log({ responseCobro })

            const { result: resultCobro } = responseCobro

            if (!resultCobro) {
                return {
                    result: false,
                    message: 'Error al registrar el reembolso',
                    status: 500
                };
            }

            return responseCobro
        }

        return responseReembolso
    }
}

export default new UpdateReembolsoService();