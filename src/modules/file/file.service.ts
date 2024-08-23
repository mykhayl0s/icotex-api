import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    @InjectS3() private readonly s3: S3,
  ) {}

  private readonly BUCKET = this.configService.get('S3_BUCKET');

  async upload(payload): Promise<string> {
    const key = `${uuidv4()}.${payload.originalname.split('.').reverse()[0]}`;

    await this.s3.putObject({
      Bucket: this.BUCKET,
      Key: key,
      ContentType: payload.mimetype,
      Body: Buffer.from(payload.buffer),
    });

    return key;
  }

  async getFile(filename: string): Promise<Uint8Array> {
    try {
      const res = await this.s3.getObject({
        Bucket: this.BUCKET,
        Key: filename,
      });
      return res.Body.transformToByteArray();
    } catch (err) {
      if (err.message.includes('not exist')) {
        throw new NotFoundException('FILE_NOT_FOUND');
      } else {
        throw err;
      }
    }
  }

  async updateFile(filename: string, file): Promise<string> {
    const [newFilename] = await Promise.all([
      this.upload(file),
      this.deleteFile(filename),
    ]);
    return newFilename;
  }

  async deleteFile(filename: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.BUCKET,
      Key: filename,
    });
  }
}
