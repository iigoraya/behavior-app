import {
  Controller,
  Post,
  Req,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Express } from 'express';

import { BehaviorService } from './behavior.service';

@Controller('behavior')
export class BehaviorController {
  constructor(private readonly behaviorService: BehaviorService) {}

  @Get()
  async find(@Req() req: Request) {
    return this.behaviorService.getRecords(
      req.query?.pagination?.toString() || '',
    );
  }
  @Post()
  async create(@Req() req: Request) {
    return this.behaviorService.create(req.body);
  }

  @Get('remove')
  async remove(@Req() req: Request) {
    return this.behaviorService.remove(req.query?.id?.toString() || '');
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.behaviorService.upload(file.buffer, file.originalname);
  }
}
