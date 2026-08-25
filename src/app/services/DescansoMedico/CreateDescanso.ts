import { DescansoMedicoResponse, IDescansoMedico } from "../../interfaces/DescansoMedico/IDescansoMedico";
import AdjuntoRepository from "../../repositories/Adjunto/AdjuntoRepository";
import CanjeRepository from "../../repositories/Canje/CanjeRepository";
import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { EmailRepository } from "../../repositories/Email/EmailRepository";
import PersonaRepository from "../../repositories/Persona/PersonaRepository";
import {
    newNotificationDescansoMedico,
    notificationDescansoMedicoIncorrecto
} from '../../utils/emailTemplate';
import {
    endOfMonth, isSameMonth, parseISO, format,
    differenceInCalendarDays, startOfMonth,
    addMonths,
} from "date-fns";
import HDate from '../../../helpers/HDate';
import { IPersona } from "../../interfaces/Persona/IPersona";
import { EDescansoMedico } from "../../enums/EDescansoMedico";
import { TDetalleDescansoMedico } from '../../types/TDetalleEmail';
import { CanjeResponse, ICanje } from "../../interfaces/Canje/ICanje";
import { FECHA_MAXIMA_CANJE, TOTAL_DIAS_DESCANSO_MEDICO } from '../../../helpers/HParameter';
import { ECanje } from '../../enums/ECanje';
import { EPerfil } from "../../enums/EPerfil"
import { IAdjunto } from "../../interfaces/Adjunto/IAdjunto";

