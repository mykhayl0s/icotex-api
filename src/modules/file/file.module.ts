import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-s3';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    ConfigModule,
    S3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get<string>('S3_KEY_ID'),configService.get<string>('S3_REGION'))
        return {
          config: {
            credentials: {
              accessKeyId: configService.get<string>('S3_KEY_ID'),
              secretAccessKey: configService.get<string>('S3_SECRET'),
            },
            region: configService.get<string>('S3_REGION'),
            signatureVersion: 'v4',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
