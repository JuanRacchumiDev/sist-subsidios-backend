import { IRepresentanteLegal, RepresentanteLegalResponse } from "../../interfaces/RepresentanteLegal/IRepresentanteLegal";
import { Cargo } from "../../models/Cargo";
import { Empresa } from "../../models/Empresa";
import { RepresentanteLegal } from "../../models/RepresentanteLegal";
import { TipoDocumento } from "../../models/TipoDocumento";
import sequelize from '../../../config/database'
import { TValidateFields } from "../../types/TTypeFields";
import { Op } from "sequelize";
import { REPRESENTANTE_LEGAL_ATTRIBUTES } from "../../../constants/RepresentanteLegalConstant";
import { TIPO_DOCUMENTO_INCLUDE } from "../../../includes/TipoDocumentoInclude";
import { EMPRESA_INCLUDE } from "../../../includes/EmpresaInclude";
import { CARGO_INCLUDE } from "../../../includes/CargoInclude";

class RepresentanteRepository {
    /**
    * Obtiene todos los representantes legales
    * @returns {Promise<RepresentanteLegalResponse>}
    */
    async getAll(): Promise<RepresentanteLegalResponse> {
        try {
            const reprLegales = await RepresentanteLegal.findAll({
                attributes: REPRESENTANTE_LEGAL_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    CARGO_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: reprLegales, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todos los representantes legales por estado
     * @param {boolean} estado - El estado de los representantes legales a buscar
     * @returns {Promise<RepresentanteLegalResponse>}>} Respuesta con la lista de representantes legales filtradas
     */
    async getAllByEstado(estado: boolean): Promise<RepresentanteLegalResponse> {
        try {
            const reprLegales = await RepresentanteLegal.findAll({
                where: {
                    estado
                },
                attributes: REPRESENTANTE_LEGAL_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    CARGO_INCLUDE
                ],
                order: [
                    ['nombre_o_razon_social', 'ASC']
                ]
            })

            return { result: true, data: reprLegales, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Obtiene un representante legal por su ID
    * @param {string} id - El ID UUID del representante legal a buscar
    * @returns {Promise<RepresentanteLegalResponse>} Respuesta con el representante legal encontrado o mensaje de no encontrado
    */
    async getById(id: string): Promise<RepresentanteLegalResponse> {
        try {
            const representante = await RepresentanteLegal.findByPk(id, {
                attributes: REPRESENTANTE_LEGAL_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    CARGO_INCLUDE
                ]
            })

            if (!representante) {
                return { result: false, data: [], message: 'Representante legal no encontrado', status: 404 }
            }

            return { result: true, data: representante, message: 'Representante legal encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un representante legal por tipo y número de documento
     * @param {string} idTipoDoc - El ID del representante legal a buscar
     * @param {string} numDoc - El número de documento del representante legal a buscar
     * @returns {Promise<RepresentanteLegalResponse>}
     */
    async getByIdTipoDocAndNumDoc(idTipoDoc: string, numDoc: string): Promise<RepresentanteLegalResponse> {
        try {
            const representante = await RepresentanteLegal.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: REPRESENTANTE_LEGAL_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    CARGO_INCLUDE
                ]
            })

            if (!representante) {
                return { result: false, data: [], message: 'Representante legal no encontrado', status: 404 }
            }

            return { result: true, data: representante, message: 'Representante legal encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un listado de representantes legales por id de empresa 
     * @param {string} idEmpresa - El ID de la empresa 
     * @returns {Promise<RepresentanteLegalResponse>}
     */
    async getByIdEmpresa(idEmpresa: string): Promise<RepresentanteLegalResponse> {
        try {
            const representantes = await RepresentanteLegal.findOne({
                where: {
                    id_empresa: idEmpresa
                },
                attributes: REPRESENTANTE_LEGAL_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    CARGO_INCLUDE
                ]
            })

            if (!representantes) {
                return { result: false, data: [], message: 'Representantes legales no encontrados', status: 404 }
            }

            return { result: true, data: representantes, message: 'Representantes legales encontrados', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Crea un representante legal
    * @param {IRepresentanteLegal} data - Los datos del representante legal a crear 
    * @returns {Promise<RepresentanteLegalResponse>} Respuesta con el representante legal creado o error
    */
    async create(data: IRepresentanteLegal): Promise<RepresentanteLegalResponse> {
        // Accede a la instancia de Sequelize a través de db.sequelize
        // const transaction = await sequelize.transaction()

        try {
            const {
                numero_documento,
                id_empresa,
                id_cargo,
                correo
            } = data

            if (
                !numero_documento ||
                !id_empresa ||
                !id_cargo ||
                !correo
            ) {
                return {
                    result: false,
                    message: "El número de documento, correo, empresa o cargo son requeridos"
                }
            }

            const fields = {
                numero_documento,
                correo
            }

            const validateFields = await this.validateFieldsRegistered(fields, "crear")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const newRepresentante = await RepresentanteLegal.create(data as IRepresentanteLegal)

            // await transaction.commit()

            const { id } = newRepresentante

            if (id) {
                return { result: true, message: 'Representante legal registrado con éxito', data: newRepresentante, status: 200 }
            }

            return { result: false, error: 'Error al registrar al representante legal', data: [], status: 500 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un representante legal existente por su ID
     * @param {string} id - El ID del representante legal a actualizar 
     * @param {IRepresentanteLegal} data - Los nuevos datos del representante legal 
     * @returns {Promise<RepresentanteLegalResponse>} Respuesta con el representante legal actualizado o error
     */
    async update(id: string, data: IRepresentanteLegal): Promise<RepresentanteLegalResponse> {

        // Accede a la instancia de Sequelize a travé de db.sequelize
        // const transaction = await sequelize.transaction()

        try {
            // const representante = await RepresentanteLegal.findByPk(id, { transaction })
            const representante = await RepresentanteLegal.findByPk(id)

            if (!representante) {
                // await transaction.rollback();
                return { result: false, data: [], message: 'Representante legal no encontrado', status: 404 }
            }

            const { numero_documento, correo } = data

            const fields = { numero_documento, correo }

            const validateFields = await this.validateFieldsRegistered(fields, "actualizar")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const dataRepresentante: Partial<IRepresentanteLegal> = data

            // const updatedRepresentante = await representante.update(dataRepresentante, { transaction })
            const updatedRepresentante = await representante.update(dataRepresentante)

            // await transaction.commit()

            return { result: true, message: 'Representante legal actualizado con éxito', data: updatedRepresentante, status: 200 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (lógicamente) un representante legal con su ID
     * @param {string} id - El ID del representante legal a eliminar 
     * @returns {Promise<RepresentanteLegalResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<RepresentanteLegalResponse> {
        // Inicia la transacción
        // const transaction = await sequelize.transaction()

        try {
            // const representante = await RepresentanteLegal.findByPk(id, { transaction });
            const representante = await RepresentanteLegal.findByPk(id);

            if (!representante) {
                // await transaction.rollback()
                return { result: false, data: [], message: 'Representante legal no encontrado', status: 200 };
            }

            // await representante.destroy({ transaction });
            await representante.destroy();

            // await transaction.commit()

            return { result: true, data: representante, message: 'Representante legal eliminado correctamente', status: 200 };
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }

    async validateFieldsRegistered(
        fields: {
            numero_documento?: string,
            correo?: string
        },
        accion: string
    ): Promise<TValidateFields> {
        const { numero_documento, correo } = fields

        let returnValidate: TValidateFields = {
            result: false,
            message: ""
        }

        if (numero_documento || correo) {
            const whereConditions: any[] = []

            if (numero_documento) {
                whereConditions.push({ numero_documento })
            }

            if (correo) {
                whereConditions.push({ correo })
            }

            const existingRepresentante = await RepresentanteLegal.findOne({
                where: {
                    [Op.or]: whereConditions
                }
            })

            if (existingRepresentante) {
                const message = `El número de documento, correo por ${accion} ya existen`
                returnValidate.result = true
                returnValidate.message = message
            }
        }

        return returnValidate
    }
}

export default new RepresentanteRepository()