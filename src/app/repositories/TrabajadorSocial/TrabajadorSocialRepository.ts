import { ITrabajadorSocial, TrabajadorSocialResponse } from "@/interfaces/TrabajadorSocial/ITrabajadorSocial";
import { Area } from "@/models/Area";
import { Cargo } from "@/models/Cargo";
import { Empresa } from "@/models/Empresa";
import { Pais } from "@/models/Pais";
import { Sede } from "@/models/Sede";
import { TipoDocumento } from "@/models/TipoDocumento";
import { TrabajadorSocial } from "@/models/TrabajadorSocial";
import sequelize from '../../../config/database'

const TRABAJADOR_SOCIAL_ATTRIBUTES = [
    'id',
    'id_tipodocumento',
    'id_cargo',
    'id_empresa',
    'id_area',
    'id_sede',
    'id_pais',
    'numero_documento',
    'apellido_paterno',
    'apellido_materno',
    'nombres',
    'nombre_completo',
    'nombre_area',
    'nombre_sede',
    'nombre_pais',
    'correo_institucional',
    'correo_personal',
    'numero_celular',
    'foto',
    'fecha_nacimiento',
    'fecha_ingreso',
    'fecha_salida',
    'es_representante_legal',
    'estado'
];

const TIPO_DOCUMENTO_INCLUDE = {
    model: TipoDocumento,
    as: 'tipoDocumento',
    attributes: ['id', 'nombre', 'abreviatura']
}

const CARGO_INCLUDE = {
    model: Cargo,
    as: 'cargo',
    attributes: ['id', 'nombre']
}

const EMPRESA_INCLUDE = {
    model: Empresa,
    as: 'empresa',
    attributes: ['id', 'nombre_o_razon_social']
}

const AREA_INCLUDE = {
    model: Area,
    as: 'area',
    attributes: ['id', 'nombre']
}

const SEDE_INCLUDE = {
    model: Sede,
    as: 'sede',
    attributes: ['id', 'nombre']
}

const PAIS_INCLUDE = {
    model: Pais,
    as: 'pais',
    attributes: ['id', 'nombre']
}

class TrabajadorSocialRepository {
    /**
    * Obtiene todos los trabajadores sociales
    * @returns {Promise<TrabajadorSocialResponse>}
    */
    async getAll(): Promise<TrabajadorSocialResponse> {
        try {
            const trabSociales = await TrabajadorSocial.findAll({
                attributes: TRABAJADOR_SOCIAL_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    CARGO_INCLUDE,
                    EMPRESA_INCLUDE,
                    AREA_INCLUDE,
                    SEDE_INCLUDE,
                    PAIS_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: trabSociales, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Obtiene un trabajador social por su ID
    * @param {string} id - El ID UUID del trabajador social a buscar
    * @returns {Promise<TrabajadorSocialResponse>} Respuesta con el trabajador social encontrado o mensaje de no encontrado
    */
    async getById(id: string): Promise<TrabajadorSocialResponse> {
        try {
            const trabajadorSocial = await TrabajadorSocial.findByPk(id, {
                attributes: TRABAJADOR_SOCIAL_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    CARGO_INCLUDE,
                    AREA_INCLUDE,
                    SEDE_INCLUDE,
                    PAIS_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            if (!trabajadorSocial) {
                return { result: false, data: [], message: 'Trabajador social no encontrado', status: 404 }
            }

            return { result: true, data: trabajadorSocial, message: 'Trabajador social encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Crea un trabajador social
    * @param {ITrabajadorSocial} data - Los datos del trabajador social a crear 
    * @returns {Promise<TrabajadorSocialResponse>} Respuesta con el trabajador social creado o error
    */
    async create(data: ITrabajadorSocial): Promise<TrabajadorSocialResponse> {

        // Accede a la instancia de Sequelize a través de db.sequelize
        const t = await sequelize.transaction()

        try {
            const newTrabajadorSocial = await TrabajadorSocial.create(data as any)

            await t.commit()

            if (newTrabajadorSocial.id) {
                return { result: true, message: 'Trabajador social registrado con éxito', data: newTrabajadorSocial, status: 200 }
            }

            return { result: false, error: 'Error al registrar al trabajador social', data: [], status: 500 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un trabajador social existente por su ID
     * @param {string} id - El ID del trabajador social a actualizar 
     * @param {ITrabajadorSocial} data - Los nuevos datos del trabajador social 
     * @returns {Promise<TrabajadorSocialResponse>} Respuesta con el trabajador social actualizado o error
     */
    async update(id: string, data: ITrabajadorSocial): Promise<TrabajadorSocialResponse> {

        // Accede a la instancia de Sequelize a travé de db.sequelize
        const t = await sequelize.transaction()

        try {
            const trabajadorSocial = await TrabajadorSocial.findByPk(id, { transaction: t })

            if (!trabajadorSocial) {
                await t.rollback();
                return { result: false, data: [], message: 'Trabajador social no encontrado', status: 200 }
            }

            const dataUpdateTrabSocial: Partial<ITrabajadorSocial> = data

            const updatedTrabSocial = await trabajadorSocial.update(dataUpdateTrabSocial, { transaction: t })

            await t.commit()

            return { result: true, message: 'Trabajador social actualizado con éxito', data: updatedTrabSocial, status: 200 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (lógicamente) un trabajador social con su ID
     * @param {string} id - El ID del trabajador social a eliminar 
     * @returns {Promise<TrabajadorSocialResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<TrabajadorSocialResponse> {
        // Inicia la transacción
        const t = await sequelize.transaction()

        try {
            const trabSocial = await TrabajadorSocial.findByPk(id, { transaction: t });

            if (!trabSocial) {
                await t.rollback()
                return { result: false, data: [], message: 'Trabajador social no encontrado', status: 200 };
            }

            await TrabajadorSocial.destroy({ transaction: t });

            await t.commit()

            return { result: true, data: trabSocial, message: 'Trabajador social eliminado correctamente', status: 200 };
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TrabajadorSocialRepository()