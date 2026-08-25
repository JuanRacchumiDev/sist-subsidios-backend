import CanjeRepository from '../../repositories/Canje/CanjeRepository';
import { ICanje, CanjeResponse } from '../../interfaces/Canje/ICanje';
import { IReembolso, ReembolsoResponse } from '../../interfaces/Reembolso/IReembolso'
import { IPersona } from "../../interfaces/Persona/IPersona"
import { ECanje } from '../../enums/ECanje';
import { TDetalleCanje } from '../../types/TDetalleEmail';
import { IDescansoMedico } from '../../interfaces/DescansoMedico/IDescansoMedico';
import { notificationCanjeObservado } from '../../utils/emailTemplate';
import { EReembolso } from '../../enums/EReembolso';
import ReembolsoRepository from '../../repositories/Reembolso/ReembolsoRepository';
import HDate from '../../../helpers/HDate';
import { EmailRepository } from '../../repositories/Email/EmailRepository'
import { FECHA_MAXIMA_REEMBOLSO } from '../../../helpers/HParameter';

/**
 * @class UpdateCanjeService
 * @description Servicio para actualizar un canje existente, incluyendo el cambio de estado.
 */
class UpdateCanjeService {
    private canjeRepository: CanjeRepository
    private reembolsoRepository: ReembolsoRepository
    private emailRepository: EmailRepository

    constructor() {
        this.canjeRepository = new CanjeRepository()
        this.reembolsoRepository = new ReembolsoRepository()
        this.emailRepository = new EmailRepository()
    }

    /**
     * Ejecuta la operación para actualizar un canje.
     * Puede actualizar cualquier campo definido en ICanje, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del canje a actualizar.
     * @param {ICanje} payload - Los datos parciales o completos del canje a actualizar.
     * @returns {Promise<CanjeResponse | ReembolsoResponse>} La respuesta de la operación.
     */
    async execute(id: string, payload: ICanje): Promise<CanjeResponse | ReembolsoResponse> {
        const responseCanje = await this.canjeRepository.update(id, payload);

        console.log({ responseCanje })

        const { result, data } = responseCanje

        if (!result) {
            return responseCanje
        }

        // Si el estado es incorrecto, enviar correo de notificación al colaboraor
        const canje = data as ICanje
        console.log('canje update', canje)

        const {
            fecha_inicio_subsidio,
            fecha_final_subsidio,
            total_dias: totalDiasCanje,
            estado_registro,
            observacion,
            descansoMedico,
            user_crea,
            user_actualiza
        } = canje

        console.log({ user_crea })

        console.log({ user_actualiza })

        console.log('canje.descansomedico', descansoMedico)

        const detalleDescansoMedico = descansoMedico as IDescansoMedico

        const {
            fecha_inicio,
            fecha_final,
            total_dias: totalDiasDM,
            nombre_tipocontingencia,
            nombre_tipodescansomedico,
            nombre_diagnostico,
            nombre_establecimiento
        } = detalleDescansoMedico

        const colaborador = descansoMedico?.colaborador_dm as IPersona

        console.log({ colaborador })

        const { id: idColaborador, email_personal, nombre_completo } = colaborador

        if (estado_registro === ECanje.CANJE_OBSERVADO) {
            const detalleCanje: TDetalleCanje = {
                fecha_inicio_subsidio,
                fecha_final_subsidio,
                total_dias: totalDiasCanje,
                observacion,
                descansoMedico: {
                    fecha_inicio,
                    fecha_final,
                    total_dias: totalDiasDM,
                    nombre_tipocontingencia,
                    nombre_tipodescansomedico,
                    nombre_diagnostico,
                    nombre_establecimiento
                }
            }

            const dataEmail = {
                nombreCompleto: nombre_completo as string,
                detalle: detalleCanje,
                appUrl: process.env.APP_URL || 'http://localhost:3000'
            }

            console.log({ dataEmail })

            const htmlContent = notificationCanjeObservado(dataEmail)

            await this.emailRepository.sendEmail({
                to: email_personal as string,
                subject: '¡ESTADO DEL PROCESO DE CANJE!',
                html: htmlContent
            });

            console.log(`Correo de notificación de estado de descanso médico ${nombre_completo as string}`);
        } else if (estado_registro === ECanje.CANJE_CONFORME) {
            // Registrar nuevo reembolso
            const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')

            const fechaMaximaReembolso = HDate.addDaysToDate(fecha_inicio as string, FECHA_MAXIMA_REEMBOLSO)

            const payloadReembolso: IReembolso = {
                id_canje: id,
                id_colaborador: idColaborador,
                fecha_registro: fechaActual,
                fecha_maxima_reembolso: fechaMaximaReembolso,
                is_cobrable: false,
                estado_registro: EReembolso.REEMBOLSO_INGRESADO,
                nombre_colaborador: nombre_completo as string,
                user_crea: (user_actualiza ? user_actualiza : user_crea) as string
            }

            console.log({ payloadReembolso })

            const responseReembolso = await this.reembolsoRepository.create(payloadReembolso)

            console.log({ responseReembolso })

            const { result: resultReembolso } = responseReembolso

            if (!resultReembolso) {
                return {
                    result: false,
                    message: 'Error al registrar el reembolso',
                    status: 500
                };
            }

            return responseReembolso;
        }

        return responseCanje
    }
}

export default new UpdateCanjeService();