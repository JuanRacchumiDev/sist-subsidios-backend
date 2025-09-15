import sequelize from '../../../config/database'
import { PERFIL_ATTRIBUTES } from '../../../constants/PerfilConstant';
import { PERSONA_ATTRIBUTES } from '../../../constants/PersonaConstant';
import { TIPO_DOCUMENTO_INCLUDE } from '../../../includes/TipoDocumentoInclude';
import { IPersona, PersonaResponse } from "../../interfaces/Persona/IPersona";
import { Persona } from "../../models/Persona";
import { TipoDocumento } from "../../models/TipoDocumento";

class PersonaRepository {
    /**
     * Obtiene todas las personas
     * @returns {Promise<PersonaResponse>}
     */
    async getAll(): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                attributes: PERSONA_ATTRIBUTES,
                include: [TIPO_DOCUMENTO_INCLUDE],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: personas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas las personas por estado
     * @param {boolean} estado - El estado de las personas a buscar
     * @returns {Promise<PersonaResponse>}>} Respuesta con la lista de personas filtrados
     */
    async getAllByEstado(estado: boolean): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                where: {
                    estado
                },
                attributes: PERSONA_ATTRIBUTES,
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: personas, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene una persona por su ID
     * @param {string} id - El ID UUID de la persona a buscar
     * @returns {Promise<PersonaResponse>} Respuesta con la persona encontrada o mensaje de no encontrado
     */
    async getById(id: string): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id, {
                attributes: PERSONA_ATTRIBUTES,
                include: [TIPO_DOCUMENTO_INCLUDE]
            })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 404 }
            }

            return { result: true, data: persona, message: 'Persona encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene una persona por su tipo y número de documento
     * @param {string} idTipoDoc - El ID del tipo de documento 
     * @param {string} numDoc - El número de documento 
     * @returns {Promise<PersonaResponse>}
     */
    async getByIdTipoDocAndNumDoc(idTipoDoc: string, numDoc: string): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: PERSONA_ATTRIBUTES,
                include: [TIPO_DOCUMENTO_INCLUDE]
            })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 404 }
            }

            return { result: true, data: persona, message: 'Persona encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea una persona
     * @param {IPersona} data - Los datos de la persona a crear 
     * @returns {Promise<PersonaResponse>} Respuesta con la persona creada o error
     */
    async create(data: IPersona): Promise<PersonaResponse> {

        // Accede a la instancia de Sequelize a través de db.sequelize
        // const transaction = await sequelize.transaction()

        try {
            const { numero_documento } = data

            // Verificar si el número de documento existe en otra persona
            const existingPersona = await Persona.findOne({
                where: {
                    numero_documento
                }
            })

            if (existingPersona) {
                return { result: false, message: 'El número de documento ya existe', status: 409 }
            }

            const newPersona = await Persona.create(data as IPersona)

            // await transaction.commit()

            const { id } = newPersona

            if (id) {
                return { result: true, message: 'Persona registrada con éxito', data: newPersona, status: 200 }
            }

            return { result: false, error: 'Error al registrar la persona', data: [], status: 500 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza una persona existente por su ID
     * @param {string} id - El ID de la persona a actualizar 
     * @param {IPersona} data - Los nuevos datos de la persona 
     * @returns {Promise<PersonaResponse>} Respuesta con la persona actualizada o error
     */
    async update(id: string, data: IPersona): Promise<PersonaResponse> {

        // Accede a la instancia de Sequelize a travé de db.sequelize
        const transaction = await sequelize.transaction()

        try {
            const { numero_documento } = data

            // const persona = await Persona.findByPk(id, { transaction })
            const persona = await Persona.findByPk(id)

            if (!persona) {
                // await transaction.rollback();
                return { result: false, data: [], message: 'Persona no encontrada', status: 404 }
            }

            // Verificar si el número de documento existe en otra persona
            const existingPersona = await Persona.findOne({
                where: {
                    numero_documento
                }
            })

            if (existingPersona) {
                return { result: false, message: 'El número de documento ya existe', status: 409 }
            }

            const dataUpdatePersona: Partial<IPersona> = data

            // const updatedPersona = await persona.update(dataUpdatePersona, { transaction })
            const updatedPersona = await persona.update(dataUpdatePersona)

            // await transaction.commit()

            return { result: true, message: 'Persona actualizada con éxito', data: updatedPersona, status: 200 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de una persona
     * @param {string} id - El ID UUID de la persona 
     * @param {boolean} estado - El nuevo estado de la persona 
     * @returns {Promise<PersonaResponse>} Respuesta con la persona actualizada
     */
    async updateEstado(id: string, estado: boolean): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id)

            if (!persona) {
                return { result: false, message: 'Persona no encontrada', status: 404 }
            }

            persona.estado = estado
            await persona.save()

            return { result: true, message: 'Estado actualizado con éxito', data: persona, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (lógicamente) una persona con su ID
     * @param {string} id - El ID de la persona a eliminar 
     * @returns {Promise<PersonaResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<PersonaResponse> {
        // Inicia la transacción
        const transaction = await sequelize.transaction()

        try {
            // const persona = await Persona.findByPk(id, { transaction });
            const persona = await Persona.findByPk(id);

            if (!persona) {
                // await transaction.rollback()
                return { result: false, data: [], message: 'Persona no encontrada', status: 404 };
            }

            // await persona.destroy({ transaction });
            await persona.destroy();

            // await transaction.commit()

            return { result: true, data: persona, message: 'Persona eliminada correctamente', status: 200 };
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

// export default new PersonaRepository()

export default PersonaRepository