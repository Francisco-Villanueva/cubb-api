import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer) {
    const bucketName = 'cubb-media';
    const region = this.configService.getOrThrow('AWS_S3_REGION');
    const res = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ACL: 'public-read',
      }),
    );

    return {
      ...res,
      url: `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
    };
  }
}
