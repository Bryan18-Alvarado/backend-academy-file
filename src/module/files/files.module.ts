import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './controller/files.controller';
import { Files } from './entities/files.entity';
import { FilesService } from './service/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Files])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
