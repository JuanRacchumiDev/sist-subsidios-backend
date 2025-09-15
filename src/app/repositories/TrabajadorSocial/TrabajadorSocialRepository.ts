import { ITrabajadorSocial, TrabajadorSocialResponse } from "../../interfaces/TrabajadorSocial/ITrabajadorSocial";
import { Area } from "../../models/Area";
import { Cargo } from "../../models/Cargo";
import { Empresa } from "../../models/Empresa";
import { Pais } from "../../models/Pais";
import { Sede } from "../../models/Sede";
import { TipoDocumento } from "../../models/TipoDocumento";
import { TrabajadorSocial } from "../../models/TrabajadorSocial";
import sequelize from '../../../config/database'
import { TValidateFields } from "../../types/TTypeFields";
import { Op } from "sequelize";
import { TRABAJADOR_SOCIAL_ATTRIBUTES } from "../../../constants/TrabajadorSocialAttributes";
import { TIPO_DOCUMENTO_INCLUDE } from "../../../includes/TipoDocumentoInclude";
import { CARGO_INCLUDE } from "../../../includes/CargoInclude";
import { EMPRESA_INCLUDE } from "../../../includes/EmpresaInclude";
import { AREA_INCLUDE } from "../../../includes/AreaInclude";
import { SEDE_INCLUDE } from "../../../includes/SedeInclude";
import { PAIS_INCLUDE } from "../../../includes/PaisInclude";

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
     * Obtiene un trabajador social por tu tipo y número de documento
     * @param {string} idTipoDoc - El ID del tipo de documento 
     * @param {string} numDoc - El número de documento
     * @returns {Promise<TrabajadorSocialResponse>}
     */
    async getByIdTipoDocAndNumDoc(idTipoDoc: string, numDoc: string): Promise<TrabajadorSocialResponse> {
        try {
            const trabSocial = await TrabajadorSocial.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: TRABAJADOR_SOCIAL_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    CARGO_INCLUDE,
                    AREA_INCLUDE,
                    SEDE_INCLUDE,
                    PAIS_INCLUDE
                ]
            })

            if (!trabSocial) {
                return { result: false, data: [], message: 'Trabajador social no encontrado', status: 404 }
            }

            return { result: true, data: trabSocial, message: 'Trabajador social encontrado', status: 200 }
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
        // const transaction = await sequelize.transaction()

        try {

            const {
                id_tipodocumento,
                id_cargo,
                id_empresa,
                numero_documento,
                correo_personal,
                correo_institucional
            } = data

            if (!id_tipodocumento || !id_cargo || !id_empresa || !numero_documento) {
                return { result: false, message: 'El tipo de documento, cargo, empresa o número de documento son requeridos' }
            }

            const fields = { numero_documento, correo_personal, correo_institucional }

            const validateFields = await this.validateFieldsRegistered(fields, "crear")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const newTrabajadorSocial = await TrabajadorSocial.create(data)

            // await transaction.commit()

            const { id } = newTrabajadorSocial

            if (id) {
                return { result: true, message: 'Trabajador social registrado con éxito', data: newTrabajadorSocial, status: 200 }
            }

            return { result: false, error: 'Error al registrar al trabajador social', data: [], status: 500 }
        } catch (error) {
            // await transaction.rollback()
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
        // const transaction = await sequelize.transaction()

        try {
            // const trabajadorSocial = await TrabajadorSocial.findByPk(id, { transaction })
            const trabajadorSocial = await TrabajadorSocial.findByPk(id)

            if (!trabajadorSocial) {
                // await transaction.rollback();
                return { result: false, data: [], message: 'Trabajador social no encontrado', status: 404 }
            }

            const { numero_documento, correo_personal, correo_institucional } = data

            const fields = { numero_documento, correo_personal, correo_institucional }

            const validateFields = await this.validateFieldsRegistered(fields, "actualizar")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const dataUpdateTrabSocial: Partial<ITrabajadorSocial> = data

            // const updatedTrabSocial = await trabajadorSocial.update(dataUpdateTrabSocial, { transaction })
            const updatedTrabSocial = await trabajadorSocial.update(dataUpdateTrabSocial)

            // await transaction.commit()

            return { result: true, message: 'Trabajador social actualizado con éxito', data: updatedTrabSocial, status: 200 }
        } catch (error) {
            // await transaction.rollback()
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
        // const transaction = await sequelize.transaction()

        try {
            // const trabSocial = await TrabajadorSocial.findByPk(id, { transaction });
            const trabSocial = await TrabajadorSocial.findByPk(id);

            if (!trabSocial) {
                // await transaction.rollback()
                return { result: false, data: [], message: 'Trabajador social no encontrado', status: 404 };
            }

            // await trabSocial.destroy({ transaction });
            await trabSocial.destroy();

            // await transaction.commit()

            return { result: true, data: trabSocial, message: 'Trabajador social eliminado correctamente', status: 200 };
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }

    async validateFieldsRegistered(
        fields: { numero_documento?: string, correo_personal?: string, correo_institucional?: string },
        accion: string
    ): Promise<TValidateFields> {
        const { numero_documento, correo_personal, correo_institucional } = fields

        let returnValidate: TValidateFields = {
            result: false,
            message: ""
        }

        if (numero_documento || correo_personal || correo_institucional) {
            const whereConditions: any[] = []

            if (numero_documento) {
                whereConditions.push({ numero_documento })
            }

            if (correo_personal) {
                whereConditions.push({ correo_personal })
            }

            if (correo_institucional) {
                whereConditions.push({ correo_institucional })
            }

            const existingTrabSocial = await TrabajadorSocial.findOne({
                where: {
                    [Op.or]: whereConditions
                }
            })

            if (existingTrabSocial) {
                const message = `El número de documento, email personal o institucional por ${accion} ya existen`
                returnValidate.result = true
                returnValidate.message = message
            }
        }

        return returnValidate
    }
}

// export default new TrabajadorSocialRepository()

export default TrabajadorSocialRepository