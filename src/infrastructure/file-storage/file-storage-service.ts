import { File } from './file'

export interface FileStorageService {
    put(name: string, file: File): void
}
