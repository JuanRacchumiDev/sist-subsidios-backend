import { Diagnostico } from "../../models/Diagnostico";
import HString from "../../../helpers/HString";
import { IDiagnostico, DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';
import { Op } from 'sequelize'

const DIAGNOSTICO_ATTRIBUTES = [
    'codCie10',
    'nombre',
    'nombre_url',
    "tiempo",
    'sistema',
    'estado'
];

class DiagnosticoRepository {
    /**
     * Obtiene todos los diagnósticos
     * @returns {Promise<DiagnosticoResponse>} Respuesta con la lista de diagnósticos
     */
    async getAll(): Promise<DiagnosticoResponse> {
        try {
            const diagnosticos = await Diagnostico.findAll({
                attributes: DIAGNOSTICO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: diagnosticos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas los diagnósticos por estado
     * @param {boolean} estado - El estado de los diagnósticos a buscar
     * @returns {Promise<DiagnosticoResponse>}>} Respuesta con la lista de diagnósticos filtrados
     */
    async getAllByEstado(estado: boolean): Promise<DiagnosticoResponse> {
        try {
            const diagnosticos = await Diagnostico.findAll({
                where: {
                    estado
                },
                attributes: DIAGNOSTICO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: diagnosticos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un diagnóstico por su código
     * @param {string} codCie10 - El CÓDIGO del diagnóstico a buscar
     * @returns {Promise<DiagnosticoResponse>} Respuesta con el diagnóstico encontrado o mensaje de no encontrado
     */
    async getByCodigo(codCie10: string): Promise<DiagnosticoResponse> {
        try {
            const diagnostico = await Diagnostico.findByPk(codCie10, {
                attributes: DIAGNOSTICO_ATTRIBUTES
            })

            if (!diagnostico) {
                return { result: false, data: [], message: 'Diagnóstico no encontrado', status: 404 }
            }

            return { result: true, data: diagnostico, message: 'Diagnóstico encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un diagnóstico por su nombre
     * @param {string} nombre - El nombre del diagnóstico a buscar 
     * @returns {Promise<DiagnosticoResponse>} Respuesta con el diagnóstico encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<DiagnosticoResponse> {
        try {
            const diagnostico = await Diagnostico.findOne({
                where: {
                    nombre
                },
                attributes: DIAGNOSTICO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            if (!diagnostico) {
                return { result: false, data: [], message: 'Diagnóstico no encontrado', status: 404 }
            }

            return { result: true, data: diagnostico, message: 'Diagnóstico encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo diagnóstico
     * @param {IDiagnostico} data - Los datos del diagnóstico a crear 
     * @returns {Promise<DiagnosticoResponse>} Respuesta con el diagnóstico creado
     */
    async create(data: IDiagnostico): Promise<DiagnosticoResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un diagnóstico', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingsDiagnostico = await Diagnostico.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingsDiagnostico) {
                return { result: false, message: 'El diagnóstico por registrar ya existe', status: 409 }
            }

            const newDiagnostico = await Diagnostico.create(data as IDiagnostico)

            if (newDiagnostico) {
                return { result: true, message: 'Diagnóstico registrado con éxito', data: newDiagnostico, status: 200 }
            }

            return { result: false, message: 'Error al registrar el diagnóstico', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un diagnóstico existente
     * @param {string} codCie10 - El código Cie10 del diagnóstico a actualizar 
     * @param {IDiagnostico} data - Los nuevos datos del diagnóstico 
     * @returns {Promise<DiagnosticoResponse>} Respuesta con el diagnóstico actualizado
     */
    async update(codCie10: string, data: IDiagnostico): Promise<DiagnosticoResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const diagnostico = await Diagnostico.findByPk(codCie10)

            if (!diagnostico) {
                return { result: false, message: 'Diagnóstico no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro diagnóstico
            if (nombre && nombre !== diagnostico.nombre) {
                const existingsDiagnostico = await Diagnostico.findOne({
                    where: {
                        nombre,
                        codCie10: {
                            [Op.ne]: codCie10
                        }
                    }
                })

                if (existingsDiagnostico) {
                    return { result: false, message: 'El diagnóstico por actualizar ya existe', status: 409 }
                }
            }

            const updatedDiagnostico = await diagnostico.update(data)

            return { result: true, message: 'Diagnóstico actualizado con éxito', data: updatedDiagnostico, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un diagnóstico
     * @param {string} codCie10 - El código cie10 del diagnóstico 
     * @param {boolean} estado - El nuevo estado del diagnóstico 
     * @returns {Promise<DiagnosticoResponse>} Respuesta con el diagnóstico actualizado
     */
    async updateEstado(codCie10: string, estado: boolean): Promise<DiagnosticoResponse> {
        try {
            const diagnostico = await Diagnostico.findByPk(codCie10)

            if (!diagnostico) {
                return { result: false, message: 'Diagnóstico no encontrado', status: 404 }
            }

            diagnostico.estado = estado
            await diagnostico.save()

            return { result: true, message: 'Estado actualizado con éxito', data: diagnostico, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un diagnóstico
     * @param {string} codCie10 - El código cie10 del diagnóstico a eliminar
     * @returns {Promise<DiagnosticoResponse>} Respuesta con el diagnóstico eliminado 
     */
    async delete(codCie10: string): Promise<DiagnosticoResponse> {
        try {
            const diagnostico = await Diagnostico.findByPk(codCie10);

            if (!diagnostico) {
                return { result: false, data: [], message: 'Diagnóstico no encontrado', status: 404 };
            }

            await diagnostico.destroy();

            return { result: true, data: diagnostico, message: 'Diagnóstico eliminada¿o correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new DiagnosticoRepository()