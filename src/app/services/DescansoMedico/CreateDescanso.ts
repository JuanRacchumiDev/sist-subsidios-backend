import DescansoMedicoRepository from '../../repositories/DescansoMedico/DescansoMedicoRepository';
import { IDescansoMedico, DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';
import PersonaRepository from '../../repositories/Persona/PersonaRepository'
import DetalleRepository from '../../repositories/DetalleParametro/DetalleParametroRepository'
import TipoContingenciaRepository from '../../repositories/TipoContingencia/TipoContingenciaRepository';
import DiagnosticoRepository from '../../repositories/Diagnostico/DiagnosticoRepository';
import { IColaborador } from '../../interfaces/Colaborador/IColaborador';
import { FECHA_MAXIMA_CANJE, TOTAL_DIAS_DESCANSO_MEDICO } from '../../../helpers/HParameter';
import CanjeRepository from '../../repositories/Canje/CanjeRepository';
import { ICanje, CanjeResponse } from '../../interfaces/Canje/ICanje';
import HDate from '../../../helpers/HDate';
import { ECanje } from '../../enums/ECanje';
import AdjuntoRepository from '../../repositories/Adjunto/AdjuntoRepository';
import { EmailRepository } from '../../repositories/Email/EmailRepository'
import {
    newNotificationDescansoMedico,
    notificationDescansoMedicoIncorrecto
} from '../../utils/emailTemplate';
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
import { TDetalleDescansoMedico } from '../../types/TDetalleEmail';
import { ITipoContingencia } from '../../interfaces/TipoContingencia/ITipoContingencia';
import { ITipoDescansoMedico } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';
import { IDiagnostico } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class CreateDescansoService
 * @description Servicio para crear un descanso médico
 */
class CreateDescansoService {
    private descansoMedicoRepository: DescansoMedicoRepository;
    private adjuntoRepository: AdjuntoRepository;
    private detalleRepository: DetalleRepository
    private tipoContingenciaRepository: TipoContingenciaRepository
    private diagnosticoRepository: DiagnosticoRepository
    private canjeRepository: CanjeRepository
    private personaRepository: PersonaRepository
    private emailRepository: EmailRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository();
        this.adjuntoRepository = new AdjuntoRepository();
        this.tipoContingenciaRepository = new TipoContingenciaRepository()
        this.diagnosticoRepository = new DiagnosticoRepository()
        this.canjeRepository = new CanjeRepository()
        this.personaRepository = new PersonaRepository()
        this.detalleRepository = new DetalleRepository()
        this.emailRepository = new EmailRepository()
    }

    /**
     * Ejecuta la operación para crear un descanso médico.
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear.
     * @returns {Promise<ResponseTransaction>} La respuesta de la operación.
     */
    async execute(data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        console.log('data new descanso médico', data)

        let nombreTipoContingencia: string = ""

        let nombreTipoDescansoMedico: string = ""

        let nombreDiagnostico: string = ""

        const recordsToCreateDM: IDescansoMedico[] = []

        let responsesDM: DescansoMedicoResponse | DescansoMedicoResponse[]

        const {
            id_colaborador,
            id_tipodescansomedico,
            id_tipocontingencia,
            codcie10_diagnostico,
            fecha_otorgamiento,
            fecha_inicio,
            fecha_final,
            total_dias,
            slug_perfil,
            codigo_temp,
            estado_registro,
            nombre_establecimiento,
            observacion
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

        const responseColaborador = await this.personaRepository.getById(id_colaborador)
        console.log({ responseColaborador })

        const {
            result: resultColaborador,
            data: dataColaborador
        } = responseColaborador

        if (!resultColaborador || !dataColaborador) {
            return {
                result: false,
                message: 'Colaborador no encontrado',
                status: 404
            }
        }

        const responseTipoDM = await this.detalleRepository.getById(id_tipodescansomedico)

        const { result: resultTipoDM, data: dataTipoDM } = responseTipoDM

        if (!resultTipoDM || !dataTipoDM) {
            return {
                result: false,
                message: 'Tipo de descanso médico no encontrado',
                status: 404
            }
        }

        nombreTipoDescansoMedico = (dataTipoDM as ITipoDescansoMedico).nombre as string

        const responseTipoContingencia = await this.detalleRepository.getById(id_tipocontingencia)

        const {
            result: resultTipoContingencia,
            data: dataTipoContingencia
        } = responseTipoContingencia

        if (!resultTipoContingencia || !dataTipoContingencia) {
            return {
                result: false,
                message: 'Tipo de contingencia no encontrado',
                status: 404
            }
        }

        nombreTipoContingencia = (dataTipoContingencia as ITipoContingencia).nombre as string

        const responseDiagnostico = await this.diagnosticoRepository.getByCodigo(codcie10_diagnostico)

        const { result: resultDiagnostico, data: dataDiagnostico } = responseDiagnostico

        if (!resultDiagnostico || !dataDiagnostico) {
            return {
                result: false,
                message: 'Diagnóstico no encontrado',
                status: 404
            }
        }

        nombreDiagnostico = (dataDiagnostico as IDiagnostico).nombre as string

        const {
            nombres,
            apellido_paterno,
            apellido_materno,
            correo_personal
        } = dataColaborador as IColaborador

        const nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`

        const correoPersonal = correo_personal as string

        const fechaOtorgamiento = fecha_otorgamiento as string

        const fechaInicio = fecha_inicio as string

        const fechaFinal = fecha_final as string

        const codigoTemp = codigo_temp as string

        const startDate = parseISO(fechaInicio)

        const endDate = parseISO(fechaFinal)

        try {
            // Verificar si ambas fechas están en el mismo mes
            if (isSameMonth(startDate, endDate)) {
                console.log('fechas en el mismo mes')

                const newRecord = {
                    ...data
                }

                recordsToCreateDM.push(newRecord)
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

                    recordsToCreateDM.push(newRecord)

                    console.log({ recordsToCreateDM })

                    currentStartDate = addMonths(startOfMonth(currentStartDate), 1)
                }
            }

            // Aquí se llama a la función para gestionar los solapamientos de fechas
            const recordsToCreateWithOverlapHandling = await this.descansoMedicoRepository.validateSolapamientoFechas(recordsToCreateDM)
            console.log('aplicando métodos de solapamiento en fechas de descanso médico')
            console.log({ recordsToCreateWithOverlapHandling })

            // Se eliminan los descansos médicos que queden sin días después del manejo del solapamiento
            const finalRecordsToCreate = recordsToCreateWithOverlapHandling.filter(descanso => HDate.differenceDates(descanso.fecha_inicio as string, descanso.fecha_final as string) + 1 > 0);

            console.log('descansos médicos filtrados')
            console.log({ finalRecordsToCreate })

            if (recordsToCreateDM.length === 1) {
                console.log('único registro recordsToCreate')
                responsesDM = await this.descansoMedicoRepository.create(finalRecordsToCreate[0]) as DescansoMedicoResponse
            } else {
                console.log('múltiples registros recordsToCreate')
                console.log({ recordsToCreateDM })
                responsesDM = await this.descansoMedicoRepository.createMultiple(finalRecordsToCreate) as DescansoMedicoResponse[]
            }

            console.log({ responsesDM })

            if (Array.isArray(responsesDM)) {
                console.log('resultados varios registros')

                // Caso: responsesDM es un array de DescansoMedicoResponse
                const allSuccessful = responsesDM.every(res => res.result);

                if (!allSuccessful) {
                    return {
                        result: false,
                        error: 'Error al registrar uno o más descansos médicos',
                        status: 500,
                    };
                }
            } else {
                console.log('un solo registro')

                // Caso: responseDM es un único DescansoMedicoResponse
                const responseDescansoMedico = responsesDM;

                const {
                    result: resultDM
                } = responseDescansoMedico;

                // Error de descanso médico
                if (!resultDM) {
                    return responseDescansoMedico
                }
            }

            if (Array.isArray(responsesDM)) {
                // Obtener los IDs de los descansos médicos creados
                const createIds = responsesDM
                    .filter(res => res.data && 'id' in res.data)
                    .map(res => (res.data as IDescansoMedico).id as string)

                console.log("IDs de los descansos médicos creados: ", createIds)

                // Actualizar los documentos adjuntos, asignándoles el id de descanso médico
                await this.adjuntoRepository.updateAndCreateForCodeTemp(createIds, codigoTemp)
            } else {
                const { data } = responsesDM
                const { id } = data as IDescansoMedico
                console.log('actualizar documentos adjuntos por id descanso médico')
                // Actualizar los documentos adjuntos, asignándoles el id de descanso médico
                await this.adjuntoRepository.updateForCodeTemp(id as string, codigoTemp)
            }

            await this.handleSuccess(nombreColaborador, correoPersonal)

            if (estado_registro === EDescansoMedico.DOCUMENTACION_INCORRECTA) {
                const detalleDescanso: TDetalleDescansoMedico = {
                    fecha_inicio,
                    fecha_final,
                    total_dias,
                    nombre_tipocontingencia: nombreTipoContingencia,
                    nombre_tipodescansomedico: nombreTipoDescansoMedico,
                    nombre_diagnostico: nombreDiagnostico,
                    nombre_establecimiento,
                    observacion
                }

                const dataEmail = {
                    nombreCompleto: nombreColaborador,
                    detalle: detalleDescanso,
                    appUrl: process.env.APP_URL || 'http://localhost:3000'
                }

                const htmlContent = notificationDescansoMedicoIncorrecto(dataEmail)

                await this.emailRepository.sendEmail({
                    to: correoPersonal,
                    subject: '¡ESTADO DEL PROCESO DE DESCANSO MÉDICO',
                    html: htmlContent
                });

                console.log(`Correo de notificación de estado de descanso médico ${nombreColaborador}`);
            }

            console.log({ nombreTipoContingencia })

            let fechaInicioSubsidio: string;

            let fechaFinalSubsidio: string;

            const recordsToCreateCanje: ICanje[] = [];

            const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd');

            const isReembolsable: boolean = true; // Por defecto es reembolsable si pasa esta validación.

            const esMaternidad = nombreTipoContingencia.toLowerCase().includes('maternidad')

            console.log({ esMaternidad })

            console.log('Creando canjes para maternidad o por superar los 20 días');

            if (slug_perfil === 'especialista' && estado_registro === EDescansoMedico.REGISTRO_EXITOSO) {
                console.log('creando canjes como especialista')
                console.log('creando canjes desde nuevo descanso')

                if (esMaternidad) {
                    console.log('crear subsidio por maternidad')

                    // Recorrer el resultado de descansos médicos
                    if (Array.isArray(responsesDM)) {
                        for (const descanso of responsesDM) {
                            const { data } = descanso as DescansoMedicoResponse

                            const itemDescanso = data as IDescansoMedico

                            const {
                                id,
                                fecha_inicio: itemDescansoFechaInicio,
                                fecha_final: itemDescansoFechaFinal,
                            } = itemDescanso

                            fechaInicioSubsidio = itemDescansoFechaInicio as string;
                            fechaFinalSubsidio = itemDescansoFechaFinal as string

                            // Validando si las fechas de inicio y canje están en las mismas fechas o fechas distintas
                            const startDateCanje = parseISO(fechaInicioSubsidio)
                            const endDateCanje = parseISO(fechaFinalSubsidio)

                            if (isSameMonth(startDateCanje, endDateCanje)) {
                                console.log('fechas de canje en el mismo mes')

                                const payloadCanjeMaternidad: ICanje = {
                                    id_descansomedico: id,
                                    id_colaborador,
                                    fecha_otorgamiento,
                                    fecha_inicio_subsidio: fechaInicioSubsidio,
                                    fecha_final_subsidio: fechaFinalSubsidio,
                                    fecha_inicio_dm: fecha_inicio,
                                    fecha_final_dm: fecha_final,
                                    fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, FECHA_MAXIMA_CANJE),
                                    fecha_registro: fechaActual,
                                    is_reembolsable: isReembolsable,
                                    estado_registro: ECanje.CANJE_REGISTRADO,
                                    total_dias: differenceInCalendarDays(endDateCanje, startDateCanje) + 1,
                                    nombre_colaborador: nombreColaborador,
                                    nombre_tipocontingencia: nombreTipoContingencia,
                                    nombre_tipodescansomedico: nombreTipoDescansoMedico
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
                                        id_descansomedico: id,
                                        id_colaborador,
                                        fecha_otorgamiento,
                                        fecha_inicio_subsidio: format(currentStartDateCanje, "yyyy-MM-dd"),
                                        fecha_final_subsidio: format(currentEndDateCanje, "yyyy-MM-dd"),
                                        total_dias: differenceInCalendarDays(currentEndDateCanje, currentStartDateCanje) + 1,
                                        fecha_inicio_dm: fecha_inicio,
                                        fecha_final_dm: fecha_final,
                                        fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, FECHA_MAXIMA_CANJE),
                                        fecha_registro: fechaActual,
                                        is_reembolsable: isReembolsable,
                                        estado_registro: ECanje.CANJE_REGISTRADO,
                                        nombre_colaborador: nombreColaborador,
                                        nombre_tipocontingencia: nombreTipoContingencia,
                                        nombre_tipodescansomedico: nombreTipoDescansoMedico
                                    };

                                    recordsToCreateCanje.push(payloadCanjeMaternidad)

                                    console.log({ recordsToCreateDM })

                                    currentStartDateCanje = addMonths(startOfMonth(currentStartDateCanje), 1)
                                }
                            }
                        }
                    }
                } else {
                    console.log('crear canje que no es maternidad')

                    if (Array.isArray(responsesDM)) {
                        console.log('creando canjes de un listado de responsesDM')

                        for (const descanso of responsesDM) {
                            const { data } = descanso as DescansoMedicoResponse

                            const itemDescanso = data as IDescansoMedico

                            const {
                                id,
                                fecha_otorgamiento: itemDescansoFechaOtorgamiento,
                                fecha_inicio: itemDescansoFechaInicio,
                                fecha_final: itemDescansoFechaFinal,
                                total_dias
                            } = itemDescanso

                            const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorWithoutIdDescanso(
                                id_colaborador,
                                id as string,
                                itemDescansoFechaOtorgamiento as string
                            )

                            const {
                                result: resultTotalDias,
                                data: totalDiasAcumulados
                            } = responseTotalDias

                            if (!resultTotalDias) {
                                console.log('creando canjes desde update descanso')
                                console.log('aaa')

                                return {
                                    result: false,
                                    message: 'Error al obtener los días de descanso acumulados',
                                    status: 422
                                };
                            }

                            const diasAcumulados = typeof totalDiasAcumulados === 'string'
                                ? parseInt(totalDiasAcumulados)
                                : totalDiasAcumulados as number;

                            const totalDiasActual = total_dias as number;

                            console.log({ diasAcumulados })
                            console.log(typeof diasAcumulados)

                            const newDiasAcumulados = diasAcumulados + totalDiasActual

                            // Si la suma de días (anteriores + actual) es menor o igual a 20, no se generan canjes
                            if (newDiasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                                console.log('creando canjes desde create descanso')
                                console.log('bb')

                                if (Array.isArray(responsesDM)) {
                                    return responsesDM[0]
                                }

                                return responsesDM
                            }

                            console.log('creando canjes desde create descanso')
                            console.log('ccc')

                            if (newDiasAcumulados > TOTAL_DIAS_DESCANSO_MEDICO) {
                                console.log('nuevos días acumulados mayor a los días total_dias_descanso_medico')

                                const diasMaximo = TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados;
                                const fechaFinalPrimerCanje = HDate.addDaysToDate(itemDescansoFechaInicio as string, diasMaximo - 1)

                                fechaInicioSubsidio = itemDescansoFechaInicio as string;
                                fechaFinalSubsidio = fechaFinalPrimerCanje;

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
                                    fecha_inicio_dm: itemDescansoFechaInicio,
                                    fecha_final_dm: itemDescansoFechaFinal,
                                    fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, FECHA_MAXIMA_CANJE),
                                    fecha_registro: fechaActual,
                                    is_reembolsable: false,
                                    estado_registro: ECanje.CANJE_REGISTRADO,
                                    total_dias: differenceInCalendarDays(fechaFinalSubsidio, fechaInicioSubsidio) + 1,
                                    nombre_colaborador: nombreColaborador,
                                    nombre_tipocontingencia: nombreTipoContingencia,
                                    nombre_tipodescansomedico: nombreTipoDescansoMedico
                                };

                                console.log({ payloadCanjeWithoutSubsidio })

                                recordsToCreateCanje.push(payloadCanjeWithoutSubsidio);
                            }

                            const diasRestantes = newDiasAcumulados - TOTAL_DIAS_DESCANSO_MEDICO;
                            console.log({ diasRestantes })

                            if (diasRestantes > 0) {
                                console.log('newdiasacumulados es mayor a total_dias_descanso_medico')

                                let fechaInicioSegundoCanje: string;

                                console.log({ diasAcumulados })

                                if (diasAcumulados >= TOTAL_DIAS_DESCANSO_MEDICO) {
                                    console.log('ppppp')
                                    fechaInicioSegundoCanje = itemDescansoFechaInicio as string;
                                } else {
                                    console.log('qqqqq')
                                    console.log('TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados', (TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados))
                                    const fechaFinalPrimerCanje = HDate.addDaysToDate(itemDescansoFechaInicio as string, TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados - 1)
                                    fechaInicioSegundoCanje = HDate.addDaysToDate(fechaFinalPrimerCanje, 1);
                                    console.log({ fechaFinalPrimerCanje })
                                    console.log({ fechaInicioSegundoCanje })
                                }

                                console.log({ fechaInicioSegundoCanje })

                                fechaInicioSubsidio = fechaInicioSegundoCanje;
                                fechaFinalSubsidio = itemDescansoFechaFinal as string;

                                console.log({ fechaInicioSegundoCanje })
                                console.log({ fechaInicioSubsidio })
                                console.log({ fechaFinalSubsidio })

                                const payloadCanjeWithSubsidio: ICanje = {
                                    id_descansomedico: id,
                                    id_colaborador,
                                    fecha_otorgamiento,
                                    fecha_inicio_subsidio: fechaInicioSubsidio,
                                    fecha_final_subsidio: fechaFinalSubsidio,
                                    fecha_inicio_dm: itemDescansoFechaInicio,
                                    fecha_final_dm: itemDescansoFechaFinal,
                                    fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, FECHA_MAXIMA_CANJE),
                                    fecha_registro: fechaActual,
                                    is_reembolsable: true,
                                    estado_registro: ECanje.CANJE_REGISTRADO,
                                    total_dias: differenceInCalendarDays(fechaFinalSubsidio, fechaInicioSubsidio) + 1,
                                    nombre_colaborador: nombreColaborador,
                                    nombre_tipocontingencia: nombreTipoContingencia,
                                    nombre_tipodescansomedico: nombreTipoDescansoMedico
                                };

                                console.log({ payloadCanjeWithSubsidio })

                                recordsToCreateCanje.push(payloadCanjeWithSubsidio);
                            }
                        }
                    } else {
                        console.log('un solo responsesDM')
                        console.log({ responsesDM })

                        const { result, data } = responsesDM

                        if (!result) {
                            return responsesDM
                        }

                        const { id, fecha_inicio, fecha_final, total_dias } = data as IDescansoMedico

                        const idDescansoMedico = id as string

                        const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorWithoutIdDescanso(
                            id_colaborador,
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

                        const diasAcumulados = typeof totalDiasAcumulados === 'string'
                            ? parseInt(totalDiasAcumulados)
                            : totalDiasAcumulados as number;

                        console.log({ diasAcumulados })
                        console.log(typeof diasAcumulados)

                        const totalDiasActual = total_dias as number

                        const newDiasAcumulados = diasAcumulados + totalDiasActual

                        // Si la suma de días (anteriores + actual) es menor o igual a 20, no se generan canjes
                        if (newDiasAcumulados < TOTAL_DIAS_DESCANSO_MEDICO) {
                            console.log('creando canjes desde create descanso')
                            console.log('bb')

                            if (Array.isArray(responsesDM)) {
                                return responsesDM[0]
                            }

                            return responsesDM
                        }

                        console.log('creando canjes desde create descanso')
                        console.log('ccc')

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

                            const payloadCanjeWithoutSubsidio: ICanje = {
                                id_descansomedico: idDescansoMedico,
                                id_colaborador,
                                fecha_otorgamiento,
                                fecha_inicio_subsidio: fechaInicioSubsidio,
                                fecha_final_subsidio: fechaFinalSubsidio,
                                fecha_inicio_dm: fecha_inicio,
                                fecha_final_dm: fecha_final,
                                fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, FECHA_MAXIMA_CANJE),
                                fecha_registro: fechaActual,
                                is_reembolsable: false,
                                estado_registro: ECanje.CANJE_REGISTRADO,
                                total_dias: differenceInCalendarDays(fechaFinalSubsidio, fechaInicioSubsidio) + 1,
                                nombre_colaborador: nombreColaborador,
                                nombre_tipocontingencia: nombreTipoContingencia,
                                nombre_tipodescansomedico: nombreTipoDescansoMedico
                            };

                            recordsToCreateCanje.push(payloadCanjeWithoutSubsidio);
                        }

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
                                id_descansomedico: idDescansoMedico,
                                id_colaborador,
                                fecha_otorgamiento,
                                fecha_inicio_subsidio: fechaInicioSubsidio,
                                fecha_final_subsidio: fechaFinalSubsidio,
                                fecha_inicio_dm: fecha_inicio,
                                fecha_final_dm: fecha_final,
                                fecha_maxima_canje: HDate.addDaysToDate(fechaOtorgamiento, FECHA_MAXIMA_CANJE),
                                fecha_registro: fechaActual,
                                is_reembolsable: true,
                                estado_registro: ECanje.CANJE_REGISTRADO,
                                total_dias: differenceInCalendarDays(fechaFinalSubsidio, fechaInicioSubsidio) + 1,
                                nombre_colaborador: nombreColaborador,
                                nombre_tipocontingencia: nombreTipoContingencia,
                                nombre_tipodescansomedico: nombreTipoDescansoMedico
                            };

                            console.log({ payloadCanjeWithSubsidio })

                            recordsToCreateCanje.push(payloadCanjeWithSubsidio);
                        }
                    }
                }

                // Aquí se llama a la función para gestionar los solapamientos de fechas
                const recordsToCreateWithOverlapHandling = await this.canjeRepository.validateSolapamientoFechas(recordsToCreateCanje)

                // Se eliminan los canjes que queden sin días después del manejo del solapamiento
                const finalRecordsToCreate = recordsToCreateWithOverlapHandling.filter(canje => HDate.differenceDates(canje.fecha_inicio_subsidio as string, canje.fecha_final_subsidio as string) + 1 > 0);

                if (finalRecordsToCreate.length > 0) {
                    const resultsCanjes = await this.canjeRepository.createMultiple(finalRecordsToCreate) as CanjeResponse[];
                    const allSuccessful = resultsCanjes.every(res => res.result);

                    if (allSuccessful) {
                        return {
                            result: true,
                            message: "Canjes registrados con éxito",
                            status: 200
                        };
                    }

                    return {
                        result: false,
                        error: "Error al registrar uno o más canjes",
                        status: 500
                    };
                }
            }

            if (Array.isArray(responsesDM)) {
                return responsesDM[0]
            }

            return responsesDM
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
            const dataEmail = {
                nombreCompleto: nombreColaborador,
                appUrl: process.env.BASE_URL || 'http://localhost:3000',
            };

            const htmlContent = newNotificationDescansoMedico(dataEmail)

            await this.emailRepository.sendEmail({
                to: correo_personal,
                subject: '¡REGISTRO DE NUEVO DESCANSO MÉDICO!',
                html: htmlContent
            })

            console.log(`Registro de nuevo descanso enviado a ${nombreColaborador}`);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }
    }
}

export default new CreateDescansoService();