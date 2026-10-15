import { Readable } from 'stream';

export interface IStorageProvider {
    uploadFile(file: Express.Multer.File, keyPath: string): Promise<string>,
    deleteFile(keyPath: string): Promise<void>;
    getFileStream(keyPath: string): Promise<Readable | null>;
}