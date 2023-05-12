import { UuidV1 } from '../identity/uuid-v1'
import { File } from './file'
import { FileStorageService } from './file-storage-service'
import { S3 } from '@aws-sdk/client-s3'

export class S3FileStorageService implements FileStorageService {
    constructor(private readonly s3Client: S3, private readonly bucketName: string) {}

    async get(fileName: string): Promise<File> {
        const result = await this.s3Client.getObject({
            Bucket: this.bucketName,
            Key: fileName
        })
        
        if (!result.Body) {
            throw new Error('Empty body')
        }

        const metadata = result.Metadata ?? {}

        if (!metadata.name || !metadata.mimeType || !metadata.size) {
            throw new Error('Missing metadata keys')
        }

        return new File({
            name: metadata.name,
            mimeType: metadata.mimeType,
            size: Number.parseInt(metadata.size),
            data: Buffer.from(await result.Body.transformToString())
        })
    }

    async put(file: File): Promise<string> {
        const randomFilename = UuidV1.create().value

        await this.s3Client.putObject({
            Body: file.data,
            Bucket: this.bucketName,
            Key: randomFilename,
            Metadata: {
                size: file.size.toString(),
                mimeType: file.mimeType,
                name: file.name
            }
        })

        return randomFilename
    }
}
