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

/**
 * @class CreateDescansoService
 * @description Servicio para crear un descanso médico
 */
class CreateDescansoService {
    /**
     * Ejecuta la operación para crear un descanso médico.
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear.
     * @returns {Promise<DescansoMedicoResponse>} La respuesta de la operación.
     */
    async execute(data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        const {
            id_colaborador,
            id_tipodescansomedico,
            id_tipocontingencia,
            codcie10_diagnostico,
            id_establecimiento
        } = data

        if (!id_colaborador) {
            return { result: false, message: "El colaborador es requerido para crear un descanso médico", status: 400 }
        }

        if (!id_tipodescansomedico) {
            return { result: false, message: "El tipo de descanso médico es requerido para crear un descanso médico", status: 400 }
        }

        if (!id_tipocontingencia) {
            return { result: false, message: "El tipo de contingencia es requerido para crear un descanso médico", status: 400 }
        }

        if (!codcie10_diagnostico) {
            return { result: false, message: "El diagnóstico es requerido para crear un descanso médico", status: 400 }
        }

        if (!id_establecimiento) {
            return { result: false, message: "El establecimiento es requerido para crear un descanso médico", status: 400 }
        }

        const responseColaborador = await ColaboradorRepository.getById(id_colaborador)
        const { result: resultColaborador, data: dataColaborador } = responseColaborador
        if (!resultColaborador || !dataColaborador) {
            return { result: false, message: 'Colaborador no encontrado', status: 404 }
        }

        const responseTipoDM = await TipoDescansoMedicoRepository.getById(id_tipodescansomedico)
        const { result: resultTipoDM, data: dataTipoDM } = responseTipoDM
        if (!resultTipoDM || !dataTipoDM) {
            return { result: false, message: 'Tipo de descanso médico no encontrado', status: 404 }
        }

        const responseTipoContingencia = await TipoContingenciaRepository.getById(id_tipocontingencia)
        const { result: resultTipoContingencia, data: dataTipoContingencia } = responseTipoContingencia
        if (!resultTipoContingencia || !dataTipoContingencia) {
            return { result: false, message: 'Tipo de contingencia no encontrado', status: 404 }
        }

        const responseDiagnostico = await DiagnosticoRepository.getByCodigo(codcie10_diagnostico)
        const { result: resultDiagnostico, data: dataDiagnostico } = responseDiagnostico
        if (!resultDiagnostico || !dataDiagnostico) {
            return { result: false, message: 'Diagnóstico no encontrado', status: 404 }
        }

        const responseEstablecimiento = await EstablecimientoRepository.getById(id_establecimiento)
        const { result: resultEstablecimiento, data: dataEstablecimiento } = responseEstablecimiento
        if (!resultEstablecimiento || !dataEstablecimiento) {
            return { result: false, message: 'Establecimiento no encontrado', status: 404 }
        }

        const { nombres, apellido_paterno, apellido_materno } = dataColaborador as IColaborador
        const nombreColaborador = `${nombres} ${apellido_paterno} ${apellido_materno}`

        const { nombre: nombreTipoDM } = dataTipoDM as ITipoDescansoMedico

        const { nombre: nombreTipoContingencia } = dataTipoContingencia as ITipoContingencia

        const { nombre: nombreDiagnostico } = dataDiagnostico as IDiagnostico

        data.nombre_colaborador = nombreColaborador
        data.nombre_tipodescansomedico = nombreTipoDM
        data.nombre_tipocontingencia = nombreTipoContingencia
        data.nombre_diagnostico = nombreDiagnostico

        return await DescansoMedicoRepository.create(data);
    }
}

export default new CreateDescansoService();