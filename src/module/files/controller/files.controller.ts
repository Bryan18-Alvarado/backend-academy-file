import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFileDto } from '../dto/create-files.dto';
import { FilesService } from '../service/files.service';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern({ cmd: 'get_file_by_model' })
  getByModel(@Payload() data: { model_id: number }) {
    return this.filesService.findByModel(data.model_id);
  }

  @MessagePattern({ cmd: 'create_files' })
  create(@Payload() dto: CreateFileDto) {
    return this.filesService.create(dto);
  }

  @MessagePattern({ cmd: 'update_student_file' })
  update(@Payload() dto: CreateFileDto) {
    return this.filesService.updateFile(dto);
  }

  @MessagePattern({ cmd: 'get_file_by_name' })
  getFile(@Payload() filename: string) {
    return this.filesService.getFileBuffer(filename);
  }

  @MessagePattern({ cmd: 'delete_by_model' })
  delete(@Payload() data: { model_id: number }) {
    return this.filesService.deleteByModel(data.model_id);
  }
}
