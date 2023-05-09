import { File } from './file'
import { FileStorageService } from './file-storage-service'
// import { S3 } from '@aws-sdk/client-s3'

export class S3FileStorageService implements FileStorageService {
    get(fileName: string): File {
        console.log('S3FileStorageService get', fileName)
        throw new Error('Method not implemented.')
    }
    // constructor(private readonly s3Client: S3) {}

    put(file: File): string {
        console.log('S3FileStorageService put', file)
        throw new Error('not implemented')
        // this.s3Client.putObject({
        //     Body: file.data,
        //     Bucket: process.env.BUCKET,
        //     Key: file.name,
        // })
    }
}
