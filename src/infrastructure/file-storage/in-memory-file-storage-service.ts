import { UuidV1 } from '../identity/uuid-v1'
import { File } from './file'
import { FileStorageService } from './file-storage-service'

const FileMimeType: { [mimeType: string]: string } = {
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'text/plain': 'txt',
    'image/png': 'png'
}

type InMemoryData = {
    [fileName: string]: File
}

export default class InMemoryFileStorageService implements FileStorageService {
    private readonly data: InMemoryData

    constructor() {
        this.data = {}
    }

    async put(file: File): Promise<string> {
        const fileName = this.generateFilename(file)

        this.data[fileName] = file

        return fileName
    }

    async get(fileName: string): Promise<File> {
        if (!this.data[fileName]) {
            throw new Error('No File for filename exists')
        }

        return this.data[fileName]
    }

    private generateFilename(file: File): string {
        return `${UuidV1.create().value}.${this.guessExtension(file.mimeType)}`
    }

    private guessExtension(mimeType: string): string {
        return FileMimeType[mimeType]
    }
}
