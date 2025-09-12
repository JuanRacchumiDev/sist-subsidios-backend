import DescansoMedicoRepository from '../../repositories/DescansoMedico/DescansoMedicoRepository';
import { IDescansoMedico, DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';
import ColaboradorRepository from '../../repositories/Colaborador/ColaboradorRepository';
import TipoDescansoMedicoRepository from '../../repositories/TipoDescansoMedico/TipoDescansoMedicoRepository';
import TipoContingenciaRepository from '../../repositories/TipoContingencia/TipoContingenciaRepository';
import DiagnosticoRepository from '../../repositories/Diagnostico/DiagnosticoRepository';
import EstablecimientoRepository from '../../repositories/Establecimiento/EstablecimientoRepository';
import { IColaborador } from '../../interfaces/Colaborador/IColaborador';
import { ITipoDescansoMedico } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';
import { ITipoContingencia } from '../../interfaces/TipoContingencia/ITipoContingencia';
import { IDiagnostico } from '../../interfaces/Diagnostico/IDiagnostico';
import { TOTAL_DIAS_DESCANSO_MEDICO } from '../../../helpers/HParameter';
import CanjeRepository from '../../repositories/Canje/CanjeRepository';
import { ICanje, CanjeResponse } from '../../interfaces/Canje/ICanje';
import HDate from '../../../helpers/HDate';
import { ECanje } from '../../enums/ECanje';
import sequelize from '../../../config/database';
import AdjuntoRepository from '../../repositories/Adjunto/AdjuntoRepository';
import { ResponseTransaction } from '../../types/DescansoMedico/TResponseTransaction';
import { newNotificationDescansoMedico } from '../../utils/emailTemplate';
import transporter from '../../../config/mailer';

/**
 * @class CreateDescansoService
 * @description Servicio para crear un descanso médico
 */
class CreateDescansoService {
    /**
     * Ejecuta la operación para crear un descanso médico.
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear.
     * @returns {Promise<ResponseTransaction>} La respuesta de la operación.
     */
    async execute(data: IDescansoMedico): Promise<ResponseTransaction | undefined> {
        console.log('data new descanso médico', data)

        const {
            id_colaborador,
            id_tipodescansomedico,
            id_tipocontingencia,
            codcie10_diagnostico,
            fecha_inicio,
            fecha_final,
            total_dias,
            codigo_temp
        } = data

        if (!id_colaborador) return { result: false, message: "El colaborador es requerido para crear un descanso médico", status: 400 }

        if (!id_tipodescansomedico) return { result: false, message: "El tipo de descanso médico es requerido para crear un descanso médico", status: 400 }

        if (!id_tipocontingencia) return { result: false, message: "El tipo de contingencia es requerido para crear un descanso médico", status: 400 }

        if (!codcie10_diagnostico) return { result: false, message: "El diagnóstico es requerido para crear un descanso médico", status: 400 }

        const responseColaborador = await ColaboradorRepository.getById(id_colaborador)
        const { result: resultColaborador, data: dataColaborador } = responseColaborador
        if (!resultColaborador || !dataColaborador) return { result: false, message: 'Colaborador no encontrado', status: 404 }

        const responseTipoDM = await TipoDescansoMedicoRepository.getById(id_tipodescansomedico)
        const { result: resultTipoDM, data: dataTipoDM } = responseTipoDM
        if (!resultTipoDM || !dataTipoDM) return { result: false, message: 'Tipo de descanso médico no encontrado', status: 404 }

        const responseTipoContingencia = await TipoContingenciaRepository.getById(id_tipocontingencia)
        const { result: resultTipoContingencia, data: dataTipoContingencia } = responseTipoContingencia
        if (!resultTipoContingencia || !dataTipoContingencia) return { result: false, message: 'Tipo de contingencia no encontrado', status: 404 }

        const responseDiagnostico = await DiagnosticoRepository.getByCodigo(codcie10_diagnostico)
        const { result: resultDiagnostico, data: dataDiagnostico } = responseDiagnostico
        if (!resultDiagnostico || !dataDiagnostico) return { result: false, message: 'Diagnóstico no encontrado', status: 404 }

        const { nombres, apellido_paterno, apellido_materno, correo_personal } = dataColaborador as IColaborador

        const nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`

        const { nombre: nombreTipoDM } = dataTipoDM as ITipoDescansoMedico

        const { nombre: nombreTipoContingencia } = dataTipoContingencia as ITipoContingencia

        const { nombre: nombreDiagnostico } = dataDiagnostico as IDiagnostico

        const payloadData: IDescansoMedico = {
            ...data,
            nombre_colaborador: nombreColaborador,
            nombre_tipodescansomedico: nombreTipoDM,
            nombre_tipocontingencia: nombreTipoContingencia,
            nombre_diagnostico: nombreDiagnostico
        }

        // Lógica para obtener y validar el total de días acumulados
        const totalDiasResponse = await DescansoMedicoRepository.getTotalDiasByColaborador(id_colaborador)

        console.log({ totalDiasResponse })

        const { result: resultTotalDias, data: totalDiasAcumulados } = totalDiasResponse

        if (!resultTotalDias) {
            return {
                result: false,
                message: 'Error al obtener los días de descanso acumulados',
                status: 422
            };
        }

        const totalDiasWithNuevoDescanso = (totalDiasAcumulados || 0) + (total_dias as number)

        console.log({ totalDiasWithNuevoDescanso })

        // Manejo de la lógica de canje dentro de una transacción
        // const transaction = await sequelize.transaction();

        try {
            console.log('antes de generar correlativo')

            const siguienteCorrelatvoDM = await DescansoMedicoRepository.generateCorrelativo()

            console.log('después generar siguiente correlativo')

            console.log({ siguienteCorrelatvoDM })

            payloadData.codigo = siguienteCorrelatvoDM

            console.log('payloadData newdescanso', payloadData)

            const responseNewDescanso = await DescansoMedicoRepository.create(payloadData);

            console.log({ responseNewDescanso })

            const { result, data } = responseNewDescanso

            if (!result || !data) {
                console.log('error en el service')
                // await transaction.rollback();
                return {
                    result: false,
                    message: 'Error al registrar el descanso médico',
                    status: 422
                };
            }

            const dataDescansoMedico = data as IDescansoMedico

            const { id: idDescansoMedico } = dataDescansoMedico;

            console.log('id newdescanso', idDescansoMedico)

            // Actualizar los documentos adjuntos, asignándoles el id de descanso médico
            await AdjuntoRepository.updateForCodeTemp(idDescansoMedico as string, codigo_temp as string)

            // if (totalDiasWithNuevoDescanso < TOTAL_DIAS_DESCANSO_MEDICO) {
            // console.log('no genera subsidio')
            // await transaction.commit();

            // Envío correo de notificación
            const dataEmail = {
                nombreCompleto: nombreColaborador,
                appUrl: process.env.APP_URL || 'http://localhost:3000',
            }

            const mailOptions = {
                from: process.env.EMAIL_USER_GMAIL,
                to: correo_personal,
                subject: '¡REGISTRO DE NUEVO DESCANSO MÉDICO',
                html: newNotificationDescansoMedico(dataEmail)
            }

            const responseEmail = await transporter.sendMail(mailOptions);
            console.log(`Correo de bienvenida enviado a ${nombreColaborador}`);

            console.log({ responseEmail })

            return {
                result: true,
                message: "Descanso médico registrado correctamente",
                status: 201
            };
            // }

            if (totalDiasWithNuevoDescanso >= TOTAL_DIAS_DESCANSO_MEDICO) {
                console.log('preparando payload para nuevos canjes')

                // Crear nuevo canje primera parte
                const diasMaximo: number = TOTAL_DIAS_DESCANSO_MEDICO - (totalDiasWithNuevoDescanso || 0)
                console.log({ diasMaximo })

                const fechaFinalFirstSubsidio: string = HDate.addDaysToDate(fecha_inicio as string, diasMaximo)
                console.log({ fechaFinalFirstSubsidio })

                const fechaInicioLastSubsidio = HDate.addDaysToDate(fechaFinalFirstSubsidio, 1)
                console.log({ fechaInicioLastSubsidio })

                const fechaMaximaCanje: string = HDate.addDaysToDate(fechaFinalFirstSubsidio, 10)
                console.log({ fechaMaximaCanje })

                const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')
                console.log({ fechaActual })

                // Crear el primer canje (no reembolsable, hasta el día 20)
                const payloadCanjeWithoutSubsidio: ICanje = {
                    id_descansomedico: idDescansoMedico,
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

                const siguienteCorrelatvoCanjeSinSubsidio = await CanjeRepository.generateCorrelativo();

                console.log('generar siguiente correlativo de canje sin subsidio')

                console.log({ siguienteCorrelatvoCanjeSinSubsidio })

                // Agregando código generadp
                payloadCanjeWithoutSubsidio.codigo = siguienteCorrelatvoCanjeSinSubsidio

                // Agregando mes de devengado
                payloadCanjeWithoutSubsidio.mes_devengado = HDate.getMonthName(fecha_inicio as string)

                // const responseCanjeWithoutSubsidio = await CanjeRepository.create(payloadCanjeWithoutSubsidio);
                const responseCanjeWithoutSubsidio = await CanjeRepository.create(payloadCanjeWithoutSubsidio);
                console.log({ responseCanjeWithoutSubsidio })

                const { result: resultWithoutSubsidio } = responseCanjeWithoutSubsidio

                if (!resultWithoutSubsidio) {
                    // await transaction.rollback();
                    return {
                        result: false,
                        message: 'Error al registrar el canje sin subsidio',
                        status: 422
                    };
                }

                // Crear nuevo canje segunda parte
                const payloadCanjeWithSubsidio: ICanje = {
                    id_descansomedico: idDescansoMedico,
                    fecha_inicio_subsidio: fechaInicioLastSubsidio,
                    fecha_final_subsidio: fecha_final,
                    fecha_inicio_dm: fecha_inicio,
                    fecha_final_dm: fecha_final,
                    fecha_maxima_canje: fechaMaximaCanje,
                    fecha_registro: fechaActual,
                    is_reembolsable: false,
                    estado_registro: ECanje.CANJE_REGISTRADO
                }

                console.log({ payloadCanjeWithSubsidio })

                const siguienteCorrelatvoCanjeConSubsidio = await CanjeRepository.generateCorrelativo();

                console.log('generar siguiente correlativo de canje con subsidio')

                console.log({ siguienteCorrelatvoCanjeConSubsidio })

                payloadCanjeWithSubsidio.codigo = siguienteCorrelatvoCanjeConSubsidio

                // Agregando mes de devengado
                payloadCanjeWithSubsidio.mes_devengado = HDate.getMonthName(fechaInicioLastSubsidio as string)

                // const responseCanjeWithSubsidio = await CanjeRepository.create(payloadCanjeWithSubsidio, t)
                const responseCanjeWithSubsidio = await CanjeRepository.create(payloadCanjeWithSubsidio)

                const { result: resultWithSubsidio } = responseCanjeWithSubsidio

                if (!resultWithSubsidio) {
                    // await transaction.rollback();
                    return {
                        result: false,
                        message: 'Error al registrar el canje con subsidio',
                        status: 500
                    };
                }

                // await transaction.commit();
                return {
                    result: true,
                    message: "Canjes registrados correctamente",
                    error: "",
                    status: 201
                };
            }
        } catch (error) {
            // await transaction.rollback();
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return {
                result: false,
                error: errorMessage,
                status: 500
            };
        }
    }
}

export default new CreateDescansoService();