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
/**
 * @class CreateDescansoService
 * @description Servicio para crear un descanso médico
 */
class CreateDescansoService {
    /**
     * Ejecuta la operación para crear un descanso médico.
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear.
     * @returns {Promise<DescansoMedicoResponse | CanjeResponse>} La respuesta de la operación.
     */
    async execute(data: IDescansoMedico): Promise<DescansoMedicoResponse | CanjeResponse> {
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

        const { nombres, apellido_paterno, apellido_materno } = dataColaborador as IColaborador

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
        const { result: resultTotalDias, data: totalDiasAcumulados } = totalDiasResponse

        if (!resultTotalDias) {
            return { result: false, message: 'Error al obtener los días de descanso acumulados', status: 500 };
        }

        const totalDiasWithNuevoDescanso = (totalDiasAcumulados || 0) + (total_dias as number)

        // Manejo de la lógica de canje dentro de una transacción
        const t = await sequelize.transaction();

        try {
            const siguienteCorrelatvo = await DescansoMedicoRepository.generateCorrelativo()

            console.log({ siguienteCorrelatvo })

            payloadData.codigo = siguienteCorrelatvo

            console.log('payloadData newdescanso', payloadData)

            const responseNewDescanso = await DescansoMedicoRepository.create(payloadData);

            const { result, data } = responseNewDescanso

            if (!result || !data) {
                console.log('error en el service')
                await t.rollback();
                return { result: false, message: 'Error al registrar el descanso médico', status: 500 };
            }

            const dataDescansoMedico = data as IDescansoMedico

            const { id: idDescansoMedico } = dataDescansoMedico;

            console.log('id newdescanso', idDescansoMedico)

            // Actualizar los documentos adjuntos, asignándoles el id de descanso médico
            await AdjuntoRepository.updateForCodeTemp(idDescansoMedico as string, codigo_temp as string)

            if (totalDiasWithNuevoDescanso < TOTAL_DIAS_DESCANSO_MEDICO) {
                await t.commit();
                return responseNewDescanso;
            }

            // Crear nuevo canje primera parte
            const diasMaximo: number = TOTAL_DIAS_DESCANSO_MEDICO - (totalDiasWithNuevoDescanso || 0)

            const fechaFinalFirstSubsidio: string = HDate.addDaysToDate(fecha_inicio as string, diasMaximo)

            const fechaInicioLastSubsidio = HDate.addDaysToDate(fechaFinalFirstSubsidio, 1)

            const fechaMaximaCanje: string = HDate.addDaysToDate(fechaFinalFirstSubsidio, 10)

            const fechaActual: string = HDate.getCurrentDateToString('yyyy-MM-dd')

            // Crear el primer canje (no reembolsable, hasta el día 20)
            const payloadCanjeWithoutSubsidio: ICanje = {
                id_descansomedico: idDescansoMedico,
                codigo: 'CANJ-0001-2025',
                fecha_inicio_subsidio: fecha_inicio,
                fecha_final_subsidio: fechaFinalFirstSubsidio,
                fecha_inicio_dm: fecha_inicio,
                fecha_final_dm: fecha_final,
                fecha_maxima_canje: fechaMaximaCanje,
                fecha_registro: fechaActual,
                is_reembolsable: false,
                estado_registro: ECanje.CANJE_REGISTRADO
            }

            const responseCanjeWithoutSubsidio = await CanjeRepository.create(payloadCanjeWithoutSubsidio, t);

            const { result: resultWithoutSubsidio } = responseCanjeWithoutSubsidio

            if (!resultWithoutSubsidio) {
                await t.rollback();
                return { result: false, message: 'Error al registrar el canje sin subsidio', status: 500 };
            }

            // Crear nuevo canje segunda parte
            const payloadCanjeWithSubsidio: ICanje = {
                id_descansomedico: idDescansoMedico,
                codigo: 'CANJ-0001-2025',
                fecha_inicio_subsidio: fechaInicioLastSubsidio,
                fecha_final_subsidio: fecha_final,
                fecha_inicio_dm: fecha_inicio,
                fecha_final_dm: fecha_final,
                fecha_maxima_canje: fechaMaximaCanje,
                fecha_registro: fechaActual,
                is_reembolsable: false,
                estado_registro: ECanje.CANJE_REGISTRADO
            }

            const responseCanjeWithSubsidio = await CanjeRepository.create(payloadCanjeWithSubsidio, t)

            const { result: resultWithSubsidio } = responseCanjeWithSubsidio

            if (!resultWithSubsidio) {
                await t.rollback();
                return { result: false, message: 'Error al registrar el canje con subsidio', status: 500 };
            }

            await t.commit();
            return responseNewDescanso;
        } catch (error) {
            await t.rollback();
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new CreateDescansoService();