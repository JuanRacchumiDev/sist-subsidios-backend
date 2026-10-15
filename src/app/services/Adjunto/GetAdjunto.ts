import AdjuntoRepository from "../../repositories/Adjunto/AdjuntoRepository";
import { AdjuntoResponse, IAdjunto } from '../../interfaces/Adjunto/IAdjunto';
import { IStorageProvider } from '../../providers/storage/IStorageProvider';
import { S3StorageProvider } from '../../providers/storage/S3StorgateProvider';
import { Readable } from 'stream';

/**
 * @class GetAdjuntoService
 * @description Servicio para obtener un solo adjunto por ID
 */
class GetAdjuntoService {
    private adjuntoRepository: AdjuntoRepository
    private storageProvider: IStorageProvider

    constructor(storageProvider?: IStorageProvider) {
        this.adjuntoRepository = new AdjuntoRepository()
        this.storageProvider = storageProvider || new S3StorageProvider()
    }

    async execute(id: string): Promise<{ response: AdjuntoResponse; stream?: Readable | null }> {
        const response = await this.adjuntoRepository.getById(id)

        const { result, data } = response

        if (!result || !data) {
            return { response }
        }

        const adjunto = data as IAdjunto

        const { file_path } = adjunto

        if (!file_path) {
            return {
                response: { result: false, message: 'Ruta de archivo no registrada.', status: 404 }
            };
        }

        // Obtenemos el stream directamente desde S3 usando la Key (file_path)
        const stream = await this.storageProvider.getFileStream(file_path);

        return { response, stream }
    }
}

export default new GetAdjuntoService()