class CreateDescansoService {
    private descansoMedicoRepository: DescansoMedicoRepository;
    private adjuntoRepository: AdjuntoRepository;
    private canjeRepository: CanjeRepository
    private personaRepository: PersonaRepository
    private emailRepository: EmailRepository

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository();
        this.adjuntoRepository = new AdjuntoRepository();
        this.canjeRepository = new CanjeRepository()
        this.personaRepository = new PersonaRepository()
        this.emailRepository = new EmailRepository()
    }

    async execute(data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        console.log('data new descanso médico', data)

        // Desestructurando los datos obtenidos desde el formulario
        const {
            id_colaborador,
            id_tipodescansomedico,
            id_tipocontingencia,
            codcie10_diagnostico,
            codigo_citt,
            fecha_otorgamiento,
            fecha_inicio,
            fecha_final,
            total_dias,
            nombre_perfil_url,
            codigo_temp,
            estado_registro,
            nombre_colaborador,
            nombre_tipodescansomedico,
            nombre_tipocontingencia,
            nombre_diagnostico,
            nombre_establecimiento,
            observacion
        } = data

        // Creando validaciones necesarias
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

        // Obteniendo respuesta del colaborador
        const responseColaborador = await this.personaRepository.getById(id_colaborador)

        const { result: resultColaborador, data: dataColaborador } = responseColaborador

        if (!resultColaborador || !dataColaborador) {
            return {
                result: false,
                message: 'Colaborador no encontrado',
                status: 404
            }
        }

        // Obteniendo datos del colaborador
        const { email_personal } = dataColaborador as IPersona

        const fechaInicio = fecha_inicio as string
        const fechaFinal = fecha_final as string
        const codigoTemp = codigo_temp as string
        const startDate = parseISO(fechaInicio)
        const endDate = parseISO(fechaFinal)

        const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd');

        const isReembolsableCanje: boolean = true; // Por defecto es reembolsable si pasa esta validación.

        // Definiendo arreglo de descansos médicos
        const registrosParaCrearDM: IDescansoMedico[] = []

        // Definiendo registros de descansos médicos
        let responsesDM: DescansoMedicoResponse | DescansoMedicoResponse[]

        data.fecha_inicio_ingresado = fecha_inicio
        data.fecha_final_ingresado = fecha_final

        let registrosParaCrearCanje: ICanje[] = [];

        try {
            // Verificar si ambas fechas están en el mismo mes
            if (isSameMonth(startDate, endDate)) {
                console.log('fechas en el mismo mes')
                registrosParaCrearDM.push({ ...data })
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

                    registrosParaCrearDM.push(newRecord)

                    // console.log({ registrosParaCrearDM })

                    currentStartDate = addMonths(startOfMonth(currentStartDate), 1)
                }
            }

            console.log('---- registros para crear descansos médicos ----')
            console.log({ registrosParaCrearDM })

            // Aquí se llama a la función para gestionar los solapamientos de fechas
            const registrosDMSinSolapamiento = await this.descansoMedicoRepository.validateSolapamientoFechas(registrosParaCrearDM)
            console.log('aplicando métodos de solapamiento en fechas de descanso médico')
            console.log({ registrosDMSinSolapamiento })

            // Se eliminan los descansos médicos que queden sin días después del manejo del solapamiento
            const finalRegistrosParaCrearDM = registrosDMSinSolapamiento.filter(
                descanso => HDate.differenceDates(
                    descanso.fecha_inicio as string, descanso.fecha_final as string
                ) + 1 > 0
            );

            console.log('---- descansos médicos después del solapamiento ----')
            console.log({ finalRegistrosParaCrearDM })

            if (registrosParaCrearDM.length === 1) {
                console.log('único registro recordsToCreate')
                responsesDM = await this.descansoMedicoRepository.create(finalRegistrosParaCrearDM[0]) as DescansoMedicoResponse
            } else {
                console.log('múltiples registros recordsToCreate')
                responsesDM = await this.descansoMedicoRepository.createMultiple(finalRegistrosParaCrearDM) as DescansoMedicoResponse[]
            }

            console.log({ responsesDM })

            // Obtener respuestas de los descansos médicos registrados
            this.obtenerRespuestaDMs(responsesDM)

            // Registrar adjuntos
            await this.registrarAdjuntos(codigoTemp, responsesDM)

            // Notificación email de descanso médico exitoso
            await this.notificacionExitosaEmail(nombre_colaborador as string, email_personal as string)

            // Notificación cuando el estado del descanso médico es incorrecto
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
                    nombreCompleto: nombre_colaborador as string,
                    detalle: detalleDescanso,
                    appUrl: process.env.APP_URL || 'http://localhost:3000'
                }

                const htmlContent = notificationDescansoMedicoIncorrecto(dataEmail)

                await this.emailRepository.sendEmail({
                    to: email_personal as string,
                    subject: '¡REGISTRO DE NUEVO DESCANSO MÉDICO!',
                    html: htmlContent
                })

                console.log(`Registro de nuevo descanso enviado a ${nombre_colaborador}`);
            }

            // Proceso registro de canjes
            const esMaternidad = (nombre_tipocontingencia as string).toLowerCase().includes('maternidad')

            console.log({ esMaternidad })

            console.log('Creando canjes para maternidad o por superar los 20 días');

            console.log('---- validando nombre_perfil_url ----')
            console.log({ nombre_perfil_url })

            if (nombre_perfil_url === EPerfil.ESPECIALISTA_EMPRESA && estado_registro === EDescansoMedico.REGISTRO_EXITOSO) {
                console.log('creando canjes como especialista empresa')
                console.log('creando canjes desde nuevo descanso')

                if (esMaternidad) {
                    console.log('crear subsidio por maternidad')

                    registrosParaCrearCanje = await this.crearCanjesPorMaternidad(
                        fecha_inicio as string,
                        fecha_final as string,
                        fecha_otorgamiento as string,
                        fechaActual,
                        isReembolsableCanje,
                        responsesDM
                    )
                } else {
                    registrosParaCrearCanje = await this.crearCanjesSinMaternidad(
                        fecha_otorgamiento as string,
                        fechaActual,
                        id_colaborador,
                        responsesDM
                    )
                }

                // Aquí se llama a la función para gestionar los solapamientos de fechas
                const registrosDMSinSolapamiento = await this.canjeRepository.validateSolapamientoFechas(registrosParaCrearCanje)

                console.log('---- canjes sin solapamiento de fechas ----')
                console.log({ registrosDMSinSolapamiento })

                // Se eliminan los canjes que queden sin días después del manejo del solapamiento
                const finalRegistrosParaCrearDM = registrosDMSinSolapamiento.filter(canje => HDate.differenceDates(canje.fecha_inicio_subsidio as string, canje.fecha_final_subsidio as string) + 1 > 0);

                console.log('---- obteniendo canjes finales ----')
                console.log({ finalRegistrosParaCrearDM })

                if (finalRegistrosParaCrearDM.length > 0) {
                    const resultsCanjes = await this.canjeRepository.createMultiple(finalRegistrosParaCrearDM) as CanjeResponse[];
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

    obtenerRespuestaDMs = (listResponseDMs: DescansoMedicoResponse[] | DescansoMedicoResponse) => {
        if (Array.isArray(listResponseDMs)) {
            console.log('resultados varios registros')

            const allSuccessfull = listResponseDMs.every(res => res.result)

            if (!allSuccessfull) {
                return {
                    result: false,
                    error: 'Error al registrar uno o más descansos médicos',
                    status: 500,
                };
            }
        } else {
            console.log('un solo registro')

            const { result } = listResponseDMs

            if (!result) {
                return listResponseDMs
            }
        }
    }

    registrarAdjuntos = async (
        codigoTemp: string,
        listResponseDMs: DescansoMedicoResponse[] | DescansoMedicoResponse
    ): Promise<void> => {
        let responseDM: DescansoMedicoResponse
        let idsDescansosCreados: string[] = []
        let listAdjuntos: IAdjunto[] = []

        if (Array.isArray(listResponseDMs)) {
            const firstResponseDM = listResponseDMs[0]
            responseDM = firstResponseDM

            const ids = listResponseDMs
                .filter(res => res.data && 'id' in res.data)
                .map(res => (res.data as IDescansoMedico).id as string)

            idsDescansosCreados = ids

        } else {
            responseDM = listResponseDMs
            const { data } = responseDM
            const { id } = data as IDescansoMedico
            idsDescansosCreados.push(id as string)
        }

        console.log({ idsDescansosCreados })

        const { data: dataDM } = responseDM
        const descansoMedico = dataDM as IDescansoMedico

        console.log({ descansoMedico })

        const { id, user_crea } = descansoMedico

        // Obteniendo adjuntos
        const responseAdjuntos = await this.adjuntoRepository.getAllByCodigoTemp(codigoTemp)

        const { result, data } = responseAdjuntos

        if (result && data) {
            listAdjuntos = data as IAdjunto[]
        }

        await this.adjuntoRepository.updateDocsIniciales(id as string, user_crea as string, codigoTemp)

        await this.adjuntoRepository.createMultiple(idsDescansosCreados, listAdjuntos, user_crea as string)

        // if (Array.isArray(listResponseDMs)) {
        //     const idsDescansosCreados = listResponseDMs
        //         .filter(res => res.data && 'id' in res.data)
        //         .map(res => (res.data as IDescansoMedico).id as string)

        //     console.log('---- IDs de descansos médicos creados ----')
        //     console.log({ idsDescansosCreados })

        //     // Obteniendo el id del usuario
        //     const responseDM = listResponseDMs[0]
        //     const { data } = responseDM
        //     const { user_crea } = data as IDescansoMedico

        //     console.log('---- actualizar y crear adjuntos ----')
        //     await this.adjuntoRepository.updateAndCreateForCodeTemp(idsDescansosCreados, user_crea as string, codigoTemp)
        // } else {
        //     const { data } = listResponseDMs
        //     const { id, user_crea } = data as IDescansoMedico
        //     console.log('---- actualizar adjuntos ----')
        //     await this.adjuntoRepository.updateForCodeTemp(id as string, user_crea as string, codigoTemp)
        // }
    }

    notificacionExitosaEmail = async (
        nombreColaborador: string,
        emailPersonal: string
    ) => {
        try {
            const dataEmail = {
                nombreCompleto: nombreColaborador,
                appUrl: process.env.BASE_URL || 'http://localhost:3000',
            };

            const htmlContent = newNotificationDescansoMedico(dataEmail)

            await this.emailRepository.sendEmail({
                to: emailPersonal,
                subject: '¡REGISTRO DE NUEVO DESCANSO MÉDICO!',
                html: htmlContent
            })

            console.log(`Registro de nuevo descanso enviado a ${nombreColaborador}`);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }
    }

    crearCanjesPorMaternidad = async (
        fecha_inicio: string,
        fecha_final: string,
        fecha_otorgamiento: string,
        fecha_actual: string,
        is_reembolsable: boolean,
        listResponseDMs: DescansoMedicoResponse[] | DescansoMedicoResponse
    ): Promise<ICanje[]> => {
        console.log('crear canjes por maternidad')

        let registrosParaCrearCanje: ICanje[] = []

        if (Array.isArray(listResponseDMs)) {

            for (const descanso of listResponseDMs) {
                const { data } = descanso as DescansoMedicoResponse
                const itemDescanso = data as IDescansoMedico

                const {
                    id,
                    fecha_inicio: fechaInicioSubsidio,
                    fecha_final: fechaFinalSubsidio,
                    id_colaborador,
                    nombre_colaborador,
                    nombre_tipocontingencia,
                    nombre_tipodescansomedico,
                    user_crea
                } = itemDescanso

                const startDateSubsidio = parseISO(fechaInicioSubsidio as string)
                const endDateSubsidio = parseISO(fechaFinalSubsidio as string)

                if (isSameMonth(startDateSubsidio, endDateSubsidio)) {
                    console.log('fechas de canje en el mismo mes')

                    const payloadCanjeMaternidad: ICanje = {
                        id_descansomedico: id,
                        id_colaborador,
                        fecha_otorgamiento,
                        fecha_inicio_subsidio: fechaInicioSubsidio,
                        fecha_final_subsidio: fechaFinalSubsidio,
                        fecha_inicio_dm: fecha_inicio,
                        fecha_final_dm: fecha_final,
                        fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento, FECHA_MAXIMA_CANJE),
                        fecha_registro: fecha_actual,
                        is_reembolsable,
                        estado_registro: ECanje.CANJE_REGISTRADO,
                        total_dias: differenceInCalendarDays(endDateSubsidio, startDateSubsidio) + 1,
                        nombre_colaborador,
                        nombre_tipocontingencia,
                        nombre_tipodescansomedico,
                        user_crea
                    };

                    registrosParaCrearCanje.push(payloadCanjeMaternidad)
                } else {
                    console.log('fechas de canje en meses distintos')
                    let currentStartDateCanje = startDateSubsidio

                    while (currentStartDateCanje <= endDateSubsidio) {
                        console.log({ currentStartDateCanje })
                        console.log({ endDateSubsidio })

                        let currentEndDateCanje = endOfMonth(currentStartDateCanje)
                        console.log('currentEndDateCanje inicial')
                        console.log({ currentEndDateCanje })

                        if (currentEndDateCanje > endDateSubsidio) {
                            currentEndDateCanje = endDateSubsidio
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
                            fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento, FECHA_MAXIMA_CANJE),
                            fecha_registro: fecha_actual,
                            is_reembolsable: is_reembolsable,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            nombre_colaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea
                        };

                        registrosParaCrearCanje.push(payloadCanjeMaternidad)

                        currentStartDateCanje = addMonths(startOfMonth(currentStartDateCanje), 1)
                    }
                }
            }
        }

        return registrosParaCrearCanje
    }

    crearCanjesSinMaternidad = async (
        fecha_otorgamiento_dm: string,
        fecha_actual: string,
        id_colaborador: string,
        listResponseDMs: DescansoMedicoResponse[] | DescansoMedicoResponse
    ): Promise<ICanje[]> => {
        console.log('crear canje que no es maternidad')

        let registrosParaCrearCanje: ICanje[] = []

        let fechaInicioSubsidio: string = ""
        let fechaFinalSubsidio: string = ""

        if (Array.isArray(listResponseDMs)) {
            console.log('creando canjes de un listado de responsesDM')

            for (const descanso of listResponseDMs) {
                const { data } = descanso as DescansoMedicoResponse

                const itemDescanso = data as IDescansoMedico

                const {
                    id,
                    fecha_otorgamiento,
                    fecha_inicio,
                    fecha_final,
                    total_dias,
                    id_colaborador,
                    nombre_colaborador,
                    nombre_tipocontingencia,
                    nombre_tipodescansomedico,
                    user_crea
                } = itemDescanso

                const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorSinIdDescanso(
                    id_colaborador as string,
                    id as string,
                    fecha_otorgamiento as string
                )

                const {
                    result: resultTotalDias,
                    data: totalDiasAcumulados
                } = responseTotalDias

                if (resultTotalDias) {
                    const diasAcumulados = typeof totalDiasAcumulados === 'string'
                        ? parseInt(totalDiasAcumulados)
                        : totalDiasAcumulados as number;

                    const totalDiasActual = total_dias as number;

                    console.log({ diasAcumulados })
                    console.log(typeof diasAcumulados)

                    const newDiasAcumulados = diasAcumulados + totalDiasActual

                    // Si la suma de días (anteriores + actual) es menor o igual a 20, no se generan canjes
                    if (newDiasAcumulados > TOTAL_DIAS_DESCANSO_MEDICO) {
                        console.log('nuevos días acumulados mayor a los días total_dias_descanso_medico')

                        const diasMaximo = TOTAL_DIAS_DESCANSO_MEDICO - diasAcumulados;
                        const fechaFinalPrimerCanje = HDate.addDaysToDate(fecha_inicio as string, diasMaximo - 1)

                        fechaFinalSubsidio = fechaFinalPrimerCanje;

                        console.log({ diasMaximo })
                        console.log({ fechaFinalPrimerCanje })
                        console.log({ fechaInicioSubsidio })
                        console.log({ fechaFinalSubsidio })

                        const payloadCanjeSinSubsidio: ICanje = {
                            id_descansomedico: id,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento_dm, FECHA_MAXIMA_CANJE),
                            fecha_registro: fecha_actual,
                            is_reembolsable: false,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            total_dias: differenceInCalendarDays(fechaFinalSubsidio, fechaInicioSubsidio) + 1,
                            nombre_colaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea
                        };

                        console.log({ payloadCanjeSinSubsidio })

                        registrosParaCrearCanje.push(payloadCanjeSinSubsidio);
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
                            id_descansomedico: id,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento_dm, FECHA_MAXIMA_CANJE),
                            fecha_registro: fecha_actual,
                            is_reembolsable: true,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            total_dias: differenceInCalendarDays(fechaFinalSubsidio, fechaInicioSubsidio) + 1,
                            nombre_colaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea
                        };

                        console.log({ payloadCanjeWithSubsidio })

                        registrosParaCrearCanje.push(payloadCanjeWithSubsidio);
                    }
                }


            }
        } else {
            console.log('un solo responsesDM')
            console.log({ listResponseDMs })

            const { result, data } = listResponseDMs

            if (result) {

                const {
                    id,
                    fecha_inicio,
                    fecha_final,
                    fecha_otorgamiento,
                    total_dias,
                    nombre_colaborador,
                    nombre_tipocontingencia,
                    nombre_tipodescansomedico,
                    user_crea
                } = data as IDescansoMedico

                const idDescansoMedico = id as string

                const responseTotalDias = await this.descansoMedicoRepository.getTotalDiasByColaboradorSinIdDescanso(
                    id_colaborador as string,
                    idDescansoMedico,
                    fecha_otorgamiento_dm
                )

                console.log('console.log responseTotalDias')
                console.log({ responseTotalDias })

                const { result: resultTotalDias, data: totalDiasAcumulados } = responseTotalDias

                if (resultTotalDias) {

                    const diasAcumulados = typeof totalDiasAcumulados === 'string'
                        ? parseInt(totalDiasAcumulados)
                        : totalDiasAcumulados as number;

                    console.log({ diasAcumulados })
                    console.log(typeof diasAcumulados)

                    const totalDiasActual = total_dias as number

                    const newDiasAcumulados = diasAcumulados + totalDiasActual

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
                            id_descansomedico: idDescansoMedico,
                            id_colaborador,
                            fecha_otorgamiento,
                            fecha_inicio_subsidio: fechaInicioSubsidio,
                            fecha_final_subsidio: fechaFinalSubsidio,
                            fecha_inicio_dm: fecha_inicio,
                            fecha_final_dm: fecha_final,
                            fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento_dm, FECHA_MAXIMA_CANJE),
                            fecha_registro: fecha_actual,
                            is_reembolsable: false,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            total_dias: differenceInCalendarDays(fechaFinalSubsidio, fechaInicioSubsidio) + 1,
                            nombre_colaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea
                        };

                        registrosParaCrearCanje.push(payloadCanjeSinSubsidio);
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
                            fecha_maxima_canje: HDate.addDaysToDate(fecha_otorgamiento_dm, FECHA_MAXIMA_CANJE),
                            fecha_registro: fecha_actual,
                            is_reembolsable: true,
                            estado_registro: ECanje.CANJE_REGISTRADO,
                            total_dias: differenceInCalendarDays(fechaFinalSubsidio, fechaInicioSubsidio) + 1,
                            nombre_colaborador,
                            nombre_tipocontingencia,
                            nombre_tipodescansomedico,
                            user_crea
                        };

                        console.log({ payloadCanjeWithSubsidio })

                        registrosParaCrearCanje.push(payloadCanjeWithSubsidio);
                    }
                }
            }
        }

        return registrosParaCrearCanje
    }
}

export default new CreateDescansoService();