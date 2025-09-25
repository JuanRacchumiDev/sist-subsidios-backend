import CanjeRepository from '../../repositories/Canje/CanjeRepository';
import { ICanje, CanjeResponse } from '../../interfaces/Canje/ICanje';
import { IReembolso } from '../../interfaces/Reembolso/IReembolso'
import { IColaborador } from '../../interfaces/Colaborador/IColaborador';
import { ECanje } from '../../enums/ECanje';
import { TDetalleEmail } from '../../types/Canje/TDetalleEmail';
import { IDescansoMedico } from '../../interfaces/DescansoMedico/IDescansoMedico';
import { notificationCanjeObservado } from '../../utils/emailTemplate';
import transporter from '../../../config/mailer';
import { EReembolso } from '../../enums/EReembolso';
import ReembolsoRepository from '../../repositories/Reembolso/ReembolsoRepository';
import HDate from '../../../helpers/HDate';

/**
 * @class UpdateCanjeService
 * @description Servicio para actualizar un canje existente, incluyendo el cambio de estado.
 */
class UpdateCanjeService {
    private canjeRepository: CanjeRepository
    private reembolsoRepository: ReembolsoRepository

    constructor() {
        this.canjeRepository = new CanjeRepository()
        this.reembolsoRepository = new ReembolsoRepository()
    }

    /**
     * Ejecuta la operación para actualizar un canje.
     * Puede actualizar cualquier campo definido en ICanje, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del canje a actualizar.
     * @param {ICanje} payload - Los datos parciales o completos del canje a actualizar.
     * @returns {Promise<CanjeResponse>} La respuesta de la operación.
     */
    async execute(id: string, payload: ICanje): Promise<CanjeResponse> {
        let nombreCompleto: string = ""
        let email: string = ""

        const responseCanje = await this.canjeRepository.update(id, payload);

        console.log({ responseCanje })

        const { result, error, data, message, status } = responseCanje

        if (!result) {
            return responseCanje
        }

        // Si el estado es incorrecto, enviar correo de notificación al colaboraor
        const canje = data as ICanje
        console.log('canje update', canje)

        const {
            id: idCanje,
            id_descansomedico,
            fecha_inicio_subsidio,
            fecha_final_subsidio,
            estado_registro,
            observacion,
            descansoMedico
        } = canje

        console.log('canje.descansomedico', descansoMedico)

        const detalleDescansoMedico = descansoMedico as IDescansoMedico

        const {
            fecha_inicio,
            fecha_final,
            total_dias,
            nombre_tipocontingencia,
            nombre_tipodescansomedico,
            nombre_diagnostico,
            nombre_establecimiento
        } = detalleDescansoMedico

        const colaborador = descansoMedico?.colaborador_dm as IColaborador

        console.log({ colaborador })

        const { correo_personal, nombre_completo } = colaborador
        nombreCompleto = nombre_completo as string
        email = correo_personal as string

        if (estado_registro === ECanje.CANJE_OBSERVADO) {
            const detalleCanje: TDetalleEmail = {
                fecha_inicio_subsidio,
                fecha_final_subsidio,
                observacion,
                descansoMedico: {
                    fecha_inicio,
                    fecha_final,
                    total_dias,
                    nombre_tipocontingencia,
                    nombre_tipodescansomedico,
                    nombre_diagnostico,
                    nombre_establecimiento
                }
            }

            const dataEmail = {
                nombreCompleto,
                detalle: detalleCanje,
                appUrl: process.env.APP_URL || 'http://localhost:3000'
            }

            const mailOptions = {
                from: process.env.EMAIL_USER_GMAIL,
                to: email,
                subject: '¡ESTADO DEL PROCESO DE CANJE!',
                html: notificationCanjeObservado(dataEmail)
            }

            const responseEmail = await transporter.sendMail(mailOptions);
            console.log(`Correo de notificación de estado de descanso médico ${nombreCompleto}`);

            console.log({ responseEmail })
        } else if (estado_registro === ECanje.CANJE_CONFORME) {
            // Registrar nuevo reembolso
            const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')

            const payloadReembolso: IReembolso = {
                id_canje: idCanje,
                fecha_registro: fechaActual,
                fecha_maxima_reembolso: fechaActual,
                is_cobrable: false,
                estado_registro: EReembolso.REEMBOLSO_INGRESADO
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

            return responseCanje;
        }

        return responseCanje
    }
}

export default new UpdateCanjeService();