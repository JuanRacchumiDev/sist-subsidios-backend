import DescansoMedicoRepository from '../../repositories/DescansoMedico/DescansoMedicoRepository';
import { IDescansoMedico, DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';
import { IColaborador } from '../../interfaces/Colaborador/IColaborador';
import { EDescansoMedico } from '../../enums/EDescansoMedico';
import { notificationIncorrectoDescansoMedico } from '../../utils/emailTemplate';
import { TDetalleEmail } from '../../types/DescansoMedico/TDetalleEmail';
import transporter from '../../../config/mailer';
import { DescansoMedico } from '../../models/DescansoMedico';
import ColaboradorRepository from '../../repositories/Colaborador/ColaboradorRepository';
import { Colaborador } from '../../models/Colaborador';
import { TOTAL_DIAS_DESCANSO_MEDICO } from '../../../helpers/HParameter';
import HDate from '../../../helpers/HDate';
import { ICanje } from '../../interfaces/Canje/ICanje';
import { ECanje } from '../../enums/ECanje';
import CanjeRepository from '../../repositories/Canje/CanjeRepository';
/**
 * @class UpdateDescansoService
 * @description Servicio para actualizar un descanso médico existente, incluyendo el cambio de estado.
 */
class UpdateDescansoService {
    protected descansoMedicoRepository: DescansoMedicoRepository
    protected colaboradorRepository: ColaboradorRepository
    protected canjeRepository: CanjeRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository()
        this.colaboradorRepository = new ColaboradorRepository()
        this.canjeRepository = new CanjeRepository()
    }

    /**
     * Ejecuta la operación para actualizar un descanso médico.
     * Puede actualizar cualquier campo definido en IDescansoMedico, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del descanso médico a actualizar.
     * @param {IDescansoMedico} data - Los datos parciales o completos del descanso médico a actualizar.
     * @returns {Promise<DescansoMedicoResponse>} La respuesta de la operación.
     */
    async execute(id: string, payload: IDescansoMedico): Promise<DescansoMedicoResponse> {
        let nombreCompleto: string = ""
        let email: string = ""

        const responseDescansoMedico = await this.descansoMedicoRepository.update(id, payload);

        console.log({ responseDescansoMedico })

        const { result, error, data, message, status } = responseDescansoMedico

        if (!result) {
            return responseDescansoMedico
        }

        // Si el estado es incorrecto, enviar correo de notificación al colaborador
        const descanso = data as IDescansoMedico
        console.log('descanso update', descanso)

        const {
            id_colaborador,
            fecha_inicio,
            fecha_final,
            total_dias,
            nombre_tipocontingencia,
            nombre_tipodescansomedico,
            nombre_diagnostico,
            nombre_establecimiento,
            estado_registro,
            observacion
        } = descanso

        const responseColaborador = await this.colaboradorRepository.getById(id_colaborador as string)

        const { result: resultCol, data: dataCol } = responseColaborador

        if (result && data) {
            const { correo_personal, nombre_completo } = dataCol as IColaborador
            nombreCompleto = nombre_completo as string
            email = correo_personal as string
        }

        if (estado_registro === EDescansoMedico.DOCUMENTACION_INCORRECTA) {
            const detalleDescanso: TDetalleEmail = {
                fecha_inicio,
                fecha_final,
                total_dias,
                nombre_tipocontingencia,
                nombre_tipodescansomedico,
                nombre_diagnostico,
                nombre_establecimiento,
                observacion
            }

            const dataEmail = {
                nombreCompleto,
                detalle: detalleDescanso,
                appUrl: process.env.APP_URL || 'http://localhost:3000'
            }

            const mailOptions = {
                from: process.env.EMAIL_USER_GMAIL,
                to: email,
                subject: '¡ESTADO DEL PROCESO DEL DESCANSO MÉDICO',
                html: notificationIncorrectoDescansoMedico(dataEmail)
            }

            const responseEmail = await transporter.sendMail(mailOptions);
            console.log(`Correo de notificación de estado de descanso médico ${nombreCompleto}`);

            console.log({ responseEmail })
        } else if (estado_registro === EDescansoMedico.REGISTRO_EXITOSO) {
            let diasAcumulados = 0

            const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaborador(id_colaborador as string)

            console.log('console log responseTotalDias')
            console.log({ responseTotalDias })

            const { result: resultTotalDias, data: totalDiasAcumulados } = responseTotalDias

            if (!resultTotalDias) {
                console.log('aaa')
                return {
                    result: false,
                    message: 'Error al obtener los días de descanso acumulados',
                    status: 422
                };
            }

            if (typeof totalDiasAcumulados === 'string') {
                diasAcumulados = parseInt(totalDiasAcumulados)
            }

            console.log({ diasAcumulados })
            console.log(typeof diasAcumulados)

            const totalDiasWithNuevoDescanso = diasAcumulados + (total_dias as number)

            console.log({ totalDiasWithNuevoDescanso })

            if (totalDiasWithNuevoDescanso < TOTAL_DIAS_DESCANSO_MEDICO) {
                console.log('bbb')
                return responseDescansoMedico
            }

            console.log('ccc')

            // Crear nuevo canje primera parte
            const diasMaximo: number = TOTAL_DIAS_DESCANSO_MEDICO - (totalDiasWithNuevoDescanso || 0)

            const fechaFinalFirstSubsidio: string = HDate.addDaysToDate(fecha_inicio as string, diasMaximo)

            const fechaInicioLastSubsidio = HDate.addDaysToDate(fechaFinalFirstSubsidio, 1)

            const fechaMaximaCanje: string = HDate.addDaysToDate(fechaFinalFirstSubsidio, 10)

            const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')

            // Crear el primer canje (no reembolsable, hasta el día 20)
            const payloadCanjeWithoutSubsidio: ICanje = {
                id_descansomedico: id,
                // codigo: 'CANJ-0001-2025',
                fecha_inicio_subsidio: fecha_inicio,
                fecha_final_subsidio: fechaFinalFirstSubsidio,
                fecha_inicio_dm: fecha_inicio,
                fecha_final_dm: fecha_final,
                fecha_maxima_canje: fechaMaximaCanje,
                fecha_registro: fechaActual,
                is_reembolsable: false,
                estado_registro: ECanje.CANJE_REGISTRADO
            }

            console.log({ payloadCanjeWithoutSubsidio })

            const responseCanjeWithoutSubsidio = await this.canjeRepository.create(payloadCanjeWithoutSubsidio);

            console.log({ responseCanjeWithoutSubsidio })

            const { result: resultWithoutSubsidio } = responseCanjeWithoutSubsidio

            if (!resultWithoutSubsidio) {
                return {
                    result: false,
                    message: 'Error al registrar el canje sin subsidio',
                    status: 500
                };
            }

            // Crear nuevo canje segunda parte
            const payloadCanjeWithSubsidio: ICanje = {
                id_descansomedico: id,
                // codigo: 'CANJ-0001-2025',
                fecha_inicio_subsidio: fechaInicioLastSubsidio,
                fecha_final_subsidio: fecha_final,
                fecha_inicio_dm: fecha_inicio,
                fecha_final_dm: fecha_final,
                fecha_maxima_canje: fechaMaximaCanje,
                fecha_registro: fechaActual,
                is_reembolsable: false,
                estado_registro: ECanje.CANJE_REGISTRADO
            }

            const responseCanjeWithSubsidio = await this.canjeRepository.create(payloadCanjeWithSubsidio)

            const { result: resultWithSubsidio } = responseCanjeWithSubsidio

            if (!resultWithSubsidio) {
                return {
                    result: false,
                    message: 'Error al registrar el canje con subsidio',
                    status: 500
                };
            }

            return responseDescansoMedico;
        }

        return responseDescansoMedico
    }
}

export default new UpdateDescansoService();