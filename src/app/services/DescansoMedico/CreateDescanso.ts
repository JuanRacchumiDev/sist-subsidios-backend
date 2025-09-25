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
import { newNotificationDescansoMedico, notificationDescansoMedicoIncorrecto } from '../../utils/emailTemplate';
import transporter from '../../../config/mailer';
import {
    isSameMonth,
    endOfMonth,
    startOfMonth,
    addMonths,
    format,
    differenceInCalendarDays,
    parseISO
} from 'date-fns';
import { EDescansoMedico } from '../../enums/EDescansoMedico';
import { TDetalleEmail } from '@/types/DescansoMedico/TDetalleEmail';

type TFechas = {
    fechaInicio: string
    fechaFinal: string
}

/**
 * @class CreateDescansoService
 * @description Servicio para crear un descanso médico
 */
class CreateDescansoService {
    private descansoMedicoRepository: DescansoMedicoRepository;
    private colaboradorRepository: ColaboradorRepository;
    private adjuntoRepository: AdjuntoRepository;
    private tipoDescansoMedicoRepository: TipoDescansoMedicoRepository
    private tipoContingenciaRepository: TipoContingenciaRepository
    private diagnosticoRepository: DiagnosticoRepository
    private canjeRepository: CanjeRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository();
        this.colaboradorRepository = new ColaboradorRepository();
        this.adjuntoRepository = new AdjuntoRepository();
        this.tipoDescansoMedicoRepository = new TipoDescansoMedicoRepository()
        this.tipoContingenciaRepository = new TipoContingenciaRepository()
        this.diagnosticoRepository = new DiagnosticoRepository()
        this.canjeRepository = new CanjeRepository()
    }

    /**
     * Ejecuta la operación para crear un descanso médico.
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear.
     * @returns {Promise<ResponseTransaction>} La respuesta de la operación.
     */
    async execute(data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        console.log('data new descanso médico', data)

        let descansoMedico: IDescansoMedico = {}

        const recordsToCreate: IDescansoMedico[] = []

        let results: DescansoMedicoResponse | DescansoMedicoResponse[]

        const {
            id_colaborador,
            id_tipodescansomedico,
            id_tipocontingencia,
            codcie10_diagnostico,
            fecha_inicio,
            fecha_final,
            total_dias,
            id_usuario,
            slug_perfil,
            codigo_temp,
            estado_registro,
            colaborador_dm,
        } = data

        data.fecha_inicio_ingresado = fecha_inicio

        data.fecha_final_ingresado = fecha_final

        if (!id_colaborador) return {
            result: false,
            message: "El colaborador es requerido para crear un descanso médico",
            status: 400
        }

        if (!id_tipodescansomedico) return {
            result: false,
            message: "El tipo de descanso médico es requerido para crear un descanso médico",
            status: 400
        }

        if (!id_tipocontingencia) return {
            result: false,
            message: "El tipo de contingencia es requerido para crear un descanso médico",
            status: 400
        }

        if (!codcie10_diagnostico) return {
            result: false,
            message: "El diagnóstico es requerido para crear un descanso médico",
            status: 400
        }

        const responseColaborador = await this.colaboradorRepository.getById(id_colaborador)
        const { result: resultColaborador, data: dataColaborador } = responseColaborador
        if (!resultColaborador || !dataColaborador) return {
            result: false,
            message: 'Colaborador no encontrado',
            status: 404
        }

        const responseTipoDM = await this.tipoDescansoMedicoRepository.getById(id_tipodescansomedico)
        const { result: resultTipoDM, data: dataTipoDM } = responseTipoDM
        if (!resultTipoDM || !dataTipoDM) return {
            result: false,
            message: 'Tipo de descanso médico no encontrado',
            status: 404
        }

        const responseTipoContingencia = await this.tipoContingenciaRepository.getById(id_tipocontingencia)
        const { result: resultTipoContingencia, data: dataTipoContingencia } = responseTipoContingencia
        if (!resultTipoContingencia || !dataTipoContingencia) return {
            result: false,
            message: 'Tipo de contingencia no encontrado',
            status: 404
        }

        const responseDiagnostico = await this.diagnosticoRepository.getByCodigo(codcie10_diagnostico)
        const { result: resultDiagnostico, data: dataDiagnostico } = responseDiagnostico
        if (!resultDiagnostico || !dataDiagnostico) return {
            result: false,
            message: 'Diagnóstico no encontrado',
            status: 404
        }

        // const { nombres, apellido_paterno, apellido_materno, correo_personal } = colaborador_dm as IColaborador

        const {
            nombres,
            apellido_paterno,
            apellido_materno,
            correo_personal
        } = dataColaborador as IColaborador

        const nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`

        try {
            // const datesValidated = await this.descansoMedicoRepository.validateAcoplamiento(
            //     id_colaborador as string,
            //     fecha_inicio as string,
            //     fecha_final as string
            // ) as TFechas

            // const { fechaInicio, fechaFinal } = datesValidated

            // const startDate = parseISO(fechaInicio)

            // const endDate = parseISO(fechaFinal)

            // data.fecha_inicio = fechaInicio
            // data.fecha_final = fechaFinal
            // data.total_dias = differenceInCalendarDays(fechaInicio, fechaFinal) + 1

            const startDate = parseISO(fecha_inicio as string)

            const endDate = parseISO(fecha_final as string)

            // Verificar si ambas fechas están en el mismo mes
            if (isSameMonth(startDate, endDate)) {
                console.log('fechas en el mismo mes')

                const newRecord = {
                    ...data
                }

                recordsToCreate.push(newRecord)
            } else {
                console.log('fechas en meses distintos')
                let currentStartDate = startDate

                while (currentStartDate <= endDate) {
                    console.log({ currentStartDate })
                    console.log({ endDate })

                    let currentEndDate = endOfMonth(currentStartDate)
                    console.log('currentEndDate inicial')
                    console.log({ currentEndDate })

                    if (currentEndDate > endDate) {
                        currentEndDate = endDate
                    }

                    console.log('currentEndDate final')
                    console.log({ currentEndDate })

                    const newRecord = {
                        ...data,
                        fecha_inicio: format(currentStartDate, "yyyy-MM-dd"),
                        fecha_final: format(currentEndDate, "yyyy-MM-dd"),
                        total_dias: differenceInCalendarDays(currentEndDate, currentStartDate) + 1
                    }

                    recordsToCreate.push(newRecord)

                    console.log({ recordsToCreate })

                    currentStartDate = addMonths(startOfMonth(currentStartDate), 1)
                }
            }

            if (recordsToCreate.length === 1) {
                console.log('único registro recordsToCreate')
                results = await this.descansoMedicoRepository.create(recordsToCreate[0]) as DescansoMedicoResponse
            } else {
                console.log('múltiples registros recordsToCreate')
                console.log({ recordsToCreate })
                results = await this.descansoMedicoRepository.createMultiple(recordsToCreate) as DescansoMedicoResponse[]
            }

            if (Array.isArray(results)) {
                console.log('results varios registros')
                // Case: results is an array of DescansoMedicoResponse
                const allSuccessful = results.every(res => res.result);

                if (!allSuccessful) {
                    return {
                        result: false,
                        error: 'Error al registrar uno o más descansos médicos',
                        status: 500,
                    };
                }

                // Obteniendo el descanso médico creado
                const firstDescansoMedico = results[0]

                const { data } = firstDescansoMedico

                descansoMedico = data as IDescansoMedico

                // Obtener los IDs de los descansos médicos creados
                const createIds = results
                    .filter(res => res.data && 'id' in res.data)
                    .map(res => (res.data as IDescansoMedico).id as string)

                console.log("IDs de los descansos médicos creados: ", createIds)

                // Actualizar los documentos adjuntos, asignándoles el id de descanso médico
                // await this.adjuntoRepository.updateForCodeTemp(idDescansoMedico as string, codigo_temp as string)
                await this.adjuntoRepository.updateAndCreateForCodeTemp(createIds, codigo_temp as string)

                await this.handleSuccess(nombreColaborador, correo_personal as string)
            } else {
                console.log('un solo registro')
                // Case: results is a single DescansoMedicoResponse
                const responseDescansoMedico = results;

                const {
                    result: resultDM,
                    error: errorDM,
                    data: dataDM,
                    message: messageDM
                } = responseDescansoMedico;

                // Error de descanso médico
                if (!resultDM) {
                    return responseDescansoMedico
                }

                descansoMedico = dataDM as IDescansoMedico

                const { id: idDescansoMedico } = descansoMedico

                // console.log('idDescansoMedico nuevo registro', idDescansoMedico)

                // Actualizar los documentos adjuntos, asignándoles el id de descanso médico
                await this.adjuntoRepository.updateForCodeTemp(idDescansoMedico as string, codigo_temp as string)

                await this.handleSuccess(nombreColaborador, correo_personal as string)
            }

            const {
                id,
                fecha_otorgamiento,
                nombre_tipocontingencia,
                nombre_tipodescansomedico,
                nombre_diagnostico,
                nombre_establecimiento,
                observacion
            } = descansoMedico

            if (data.estado_registro === EDescansoMedico.DOCUMENTACION_INCORRECTA) {
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
                    nombreCompleto: nombreColaborador,
                    detalle: detalleDescanso,
                    appUrl: process.env.APP_URL || 'http://localhost:3000'
                }

                const mailOptions = {
                    from: process.env.EMAIL_USER_GMAIL,
                    to: correo_personal,
                    subject: '¡ESTADO DEL PROCESO DE DESCANSO MÉDICO',
                    html: notificationDescansoMedicoIncorrecto(dataEmail)
                }

                const responseEmail = await transporter.sendMail(mailOptions);
                console.log(`Correo de notificación de estado de descanso médico ${nombreColaborador}`);

                console.log({ responseEmail })
            }

            if (slug_perfil === 'especialista' && estado_registro === EDescansoMedico.REGISTRO_EXITOSO) {
                console.log('creando canjes desde nuevo descanso')

                const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorWithoutIdDescanso(
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
                const totalDiasActual = total_dias as number;

                console.log({ diasAcumulados })
                console.log(typeof diasAcumulados)

                const newDiasAcumulados = diasAcumulados + totalDiasActual

                // Si la suma de días (anteriores + actual) es menor o igual a 20, no se generan canjes
                if (newDiasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                    // if (diasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                    console.log('creando canjes desde update descanso')
                    console.log('bb')

                    if (Array.isArray(results)) {
                        return results[0]
                    }

                    return results
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
            }

            // if (slug_perfil === "especialista" && estado_registro === EDescansoMedico.REGISTRO_EXITOSO) {
            //     console.log('creando canjes desde nuevo descanso')

            //     // Registrar canjes
            //     let diasAcumulados = 0

            //     const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorWithoutIdDescanso(
            //         id_colaborador as string,
            //         // id as string
            //     )

            //     console.log('console.log responseTotalDias')
            //     console.log({ responseTotalDias })

            //     const { result: resultTotalDias, data: totalDiasAcumulados } = responseTotalDias

            //     if (!resultTotalDias) {
            //         console.log('creando canjes desde nuevo descanso')
            //         console.log('aaa')
            //         return {
            //             result: false,
            //             message: 'Error al obtener los días de descanso acumulados',
            //             status: 422
            //         };
            //     }

            //     if (typeof totalDiasAcumulados === 'string') {
            //         diasAcumulados = parseInt(totalDiasAcumulados)
            //     } else {
            //         diasAcumulados = totalDiasAcumulados as number
            //     }

            //     console.log({ diasAcumulados })
            //     console.log(typeof diasAcumulados)

            //     // const newDiasAcumulados = diasAcumulados + (total_dias as number)
            //     // console.log('new total_dias', total_dias)
            //     // console.log({ newDiasAcumulados })

            //     if (diasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
            //         console.log('creando canjes desde nuevo descanso')
            //         console.log('bb')

            //         if (Array.isArray(results)) {
            //             return results[0]
            //         }
            //         return results
            //     }

            //     console.log('creando canjes desde nuevo descanso')
            //     console.log('ccc')

            //     // Crear nuevo canje primera parte sin subsidio
            //     // const diasMaximo: number = TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados

            //     const diasMaximo: number = TOTAL_DIAS_DESCANSO_MEDICO

            //     console.log('creando canjes desde nuevo descanso')
            //     console.log({ diasMaximo })

            //     // const fechaFinalFirstSubsidio: string = HDate.addDaysToDate(fecha_inicio as string, diasMaximo)
            //     const fechaFinalFirstSubsidio: string = HDate.addDaysToDate(data.fecha_inicio_ingresado as string, diasMaximo)

            //     console.log('creando canjes desde nuevo descanso')
            //     console.log({ fechaFinalFirstSubsidio })

            //     const fechaInicioLastSubsidio: string = HDate.addDaysToDate(fechaFinalFirstSubsidio, 2)

            //     console.log('creando canjes desde nuevo descanso')
            //     console.log({ fechaInicioLastSubsidio })

            //     // const fechaMaximaCanje: string = HDate.addDaysToDate(fecha_inicio as string, 30)
            //     const fechaMaximaCanje: string = HDate.addDaysToDate(data.fecha_inicio_ingresado as string, 30)

            //     console.log('creando canjes desde nuevo descanso')
            //     console.log({ fechaMaximaCanje })

            //     const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')

            //     // Creando un arreglo de canjes
            //     const recordsToCreate: ICanje[] = []

            //     // Validar solapamiento de fechas
            //     // const datesValidatedFirstCanje = await this.canjeRepository.validateAcoplamiento(
            //     //     id_colaborador as string,
            //     //     fecha_inicio as string,
            //     //     fechaFinalFirstSubsidio
            //     // ) as TFechas

            //     // const {
            //     //     fechaInicio: fechaInicioFirstCanje,
            //     //     fechaFinal: fechaFinalFirstCanje
            //     // } = datesValidatedFirstCanje

            //     // Crear el primer canje (no reembolsable, hasta el día 20)
            //     const payloadCanjeWithoutSubsidio: ICanje = {
            //         id_descansomedico: id,
            //         id_colaborador,
            //         // fecha_inicio_subsidio: fechaInicioFirstCanje,
            //         // fecha_final_subsidio: fechaFinalFirstCanje,
            //         // fecha_inicio_subsidio: fecha_inicio,
            //         fecha_inicio_subsidio: data.fecha_inicio_ingresado,
            //         fecha_final_subsidio: fechaFinalFirstSubsidio,
            //         fecha_inicio_dm: data.fecha_inicio_ingresado,
            //         fecha_final_dm: data.fecha_final_ingresado,
            //         // fecha_inicio_dm: fecha_inicio,
            //         // fecha_final_dm: fecha_final,
            //         fecha_maxima_canje: fechaMaximaCanje,
            //         fecha_registro: fechaActual,
            //         is_reembolsable: false,
            //         estado_registro: ECanje.CANJE_REGISTRADO
            //     }

            //     console.log('creando canjes desde nuevo descanso')
            //     console.log({ payloadCanjeWithoutSubsidio })

            //     // const datesValidatedSecondCanje = await this.canjeRepository.validateAcoplamiento(
            //     //     id_colaborador as string,
            //     //     fechaInicioLastSubsidio,
            //     //     fecha_final as string
            //     // ) as TFechas

            //     // const {
            //     //     fechaInicio: fechaInicioLastCanje,
            //     //     fechaFinal: fechaFinalLastCanje
            //     // } = datesValidatedSecondCanje

            //     const payloadCanjeWithSubsidio: ICanje = {
            //         id_descansomedico: id,
            //         id_colaborador,
            //         // fecha_inicio_subsidio: fechaInicioLastCanje,
            //         // fecha_final_subsidio: fechaFinalLastCanje,
            //         fecha_inicio_subsidio: fechaInicioLastSubsidio,
            //         fecha_final_subsidio: data.fecha_final_ingresado,
            //         fecha_inicio_dm: data.fecha_inicio_ingresado,
            //         fecha_final_dm: data.fecha_final_ingresado,
            //         // fecha_final_subsidio: fecha_final,
            //         // fecha_inicio_dm: fecha_inicio,
            //         // fecha_final_dm: fecha_final,
            //         fecha_maxima_canje: fechaMaximaCanje,
            //         fecha_registro: fechaActual,
            //         is_reembolsable: true,
            //         estado_registro: ECanje.CANJE_REGISTRADO
            //     }

            //     console.log('creando canjes desde nuevo descanso')
            //     console.log({ payloadCanjeWithSubsidio })

            //     recordsToCreate.push(payloadCanjeWithoutSubsidio)
            //     recordsToCreate.push(payloadCanjeWithSubsidio)

            //     const resultsCanjes = await this.canjeRepository.createMultiple(recordsToCreate) as CanjeResponse[]

            //     // Verificamos si todos los registros fueron creados satisfactoriamente
            //     const allSuccessful = resultsCanjes.every(res => res.result)

            //     console.log('creando canjes desde nuevo descanso')

            //     if (allSuccessful) {
            //         return {
            //             result: true,
            //             // message: "Canje registrado con éxito en múltiples registros",
            //             message: "Canjes registrados con éxito",
            //             status: 200
            //         }
            //     } else {
            //         return {
            //             result: false,
            //             error: "Error al registrar uno o más canjes",
            //             status: 500
            //         }
            //     }
            // }

            if (Array.isArray(results)) {
                return results[0]
            }

            return results
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return {
                result: false,
                error: errorMessage,
                status: 500
            };
        }
    }

    async handleSuccess(
        nombreColaborador: string,
        correo_personal: string
    ) {
        try {
            // Send notification email
            const dataEmail = {
                nombreCompleto: nombreColaborador,
                appUrl: process.env.APP_URL || 'http://localhost:3000',
            };

            const mailOptions = {
                from: process.env.EMAIL_USER_GMAIL,
                to: correo_personal,
                subject: '¡REGISTRO DE NUEVO DESCANSO MÉDICO!',
                html: newNotificationDescansoMedico(dataEmail),
            };

            const responseEmail = await transporter.sendMail(mailOptions);
            console.log(`Correo de bienvenida enviado a ${nombreColaborador}`);
            console.log({ responseEmail });
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }
    }
}

export default new CreateDescansoService();