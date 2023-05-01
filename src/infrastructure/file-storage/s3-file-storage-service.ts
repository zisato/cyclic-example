import { File } from './file'
import { FileStorageService } from './file-storage-service'
// import { S3 } from '@aws-sdk/client-s3'

export class S3FileStorageService implements FileStorageService {
    // constructor(private readonly s3Client: S3) {}

    put(name: string, file: File): void {
        console.log(name, file)
        // this.s3Client.putObject({
        //     Body: file.data,
        //     Bucket: process.env.BUCKET,
        //     Key: file.name,
        // })
    }
}
