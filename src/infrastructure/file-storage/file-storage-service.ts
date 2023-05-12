import { File } from './file'

export interface FileStorageService {
    put(file: File): Promise<string>

    get(fileName: string): Promise<File>
}
