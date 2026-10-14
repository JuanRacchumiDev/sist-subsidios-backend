import AdjuntoRepository from '../../repositories/Adjunto/AdjuntoRepository';
import { IAdjunto, AdjuntoResponse } from '../../interfaces/Adjunto/IAdjunto';
import { IStorageProvider } from '../../providers/storage/IStorageProvider';
import { S3StorageProvider } from '../../providers/storage/S3StorgateProvider';
import HFile from '../../../helpers/HFile';

interface ICreateAdjuntoDTO {
    file: Express.Multer.File
    bodyData: {
        id_tipoadjunto: string
        id_descansomedico?: string
        id_canje?: string
        id_cobro?: string
        id_reembolso?: string
        id_persona?: string
        id_documento?: string
        codigo_temp?: string
        ruc?: string
        numero_documento?: string
    }
}

/**
 * @class CreateAdjuntoService
 * @description Servicio para crear un nuevo adjunto.
 */
class CreateAdjuntoService {
    private adjuntoRepository: AdjuntoRepository
    private storageProvider: IStorageProvider

    constructor(storageProvider?: IStorageProvider) {
        this.adjuntoRepository = new AdjuntoRepository()
        this.storageProvider = storageProvider || new S3StorageProvider()
    }
    /**
     * Ejecuta la operación para crear un adjunto.
     * @param {IAdjunto} data - Los datos del adjunto a crear.
     * @returns {Promise<AdjuntoResponse>} La respuesta de la operación.
     */
    async execute({ file, bodyData }: ICreateAdjuntoDTO): Promise<AdjuntoResponse> {
        const {
            id_tipoadjunto,
            id_descansomedico,
            id_canje,
            id_cobro,
            id_reembolso,
            id_persona,
            id_documento,
            codigo_temp,
            ruc,
            numero_documento
        } = bodyData

        // Generar la clave de ruta para S3
        const s3Key = HFile.generateS3Key({
            originalName: file.originalname,
            ruc,
            numero_documento
        })

        // Subir buffer directamente a S3
        const uploadedPath = await this.storageProvider.uploadFile(file, s3Key)

        // Mapear objeto para el repositorio / base de datos
        const fileData: IAdjunto = {
            id_tipoadjunto,
            id_descansomedico,
            id_canje,
            id_cobro,
            id_reembolso,
            id_persona,
            id_documento,
            file_name: file.originalname,
            file_type: file.mimetype,
            file_data: file.buffer,
            file_path: uploadedPath,
            codigo_temp
        }

        return await this.adjuntoRepository.create(fileData)
    }

    // async execute(data: IAdjunto): Promise<AdjuntoResponse> {
    //     console.log('---- CreateAdjunto - createAdjuntoService ----')
    //     console.log({ data })
    //     return await this.adjuntoRepository.create(data);
    // }
}

export default new CreateAdjuntoService();