import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(@Inject() private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file) {
    return this.fileService.upload(file);
  }

  @Get('/:filename')
  async getFile(
    @Param('filename') filename: string,
    @Res() res: any,
  ): Promise<void> {
    const uint8Array = await this.fileService.getFile(filename);
    const fileExtension = filename.split('.').pop();
    const mimeType = `image/${fileExtension}`;

    res.header('Content-Type', mimeType);
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Content-Disposition', `inline; filename="${filename}"`);

    res.send(Buffer.from(uint8Array));
  }
}
