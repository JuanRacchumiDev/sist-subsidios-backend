import DescansoMedicoRepository from '../../repositories/DescansoMedico/DescansoMedicoRepository';
import { IDescansoMedico, DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';
import { IColaborador } from '../../interfaces/Colaborador/IColaborador';
import { EDescansoMedico } from '../../enums/EDescansoMedico';
import { notificationDescansoMedicoIncorrecto } from '../../utils/emailTemplate';
import { TDetalleEmail } from '../../types/DescansoMedico/TDetalleEmail';
import transporter from '../../../config/mailer';
import { DescansoMedico } from '../../models/DescansoMedico';
import ColaboradorRepository from '../../repositories/Colaborador/ColaboradorRepository';
import { Colaborador } from '../../models/Colaborador';
import { TOTAL_DIAS_DESCANSO_MEDICO } from '../../../helpers/HParameter';
import HDate from '../../../helpers/HDate';
import { CanjeResponse, ICanje } from '../../interfaces/Canje/ICanje';
import { ECanje } from '../../enums/ECanje';
import CanjeRepository from '../../repositories/Canje/CanjeRepository';
import { addMonths, differenceInCalendarDays, endOfMonth, format, isSameMonth, parseISO, startOfMonth } from 'date-fns';

type TFechas = {
    fechaInicio: string
    fechaFinal: string
}

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
     * @param {IDescansoMedico} payload - Los datos parciales o completos del descanso médico a actualizar.
     * @returns {Promise<DescansoMedicoResponse>} La respuesta de la operación.
     */
    async execute(idDescanso: string, payload: IDescansoMedico): Promise<DescansoMedicoResponse> {
        try {
            let nombreCompleto: string = ""
            let email: string = ""

            const responseDescansoMedico = await this.descansoMedicoRepository.update(idDescanso, payload);

            console.log({ responseDescansoMedico })

            const { result, data } = responseDescansoMedico

            if (!result) {
                return responseDescansoMedico
            }

            // Si el estado es incorrecto, enviar correo de notificación al colaborador
            const descanso = data as IDescansoMedico
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
                colaborador_dm
            } = descanso

            if (estado_registro === EDescansoMedico.DOCUMENTACION_INCORRECTA) {
                const { correo_personal, nombre_completo } = colaborador_dm as IColaborador
                nombreCompleto = nombre_completo as string
                email = correo_personal as string

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
                    subject: '¡ESTADO DEL PROCESO DE DESCANSO MÉDICO',
                    html: notificationDescansoMedicoIncorrecto(dataEmail)
                }

                const responseEmail = await transporter.sendMail(mailOptions);
                console.log(`Correo de notificación de estado de descanso médico ${nombreCompleto}`);

                console.log({ responseEmail })
            } else if (estado_registro === EDescansoMedico.REGISTRO_EXITOSO) {

                console.log('creando canjes desde update descanso')

                const idColaborador = id_colaborador as string

                const idDescansoMedico = id as string

                const fechaOtorgamiento = fecha_otorgamiento as string

                const fechaInicio = fecha_inicio as string

                const fechaFinal = fecha_final as string

                const totalDiasActual = total_dias as number;

                // Obteniendo datos del colaborador
                const responseColaborador = await this.colaboradorRepository.getById(idColaborador)

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
                    correo_personal
                } = dataColaborador as IColaborador

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
                            nombre_tipodescansomedico
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
                                nombre_tipodescansomedico
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

                    // Si la suma de días (anteriores + actual) es menor o igual a 20, no se generan canjes
                    if (newDiasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                        // if (diasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                        console.log('creando canjes desde update descanso')
                        console.log('bb')

                        return responseDescansoMedico
                    }

                    console.log('creando canjes desde update descanso')
                    console.log('ccc')

                    // Lógica del primer canje (no subsidiado)
                    // Se crean canjes para los días no subsidiados (hasta 20 días en total)
                    // if (diasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                    if (newDiasAcumulados > TOTAL_DIAS_DESCANSO_MEDICO) {
                        console.log('nuevos días acumulados mayor a los días total_dias_descanso_medico')

                        const diasMaximo = TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados;

                        const fechaFinalPrimerCanje = HDate.addDaysToDate(fechaInicio, diasMaximo - 1)

                        fechaInicioSubsidio = fechaInicio;

                        fechaFinalSubsidio = fechaFinalPrimerCanje;

                        // isReembolsable = false;

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
                            nombre_tipodescansomedico
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
                            // const fechaFinalPrimerCanje = HDate.addDaysToDate(fechaInicio, TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados - 1);
                            console.log('TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados', (TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados))
                            const fechaFinalPrimerCanje = HDate.addDaysToDate(fechaInicio, TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados - 1)
                            fechaInicioSegundoCanje = HDate.addDaysToDate(fechaFinalPrimerCanje, 1);
                            console.log({ fechaFinalPrimerCanje })
                            console.log({ fechaInicioSegundoCanje })
                        }

                        console.log({ fechaInicioSegundoCanje })

                        fechaInicioSubsidio = fechaInicioSegundoCanje;

                        fechaFinalSubsidio = fechaFinal;

                        // isReembolsable = true;

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
                            nombre_tipodescansomedico
                        };

                        console.log({ payloadCanjeWithSubsidio })

                        recordsToCreateCanje.push(payloadCanjeWithSubsidio);
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