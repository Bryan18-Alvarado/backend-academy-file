import { Module } from '@nestjs/common';
import { FilesService } from './service/files.service';
import { FilesController } from './controller/files.controller';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
