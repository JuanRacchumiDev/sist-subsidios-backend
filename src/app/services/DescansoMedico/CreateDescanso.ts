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
import {
    isSameMonth,
    endOfMonth,
    startOfMonth,
    addMonths,
    format,
    differenceInCalendarDays,
    parseISO
} from 'date-fns';

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

    constructor() {
        this.descansoMedicoRepository = new DescansoMedicoRepository();
        this.colaboradorRepository = new ColaboradorRepository();
        this.adjuntoRepository = new AdjuntoRepository();
        this.tipoDescansoMedicoRepository = new TipoDescansoMedicoRepository()
        this.tipoContingenciaRepository = new TipoContingenciaRepository()
        this.diagnosticoRepository = new DiagnosticoRepository()
    }

    /**
     * Ejecuta la operación para crear un descanso médico.
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear.
     * @returns {Promise<ResponseTransaction>} La respuesta de la operación.
     */
    async execute(data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        console.log('data new descanso médico', data)

        const {
            id_colaborador,
            id_tipodescansomedico,
            id_tipocontingencia,
            codcie10_diagnostico,
            fecha_inicio,
            fecha_final,
            codigo_temp
        } = data

        if (!id_colaborador) return { result: false, message: "El colaborador es requerido para crear un descanso médico", status: 400 }

        if (!id_tipodescansomedico) return { result: false, message: "El tipo de descanso médico es requerido para crear un descanso médico", status: 400 }

        if (!id_tipocontingencia) return { result: false, message: "El tipo de contingencia es requerido para crear un descanso médico", status: 400 }

        if (!codcie10_diagnostico) return { result: false, message: "El diagnóstico es requerido para crear un descanso médico", status: 400 }

        const responseColaborador = await this.colaboradorRepository.getById(id_colaborador)
        const { result: resultColaborador, data: dataColaborador } = responseColaborador
        if (!resultColaborador || !dataColaborador) return { result: false, message: 'Colaborador no encontrado', status: 404 }

        const responseTipoDM = await this.tipoDescansoMedicoRepository.getById(id_tipodescansomedico)
        const { result: resultTipoDM, data: dataTipoDM } = responseTipoDM
        if (!resultTipoDM || !dataTipoDM) return { result: false, message: 'Tipo de descanso médico no encontrado', status: 404 }

        const responseTipoContingencia = await this.tipoContingenciaRepository.getById(id_tipocontingencia)
        const { result: resultTipoContingencia, data: dataTipoContingencia } = responseTipoContingencia
        if (!resultTipoContingencia || !dataTipoContingencia) return { result: false, message: 'Tipo de contingencia no encontrado', status: 404 }

        const responseDiagnostico = await this.diagnosticoRepository.getByCodigo(codcie10_diagnostico)
        const { result: resultDiagnostico, data: dataDiagnostico } = responseDiagnostico
        if (!resultDiagnostico || !dataDiagnostico) return { result: false, message: 'Diagnóstico no encontrado', status: 404 }

        const { nombres, apellido_paterno, apellido_materno, correo_personal } = dataColaborador as IColaborador

        const nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`

        // const { nombre: nombreTipoDM } = dataTipoDM as ITipoDescansoMedico

        // const { nombre: nombreTipoContingencia } = dataTipoContingencia as ITipoContingencia

        // const { nombre: nombreDiagnostico } = dataDiagnostico as IDiagnostico

        try {
            const startDate = parseISO(fecha_inicio as string)
            const endDate = parseISO(fecha_final as string)

            // console.log('startDate', startDate)
            // console.log('endDate', endDate)

            // Verificar si ambas fechas están en el mismo mes
            if (isSameMonth(startDate, endDate)) {
                console.log('fechas en el mismo mes')
                // console.log('yyy')
                // const newRecord = {
                //     ...dataDM
                // }
                // console.log('newRecord descanso médico', data)
                // return this.descansoMedicoRepository.create(newRecord)

                const responseDescansoMedico = await this.descansoMedicoRepository.create(data)
                // const { data: dataDM} = responseDescansoMedico

                const { result: resultDM, error: errorDM, data: dataDM, message: messageDM } = responseDescansoMedico

                // Error de descanso médico
                if (!resultDM) {
                    return responseDescansoMedico
                }

                const { id: idDescansoMedico } = dataDM as IDescansoMedico

                // console.log('idDescansoMedico nuevo registro', idDescansoMedico)

                // Actualizar los documentos adjuntos, asignándoles el id de descanso médico
                await this.adjuntoRepository.updateForCodeTemp(idDescansoMedico as string, codigo_temp as string)

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

                return responseDescansoMedico
            } else {
                console.log('fechas en diferentes meses')
                // console.log('zzz')
                // Fechas en diferentes meses, dividimos en múltiples registros
                const recordsToCreate: IDescansoMedico[] = []
                let currentStartDate = startDate
                let idDescansoMedico: string = ""

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

                // Usamos una transacción para asegurarnos que todos los registros son creados o ninguno
                const results = await this.descansoMedicoRepository.createMultiple(recordsToCreate) as DescansoMedicoResponse[]

                // Verificamos si todos los registros fueron creados satisfactoriamente
                const allSuccessful = results.every(res => res.result);

                if (allSuccessful) {

                    // Obtener los IDs de los descansos médicos creados
                    const createIds = results
                        .filter(res => res.data && 'id' in res.data)
                        .map(res => (res.data as IDescansoMedico).id as string)

                    console.log("IDs de los descansos médicos creados: ", createIds)

                    // Actualizar los documentos adjuntos, asignándoles el id de descanso médico
                    // await this.adjuntoRepository.updateForCodeTemp(idDescansoMedico as string, codigo_temp as string)
                    await this.adjuntoRepository.updateAndCreateForCodeTemp(createIds, codigo_temp as string)

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
                        message: 'Descanso médico registrado con éxito en múltiples registros',
                        data: recordsToCreate,
                        status: 200,
                    };
                } else {
                    // Handle rollback if needed, depends on your repository's createMultiple implementation
                    return {
                        result: false,
                        error: 'Error al registrar uno o más descansos médicos',
                        status: 500,
                    };
                }
            }

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

export default new CreateDescansoService();