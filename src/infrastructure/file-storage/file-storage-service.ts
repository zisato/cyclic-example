import { File } from './file'

export interface FileStorageService {
    put(file: File): string

    get(fileName: string): File
}
