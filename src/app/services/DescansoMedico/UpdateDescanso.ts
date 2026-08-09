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
import { IUsuario } from '../../interfaces/Usuario/IUsuario';
import { EPerfil } from "../../enums/EPerfil"

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
            // Obteniendo la respuesta de actulización de descanso médico
            const responseDescansoMedico = await this.descansoMedicoRepository.update(idDescanso, payload);

            console.log({ responseDescansoMedico })

            const { result: resultDM, data: dataDM } = responseDescansoMedico

            // Validando que la respuesta sea incorrecto
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
                nombre_colaborador,
                nombre_tipocontingencia,
                nombre_tipodescansomedico,
                nombre_diagnostico,
                nombre_establecimiento,
                estado_registro,
                observacion,
                colaborador_dm,
                user_crea
            } = descanso

            // Obteniendo datos del colaborador
            const { email_personal, nombre_completo } = colaborador_dm as IPersona

            console.log({ estado_registro })

            if (estado_registro === EDescansoMedico.DOCUMENTACION_INCORRECTA) {

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
                    nombreCompleto: nombre_completo as string,
                    detalle: detalleDescanso,
                    appUrl: process.env.APP_URL || 'http://localhost:3000'
                }

                console.log({ dataEmail })

                const htmlContent = notificationDescansoMedicoIncorrecto(dataEmail)

                // await this.emailRepository.sendEmail({
                //     to: email_personal as string,
                //     subject: 'Observación en Registro de Descanso Médico',
                //     html: htmlContent
                // });

                console.log(`Correo de notificación de estado de descanso médico para colaborador ${nombre_completo as string}`);

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

                    const isValidaEspCliente = usuario && usuario.perfil && (usuario.perfil.nombre_url as string) === EPerfil.ESPECIALISTA_EMPRESA

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
                            nombreCompleto: nombre_completo as string,
                            detalle: detalleDescanso,
                            appUrl: process.env.APP_URL || 'http://localhost:3000'
                        }

                        console.log({ dataEmail })

                        const htmlContent = notificationDescansoMedicoIncorrecto(dataEmail)

                        // await this.emailRepository.sendEmail({
                        //     to: emailEspCliente as string,
                        //     subject: 'Observación en Registro de Descanso Médico',
                        //     html: htmlContent
                        // });

                        console.log(`Correo de notificación de estado de descanso médico para especialista empresa`);
                    }
                }

            } else if (estado_registro === EDescansoMedico.REGISTRO_EXITOSO) {

                console.log('creando canjes desde update descanso')

                let fechaInicioSubsidio: string;

                let fechaFinalSubsidio: string;

                const recordsToCreateCanje: ICanje[] = [];

                const isReembolsable: boolean = true;

                const esMaternidad = nombre_tipocontingencia?.toLowerCase().includes('maternidad')

                console.log({ esMaternidad })

                console.log('Creando canjes para maternidad o por canjes por superar los 20 días')

                if (esMaternidad) {
                    console.log('crear subsidio por maternidad')

                    fechaInicioSubsidio = fecha_inicio as string;
                    fechaFinalSubsidio = fecha_final as string;

                    console.log({ fechaInicioSubsidio })
                    console.log({ fechaFinalSubsidio })

                    // Validando si las fechas de inicio y canje están en las mismas fechas o fechas distintas
                    const startDateCanje = parseISO(fechaInicioSubsidio)
                    const endDateCanje = parseISO(fechaFinalSubsidio)

                    if (isSameMonth(startDateCanje, endDateCanje)) {
                        console.log('fechas de canje en el mismo mes')

                        const payloadCanjeMaternidad: ICanje = {
                            id_descansomedico: id as string,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento as string, 30),
                            is_reembolsable: isReembolsable,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            nombre_colaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea
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
                                id_descansomedico: id as string,
                                id_colaborador,
                                fecha_otorgamiento,
                                fecha_inicio_subsidio: format(currentStartDateCanje, "yyyy-MM-dd"),
                                fecha_final_subsidio: format(currentEndDateCanje, "yyyy-MM-dd"),
                                total_dias: differenceInCalendarDays(currentEndDateCanje, currentStartDateCanje) + 1,
                                fecha_inicio_dm: fecha_inicio,
                                fecha_final_dm: fecha_final,
                                fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento as string, 30),
                                is_reembolsable: true,
                                estado_registro: ECanje.CANJE_REGISTRADO,
                                nombre_colaborador,
                                nombre_tipocontingencia,
                                nombre_tipodescansomedico,
                                user_crea
                            };

                            recordsToCreateCanje.push(payloadCanjeMaternidad)

                            currentStartDateCanje = addMonths(startOfMonth(currentStartDateCanje), 1)
                        }

                        console.log('array de canjes para registrar')
                        console.log({ recordsToCreateCanje })
                    }
                } else {
                    console.log('crear canje que no es maternidad')
                    const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorSinIdDescanso(
                        id_colaborador as string,
                        id as string,
                        fecha_otorgamiento as string
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

                    const newDiasAcumulados = diasAcumulados + (total_dias as number)

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

                        const fechaFinalPrimerCanje = HDate.addDaysToDate(fecha_inicio as string, diasMaximo - 1)

                        fechaInicioSubsidio = fecha_inicio as string;

                        fechaFinalSubsidio = fechaFinalPrimerCanje;

                        console.log({ diasMaximo })
                        console.log({ fechaFinalPrimerCanje })
                        console.log({ fechaInicioSubsidio })
                        console.log({ fechaFinalSubsidio })

                        const payloadCanjeSinSubsidio: ICanje = {
                            id_descansomedico: id as string,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento as string, 30),
                            is_reembolsable: false,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            nombre_colaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea
                        };

                        console.log({ payloadCanjeSinSubsidio })

                        recordsToCreateCanje.push(payloadCanjeSinSubsidio);
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
                            fechaInicioSegundoCanje = fecha_inicio as string;
                        } else {
                            console.log('qqqqq')
                            console.log('TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados', (TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados))
                            const fechaFinalPrimerCanje = HDate.addDaysToDate(fecha_inicio as string, TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados - 1)
                            fechaInicioSegundoCanje = HDate.addDaysToDate(fechaFinalPrimerCanje, 1);
                            console.log({ fechaFinalPrimerCanje })
                            console.log({ fechaInicioSegundoCanje })
                        }

                        console.log({ fechaInicioSegundoCanje })

                        fechaInicioSubsidio = fechaInicioSegundoCanje;

                        fechaFinalSubsidio = fecha_final as string;

                        console.log({ fechaInicioSegundoCanje })
                        console.log({ fechaInicioSubsidio })
                        console.log({ fechaFinalSubsidio })

                        const payloadCanjeWithSubsidio: ICanje = {
                            id_descansomedico: id as string,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento as string, 30),
                            is_reembolsable: isReembolsable,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            nombre_colaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea
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