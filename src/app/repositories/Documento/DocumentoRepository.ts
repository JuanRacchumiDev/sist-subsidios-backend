import { DocumentoTipoCont } from "../../models/DocumentoTipoCont";
import { TipoContingencia } from "../../models/TipoContingencia";
import { DocumentoTipoContResponse, IDocumentoTipoCont } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';
import sequelize from '../../../config/database'
import HString from "../../../helpers/HString";

const DOCUMENTO_ATTRIBUTES = [
    'id',
    'id_tipocontingencia',
    'nombre',
    'nombre_url',
    'estado'
];

const TIPO_CONTINGENCIA_INCLUDE = {
    model: TipoContingencia,
    as: 'tipoContingencia',
    attributes: ['id', 'nombre']
}

class DocumentoRepository {
    /**
    * Obtiene todos los documentos por tipo de contingencia
    * @returns {Promise<DocumentoTipoContResponse>}
    */
    async getAll(): Promise<DocumentoTipoContResponse> {
        try {
            const documentos = await DocumentoTipoCont.findAll({
                attributes: DOCUMENTO_ATTRIBUTES,
                include: [
                    TIPO_CONTINGENCIA_INCLUDE
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: documentos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Obtiene un documento por su ID
    * @param {string} id - El ID UUID del documento a buscar
    * @returns {Promise<DocumentoTipoContResponse>} Respuesta con el documento encontrado o mensaje de no encontrado
    */
    async getById(id: string): Promise<DocumentoTipoContResponse> {
        try {
            const documento = await DocumentoTipoCont.findByPk(id, {
                attributes: DOCUMENTO_ATTRIBUTES,
                include: [
                    TIPO_CONTINGENCIA_INCLUDE
                ]
            })

            if (!documento) {
                return { result: false, data: [], message: 'Documento no encontrado', status: 404 }
            }

            return { result: true, data: documento, message: 'Documento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Crea un documento
    * @param {IDocumentoTipoCont} data - Los datos del documento a crear 
    * @returns {Promise<DocumentoTipoContResponse>} Respuesta con el documento creado o error
    */
    async create(data: IDocumentoTipoCont): Promise<DocumentoTipoContResponse> {

        // Accede a la instancia de Sequelize a través de db.sequelize
        const t = await sequelize.transaction()

        try {
            const newDocumento = await DocumentoTipoCont.create(data as IDocumentoTipoCont)

            await t.commit()

            if (newDocumento.id) {
                return { result: true, message: 'Documento registrado con éxito', data: newDocumento, status: 200 }
            }

            return { result: false, error: 'Error al registrar el documento', data: [], status: 500 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un documento existente por su ID
     * @param {string} id - El ID del documento a actualizar 
     * @param {IDocumentoTipoCont} data - Los nuevos datos del colaborador 
     * @returns {Promise<DocumentoTipoContResponse>} Respuesta con el colaborador actualizado o error
     */
    async update(id: string, data: IDocumentoTipoCont): Promise<DocumentoTipoContResponse> {

        // Accede a la instancia de Sequelize a travé de db.sequelize
        const t = await sequelize.transaction()

        try {
            const documento = await DocumentoTipoCont.findByPk(id, { transaction: t })

            if (!documento) {
                await t.rollback();
                return { result: false, data: [], message: 'Documento no encontrado', status: 200 }
            }

            const dataDocumento: Partial<IDocumentoTipoCont> = data
            dataDocumento.nombre_url = HString.convertToUrlString(data.nombre as string)

            const updatedDocumento = await documento.update(dataDocumento, { transaction: t })

            await t.commit()

            return { result: true, message: 'Documento actualizado con éxito', data: updatedDocumento, status: 200 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (lógicamente) un documento con su ID
     * @param {string} id - El ID del documento a eliminar 
     * @returns {Promise<DocumentoTipoContResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<DocumentoTipoContResponse> {
        // Inicia la transacción
        const t = await sequelize.transaction()

        try {
            const documento = await DocumentoTipoCont.findByPk(id, { transaction: t });

            if (!documento) {
                await t.rollback()
                return { result: false, data: [], message: 'Documento no encontrado', status: 200 };
            }

            await documento.destroy({ transaction: t });

            await t.commit()

            return { result: true, data: documento, message: 'Documento eliminado correctamente', status: 200 };
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new DocumentoRepository()