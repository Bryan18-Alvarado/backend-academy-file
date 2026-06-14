import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFileDto } from '../dto/create-files.dto';
import { FilesService } from '../service/files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern({ cmd: 'get_all_files' })
  async getAll() {
    const rows = await this.filesService.getAll();

    const datos = {
      data: rows,
      count: rows.length,
    };

    return datos;
  }

  @MessagePattern({ cmd: 'get_one_files' })
  getOne(@Payload() id: number) {
    return this.filesService.getOne(id);
  }

  @MessagePattern({ cmd: 'create_files' })
  async create(@Payload() createFileDto: CreateFileDto) {
    const file = await this.filesService.create(createFileDto);

    const datos = {
      data: file,
      message: 'Archivo creado exitosamente',
    };

    return datos;
  }

  @MessagePattern({ cmd: 'update_files' })
  async update(@Payload() payload: { id: number; fileDto: CreateFileDto }) {
    const { id, fileDto } = payload;

    return this.filesService.update(id, fileDto);
  }

  @MessagePattern({ cmd: 'delete_files' })
  remove(@Payload(ParseIntPipe) id: number, payload: CreateFileDto) {
    return this.filesService.delete(id, payload);
  }
}
