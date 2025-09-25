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
    async execute(id: string, payload: IDescansoMedico): Promise<DescansoMedicoResponse> {
        try {
            let nombreCompleto: string = ""
            let email: string = ""

            const responseDescansoMedico = await this.descansoMedicoRepository.update(id, payload);

            console.log({ responseDescansoMedico })

            const { result, data } = responseDescansoMedico

            if (!result) {
                return responseDescansoMedico
            }

            // Si el estado es incorrecto, enviar correo de notificación al colaborador
            const descanso = data as IDescansoMedico
            console.log('descanso update', descanso)

            const {
                id: idDescansoMedico,
                id_colaborador,
                fecha_inicio_ingresado,
                fecha_final_ingresado,
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

                // Registrar canjes
                // let diasAcumulados = 0

                const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorWithoutIdDescanso(
                    id_colaborador as string,
                    idDescansoMedico as string,
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

                // if (typeof totalDiasAcumulados === 'string') {
                //     diasAcumulados = parseInt(totalDiasAcumulados)
                // } else {
                //     diasAcumulados = totalDiasAcumulados as number
                // }

                const diasAcumulados = typeof totalDiasAcumulados === 'string' ? parseInt(totalDiasAcumulados) : totalDiasAcumulados as number;
                const totalDiasActual = total_dias as number;

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

                // Creando un arreglo de canjes
                const recordsToCreate: ICanje[] = []

                const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')

                let fechaInicioSubsidio: string;
                let fechaFinalSubsidio: string;
                let isReembolsable: boolean;

                // Lógica del primer canje (no subsidiado)
                // Se crean canjes para los días no subsidiados (hasta 20 días en total)
                // if (diasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                if (newDiasAcumulados > TOTAL_DIAS_DESCANSO_MEDICO) {
                    console.log('nuevos días acumulados mayor a los días total_dias_descanso_medico')

                    const diasMaximo = TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados;
                    // const fechaFinalPrimerCanje = HDate.addDaysToDate(fecha_inicio as string, diasMaximo - 1);
                    // const diasMaximo = TOTAL_DIAS_DESCANSO_MEDICO
                    const fechaFinalPrimerCanje = HDate.addDaysToDate(fecha_inicio as string, diasMaximo - 1)

                    fechaInicioSubsidio = fecha_inicio as string;
                    fechaFinalSubsidio = fechaFinalPrimerCanje;
                    isReembolsable = false;

                    console.log({ diasMaximo })
                    console.log({ fechaFinalPrimerCanje })
                    console.log({ fechaInicioSubsidio })
                    console.log({ fechaFinalSubsidio })

                    const payloadCanjeWithoutSubsidio: ICanje = {
                        id_descansomedico: id,
                        id_colaborador,
                        fecha_otorgamiento,
                        fecha_inicio_subsidio: fechaInicioSubsidio,
                        fecha_final_subsidio: fechaFinalSubsidio,
                        fecha_inicio_dm: fecha_inicio,
                        fecha_final_dm: fecha_final,
                        fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento as string, 30),
                        fecha_registro: fechaActual,
                        is_reembolsable: isReembolsable,
                        estado_registro: ECanje.CANJE_REGISTRADO,
                        nombre_tipocontingencia,
                        nombre_tipodescansomedico
                    };

                    console.log({ payloadCanjeWithoutSubsidio })

                    recordsToCreate.push(payloadCanjeWithoutSubsidio);
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
                        // const fechaFinalPrimerCanje = HDate.addDaysToDate(fecha_inicio as string, TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados - 1);
                        console.log('TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados', (TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados))
                        const fechaFinalPrimerCanje = HDate.addDaysToDate(fecha_inicio as string, TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados - 1)
                        fechaInicioSegundoCanje = HDate.addDaysToDate(fechaFinalPrimerCanje, 1);
                        console.log({ fechaFinalPrimerCanje })
                        console.log({ fechaInicioSegundoCanje })
                    }

                    console.log({ fechaInicioSegundoCanje })

                    fechaInicioSubsidio = fechaInicioSegundoCanje;
                    fechaFinalSubsidio = fecha_final as string;
                    isReembolsable = true;

                    console.log({ fechaInicioSegundoCanje })
                    console.log({ fechaInicioSubsidio })
                    console.log({ fechaFinalSubsidio })

                    const payloadCanjeWithSubsidio: ICanje = {
                        id_descansomedico: id,
                        id_colaborador,
                        fecha_otorgamiento,
                        fecha_inicio_subsidio: fechaInicioSubsidio,
                        fecha_final_subsidio: fechaFinalSubsidio,
                        fecha_inicio_dm: fecha_inicio,
                        fecha_final_dm: fecha_final,
                        fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento as string, 30),
                        fecha_registro: fechaActual,
                        is_reembolsable: isReembolsable,
                        estado_registro: ECanje.CANJE_REGISTRADO,
                        nombre_tipocontingencia,
                        nombre_tipodescansomedico
                    };

                    console.log({ payloadCanjeWithSubsidio })

                    recordsToCreate.push(payloadCanjeWithSubsidio);
                }

                // Aquí se llama a la función para gestionar los solapamientos de fechas
                const recordsToCreateWithOverlapHandling = await this.canjeRepository.validateSolapamientoFechas(recordsToCreate);

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

                // // Crear nuevo canje primera parte sin subsidio
                // const diasMaximo: number = TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados
                // // const diasMaximo: number = TOTAL_DIAS_DESCANSO_MEDICO

                // console.log('creando canjes desde update descanso')
                // console.log({ diasMaximo })

                // // const fechaFinalFirstSubsidio: string = HDate.addDaysToDate(fecha_inicio as string, diasMaximo)
                // const fechaFinalFirstSubsidio: string = HDate.addDaysToDate(fecha_otorgamiento as string, diasMaximo)

                // console.log('creando canjes desde update descanso')
                // console.log({ fechaFinalFirstSubsidio })

                // const fechaInicioLastSubsidio: string = HDate.addDaysToDate(fechaFinalFirstSubsidio, 1)

                // console.log('creando canjes desde update descanso')
                // console.log({ fechaInicioLastSubsidio })

                // // const fechaMaximaCanje: string = HDate.addDaysToDate(fecha_inicio as string, 30)
                // const fechaMaximaCanje: string = HDate.addDaysToDate(fecha_inicio_ingresado as string, 30)

                // console.log('creando canjes desde update descanso')
                // console.log({ fechaMaximaCanje })

                // // Validar solapamiento de fechas
                // // const datesValidatedFirstCanje = await this.canjeRepository.validateAcoplamiento(
                // //     id_colaborador as string,
                // //     fecha_inicio as string,
                // //     fechaFinalFirstSubsidio
                // // ) as TFechas

                // // const {
                // //     fechaInicio: fechaInicioFirstCanje,
                // //     fechaFinal: fechaFinalFirstCanje
                // // } = datesValidatedFirstCanje

                // // Crear el primer canje (no reembolsable, hasta el día 20)
                // const payloadCanjeWithoutSubsidio: ICanje = {
                //     id_descansomedico: id,
                //     id_colaborador,
                //     fecha_otorgamiento,
                //     fecha_inicio_subsidio: fecha_otorgamiento,
                //     fecha_final_subsidio: fechaFinalFirstSubsidio,
                //     // fecha_inicio_subsidio: fechaInicioFirstCanje,
                //     // fecha_final_subsidio: fechaFinalFirstCanje,
                //     // fecha_inicio_subsidio: fecha_inicio,
                //     // fecha_final_subsidio: fechaFinalFirstSubsidio,
                //     fecha_inicio_dm: fecha_inicio,
                //     fecha_final_dm: fecha_final,
                //     // fecha_inicio_dm: fecha_inicio,
                //     // fecha_final_dm: fecha_final,
                //     fecha_maxima_canje: fechaMaximaCanje,
                //     fecha_registro: fechaActual,
                //     is_reembolsable: false,
                //     estado_registro: ECanje.CANJE_REGISTRADO,
                //     nombre_tipocontingencia,
                //     nombre_tipodescansomedico
                // }

                // console.log('creando canjes desde nuevo descanso')
                // console.log({ payloadCanjeWithoutSubsidio })

                // // const datesValidatedSecondCanje = await this.canjeRepository.validateAcoplamiento(
                // //     id_colaborador as string,
                // //     fechaInicioLastSubsidio,
                // //     fecha_final as string
                // // ) as TFechas

                // // const {
                // //     fechaInicio: fechaInicioLastCanje,
                // //     fechaFinal: fechaFinalLastCanje
                // // } = datesValidatedSecondCanje

                // const payloadCanjeWithSubsidio: ICanje = {
                //     id_descansomedico: id,
                //     id_colaborador,
                //     fecha_otorgamiento,
                //     fecha_inicio_subsidio: fechaInicioLastSubsidio,
                //     fecha_final_subsidio: fecha_final,
                //     // fecha_inicio_subsidio: fechaInicioLastCanje,
                //     // fecha_final_subsidio: fechaFinalLastCanje,
                //     // fecha_inicio_subsidio: fechaInicioLastSubsidio,
                //     // fecha_final_subsidio: fecha_final,
                //     fecha_inicio_dm: fecha_inicio,
                //     fecha_final_dm: fecha_final,
                //     // fecha_inicio_dm: fecha_inicio,
                //     // fecha_final_dm: fecha_final,
                //     fecha_maxima_canje: fechaMaximaCanje,
                //     fecha_registro: fechaActual,
                //     is_reembolsable: true,
                //     estado_registro: ECanje.CANJE_REGISTRADO,
                //     nombre_tipocontingencia,
                //     nombre_tipodescansomedico
                // }

                // console.log('creando canjes desde nuevo descanso')
                // console.log({ payloadCanjeWithSubsidio })

                // recordsToCreate.push(payloadCanjeWithoutSubsidio)
                // recordsToCreate.push(payloadCanjeWithSubsidio)

                // const resultsCanjes = await this.canjeRepository.createMultiple(recordsToCreate) as CanjeResponse[]

                // // Verificamos si todos los registros fueron creados satisfactoriamente
                // const allSuccessful = resultsCanjes.every(res => res.result)

                // console.log('creando canjes desde nuevo descanso')

                // if (allSuccessful) {
                //     return {
                //         result: true,
                //         // message: "Canje registrado con éxito en múltiples registros",
                //         message: "Canjes registrados con éxito",
                //         status: 200
                //     }
                // } else {
                //     return {
                //         result: false,
                //         error: "Error al registrar uno o más canjes",
                //         status: 500
                //     }
                // }
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