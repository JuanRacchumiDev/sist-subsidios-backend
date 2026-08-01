import DescansoMedicoRepository from '../../repositories/DescansoMedico/DescansoMedicoRepository';
import { IDescansoMedico, DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';
import { IPersona } from '../../interfaces/Persona/IPersona'
import { EDescansoMedico } from '../../enums/EDescansoMedico';
import { notificationDescansoMedicoIncorrecto } from '../../utils/emailTemplate';
import { TDetalleDescansoMedico } from '../../types/TDetalleEmail'
import PersonaRepository from '../../repositories/Persona/PersonaRepository'
import { TOTAL_DIAS_DESCANSO_MEDICO } from '../../../helpers/HParameter';
import HDate from '../../../helpers/HDate';
import { CanjeResponse, ICanje } from '../../interfaces/Canje/ICanje';
import { ECanje } from '../../enums/ECanje';
import CanjeRepository from '../../repositories/Canje/CanjeRepository';
import { addMonths, differenceInCalendarDays, endOfMonth, format, isSameMonth, parseISO, startOfMonth } from 'date-fns';
import { EmailRepository } from '../../repositories/Email/EmailRepository'
import UsuarioRepository from '../../repositories/Usuario/UsuarioRepository'
import { IUsuario } from '@/interfaces/Usuario/IUsuario';
import { IDetalleParametro } from '@/interfaces/DetalleParametro/IDetalleParametro';

/**
 * @class UpdateDescansoService
 * @description Servicio para actualizar un descanso médico existente, incluyendo el cambio de estado.
 */
class UpdateDescansoService {
    protected descansoMedicoRepository: DescansoMedicoRepository
    protected personaRepository: PersonaRepository
    protected canjeRepository: CanjeRepository
    protected emailRepository: EmailRepository
    protected usuarioRepository: UsuarioRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository()
        this.personaRepository = new PersonaRepository()
        this.canjeRepository = new CanjeRepository()
        this.emailRepository = new EmailRepository()
        this.usuarioRepository = new UsuarioRepository()
    }

    /**
     * Ejecuta la operación para actualizar un descanso médico.
     * Puede actualizar cualquier campo definido en IDescansoMedico, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del descanso médico a actualizar.
     * @param {IDescansoMedico} payload - Los datos parciales o completos del descanso médico a actualizar.
     * @returns {Promise<DescansoMedicoResponse>} La respuesta de la operación.
     */
    async execute(idDescanso: string, payload: IDescansoMedico): Promise<DescansoMedicoResponse> {
        try {
            let nombreCompleto: string = ""
            let email: string = ""

            const responseDescansoMedico = await this.descansoMedicoRepository.update(idDescanso, payload);

            console.log({ responseDescansoMedico })

            const { result: resultDM, data: dataDM } = responseDescansoMedico

            if (!resultDM) {
                return responseDescansoMedico
            }

            // Si el estado es incorrecto, enviar correo de notificación al colaborador
            const descanso = dataDM as IDescansoMedico
            console.log('descanso update', descanso)

            const {
                id,
                id_colaborador,
                fecha_otorgamiento,
                fecha_inicio,
                fecha_final,
                total_dias,
                nombre_tipocontingencia,
                nombre_tipodescansomedico,
                nombre_diagnostico,
                nombre_establecimiento,
                estado_registro,
                observacion,
                colaborador_dm,
                user_crea
            } = descanso

            console.log({ estado_registro })

            if (estado_registro === EDescansoMedico.DOCUMENTACION_INCORRECTA) {

                // Preparando notificación para colaborador
                const { email_personal, nombre_completo } = colaborador_dm as IPersona
                nombreCompleto = nombre_completo as string
                email = email_personal as string

                const detalleDescanso: TDetalleDescansoMedico = {
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

                console.log({ dataEmail })

                const htmlContent = notificationDescansoMedicoIncorrecto(dataEmail)

                await this.emailRepository.sendEmail({
                    to: email,
                    subject: 'Observación en Registro de Descanso Médico',
                    html: htmlContent
                });

                console.log(`Correo de notificación de estado de descanso médico para colaborador ${nombreCompleto}`);

                // Preparando notificación para especialista empresa
                const responseUsuario = await this.usuarioRepository.getById(user_crea as string)

                console.log('user_crea')
                console.log({ user_crea })

                console.log('---- responseUsuario ----')
                console.log({ responseUsuario })

                const { result: resultUsuario, data: dataUsuario } = responseUsuario

                if (resultUsuario && dataUsuario) {
                    const usuario = dataUsuario as IUsuario

                    console.log({ usuario })

                    const isValidaEspCliente = usuario && usuario.perfil && (usuario.perfil.nombre_url as string) === 'especialista-empresa'

                    console.log({ isValidaEspCliente })

                    if (isValidaEspCliente) {
                        const { email: emailEspCliente } = usuario

                        const detalleDescanso: TDetalleDescansoMedico = {
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

                        console.log({ dataEmail })

                        const htmlContent = notificationDescansoMedicoIncorrecto(dataEmail)

                        await this.emailRepository.sendEmail({
                            to: emailEspCliente as string,
                            subject: 'Observación en Registro de Descanso Médico',
                            html: htmlContent
                        });

                        console.log(`Correo de notificación de estado de descanso médico para especialista cliente`);
                    }
                }

            } else if (estado_registro === EDescansoMedico.REGISTRO_EXITOSO) {

                console.log('creando canjes desde update descanso')

                const idColaborador = id_colaborador as string

                const idDescansoMedico = id as string

                const fechaOtorgamiento = fecha_otorgamiento as string

                const fechaInicio = fecha_inicio as string

                const fechaFinal = fecha_final as string

                const totalDiasActual = total_dias as number;

                const userCrea = user_crea as string

                // Obteniendo datos del colaborador
                const responseColaborador = await this.personaRepository.getById(idColaborador)

                const { result: resultColaborador, data: dataColaborador } = responseColaborador

                if (!resultColaborador || !dataColaborador) return {
                    result: false,
                    message: 'Colaborador no encontrado',
                    status: 404
                }

                const {
                    nombres,
                    apellido_paterno,
                    apellido_materno,
                } = dataColaborador as IPersona

                const nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`

                const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')

                let fechaInicioSubsidio: string;

                let fechaFinalSubsidio: string;

                const recordsToCreateCanje: ICanje[] = [];

                const isReembolsable: boolean = true;

                const esMaternidad = nombre_tipocontingencia?.toLowerCase().includes('maternidad')

                console.log({ esMaternidad })

                console.log('Creando canjes para maternidad o por canjes por superar los 20 días')

                if (esMaternidad) {
                    console.log('crear subsidio por maternidad')

                    fechaInicioSubsidio = fechaInicio;
                    fechaFinalSubsidio = fechaFinal;

                    console.log({ fechaInicioSubsidio })
                    console.log({ fechaFinalSubsidio })

                    // Validando si las fechas de inicio y canje están en las mismas fechas o fechas distintas
                    const startDateCanje = parseISO(fechaInicioSubsidio)
                    const endDateCanje = parseISO(fechaFinalSubsidio)

                    if (isSameMonth(startDateCanje, endDateCanje)) {
                        console.log('fechas de canje en el mismo mes')

                        const payloadCanjeMaternidad: ICanje = {
                            id_descansomedico: idDescansoMedico,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, 30),
                            fecha_registro: fechaActual,
                            is_reembolsable: isReembolsable,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            nombre_colaborador: nombreColaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea: userCrea
                        };

                        recordsToCreateCanje.push(payloadCanjeMaternidad)
                    } else {
                        console.log('fechas de canje en meses distintos')
                        let currentStartDateCanje = startDateCanje

                        while (currentStartDateCanje <= endDateCanje) {
                            console.log({ currentStartDateCanje })
                            console.log({ endDateCanje })

                            let currentEndDateCanje = endOfMonth(currentStartDateCanje)
                            console.log('currentEndDateCanje inicial')
                            console.log({ currentEndDateCanje })

                            if (currentEndDateCanje > endDateCanje) {
                                currentEndDateCanje = endDateCanje
                            }

                            console.log('currentEndDateCanje final')
                            console.log({ currentEndDateCanje })

                            const payloadCanjeMaternidad: ICanje = {
                                id_descansomedico: idDescansoMedico,
                                id_colaborador,
                                fecha_otorgamiento,
                                fecha_inicio_subsidio: format(currentStartDateCanje, "yyyy-MM-dd"),
                                fecha_final_subsidio: format(currentEndDateCanje, "yyyy-MM-dd"),
                                total_dias: differenceInCalendarDays(currentEndDateCanje, currentStartDateCanje) + 1,
                                fecha_inicio_dm: fecha_inicio,
                                fecha_final_dm: fecha_final,
                                fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, 30),
                                fecha_registro: fechaActual,
                                is_reembolsable: true,
                                estado_registro: ECanje.CANJE_REGISTRADO,
                                nombre_colaborador: nombreColaborador,
                                nombre_tipocontingencia,
                                nombre_tipodescansomedico,
                                user_crea: userCrea
                            };

                            recordsToCreateCanje.push(payloadCanjeMaternidad)

                            currentStartDateCanje = addMonths(startOfMonth(currentStartDateCanje), 1)
                        }

                        console.log('array de canjes para registrar')
                        console.log({ recordsToCreateCanje })
                    }
                } else {
                    console.log('crear canje que no es maternidad')
                    const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorWithoutIdDescanso(
                        idColaborador,
                        idDescansoMedico,
                        fechaOtorgamiento
                    )

                    console.log('console.log responseTotalDias')
                    console.log({ responseTotalDias })

                    const { result: resultTotalDias, data: totalDiasAcumulados } = responseTotalDias

                    if (!resultTotalDias) {
                        console.log('creando canjes desde update descanso')
                        console.log('aaa')

                        return {
                            result: false,
                            message: 'Error al obtener los días de descanso acumulados',
                            status: 422
                        };
                    }

                    const diasAcumulados = typeof totalDiasAcumulados === 'string' ? parseInt(totalDiasAcumulados) : totalDiasAcumulados as number;

                    console.log({ diasAcumulados })
                    console.log(typeof diasAcumulados)

                    const newDiasAcumulados = diasAcumulados + totalDiasActual

                    if (newDiasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                        console.log('creando canjes desde update descanso')
                        console.log('bb')

                        return responseDescansoMedico
                    }

                    console.log('creando canjes desde update descanso')
                    console.log('ccc')

                    // Lógica del primer canje (no subsidiado)
                    // Se crean canjes para los días no subsidiados (hasta 20 días en total)
                    if (newDiasAcumulados > TOTAL_DIAS_DESCANSO_MEDICO) {
                        console.log('nuevos días acumulados mayor a los días total_dias_descanso_medico')

                        const diasMaximo = TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados;

                        const fechaFinalPrimerCanje = HDate.addDaysToDate(fechaInicio, diasMaximo - 1)

                        fechaInicioSubsidio = fechaInicio;

                        fechaFinalSubsidio = fechaFinalPrimerCanje;

                        console.log({ diasMaximo })
                        console.log({ fechaFinalPrimerCanje })
                        console.log({ fechaInicioSubsidio })
                        console.log({ fechaFinalSubsidio })

                        const payloadCanjeWithoutSubsidio: ICanje = {
                            id_descansomedico: idDescansoMedico,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, 30),
                            fecha_registro: fechaActual,
                            is_reembolsable: false,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            nombre_colaborador: nombreColaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea: userCrea
                        };

                        console.log({ payloadCanjeWithoutSubsidio })

                        recordsToCreateCanje.push(payloadCanjeWithoutSubsidio);
                    }

                    // Lógica del segundo canje (subsidiado)
                    // Se crean canjes para los días subsidiados (a partir del día 21)
                    const diasRestantes = newDiasAcumulados - TOTAL_DIAS_DESCANSO_MEDICO;
                    console.log({ diasRestantes })

                    if (diasRestantes > 0) {
                        console.log('newdiasacumulados es mayor a total_dias_descanso_medico')

                        let fechaInicioSegundoCanje: string;

                        console.log({ diasAcumulados })

                        if (diasAcumulados >= TOTAL_DIAS_DESCANSO_MEDICO) {
                            console.log('ppppp')
                            fechaInicioSegundoCanje = fechaInicio;
                        } else {
                            console.log('qqqqq')
                            console.log('TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados', (TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados))
                            const fechaFinalPrimerCanje = HDate.addDaysToDate(fechaInicio, TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados - 1)
                            fechaInicioSegundoCanje = HDate.addDaysToDate(fechaFinalPrimerCanje, 1);
                            console.log({ fechaFinalPrimerCanje })
                            console.log({ fechaInicioSegundoCanje })
                        }

                        console.log({ fechaInicioSegundoCanje })

                        fechaInicioSubsidio = fechaInicioSegundoCanje;

                        fechaFinalSubsidio = fechaFinal;

                        console.log({ fechaInicioSegundoCanje })
                        console.log({ fechaInicioSubsidio })
                        console.log({ fechaFinalSubsidio })

                        const payloadCanjeWithSubsidio: ICanje = {
                            id_descansomedico: idDescansoMedico,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, 30),
                            fecha_registro: fechaActual,
                            is_reembolsable: isReembolsable,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            nombre_colaborador: nombreColaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea: userCrea
                        };

                        console.log({ payloadCanjeWithSubsidio })

                        recordsToCreateCanje.push(payloadCanjeWithSubsidio);
                    }
                }

                // Aquí se llama a la función para gestionar los solapamientos de fechas
                const recordsToCreateWithOverlapHandling = await this.canjeRepository.validateSolapamientoFechas(recordsToCreateCanje);

                console.log({ recordsToCreateWithOverlapHandling })

                // Se eliminan los canjes que queden sin días después del manejo del solapamiento
                const finalRecordsToCreate = recordsToCreateWithOverlapHandling.filter(canje => HDate.differenceDates(canje.fecha_inicio_subsidio as string, canje.fecha_final_subsidio as string) + 1 > 0);

                console.log({ finalRecordsToCreate })

                if (finalRecordsToCreate.length > 0) {
                    const resultsCanjes = await this.canjeRepository.createMultiple(finalRecordsToCreate) as CanjeResponse[];

                    const allSuccessful = resultsCanjes.every(res => res.result);

                    if (allSuccessful) {
                        return {
                            result: true,
                            message: "Canjes registrados con éxito",
                            status: 200
                        };
                    } else {
                        return {
                            result: false,
                            error: "Error al registrar uno o más canjes",
                            status: 500
                        };
                    }
                }
            }

            console.log('final updateDescanso')
            return responseDescansoMedico;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return {
                result: false,
                error: errorMessage,
                status: 500
            };
        }
    }
}

export default new UpdateDescansoService();