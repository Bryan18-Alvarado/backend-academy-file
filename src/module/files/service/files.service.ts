import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs, readFileSync } from 'fs';
import { generateFileName } from 'helper/generate-file-name.helper';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CreateFileDto } from '../dto/create-files.dto';
import { Files } from '../entities/files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly fileRepository: Repository<Files>,
  ) {}

  private getUploadsDir() {
    return join(process.cwd(), 'uploads');
  } //calculamos donde se guardan los archivos

  private async ensureDir() {
    await fs.mkdir(this.getUploadsDir(), { recursive: true });
  } // crea la carpeta uploads si no existe

  async create(dto: CreateFileDto) {
    await this.ensureDir();

    if (!dto.model_id) {
      throw new Error('file_name es requerido');
    }

    const fileName = generateFileName(dto.model_id, dto.originalName);
    const filePath = join(this.getUploadsDir(), fileName);

    const buffer = Buffer.from(dto.buffer, 'base64');

    await fs.writeFile(filePath, buffer);

    const file = this.fileRepository.create({
      model_id: dto.model_id,
      mime: dto.mime,
      file_name: fileName,
    });

    return this.fileRepository.save(file);
  }

  async updateFile(dto: CreateFileDto) {
    const existing = await this.fileRepository.findOne({
      where: { model_id: dto.model_id },
    });

    if (!existing) {
      return this.create(dto);
    }

    const fileName = generateFileName(dto.model_id, dto.originalName);
    const filePath = join(this.getUploadsDir(), fileName);

    const buffer = Buffer.from(dto.buffer, 'base64');

    await fs.writeFile(filePath, buffer);

    try {
      await fs.unlink(join(this.getUploadsDir(), existing.file_name));
    } catch (error) {
      console.warn('Error al eliminar el archivo anterior:', error);
    }

    existing.file_name = fileName;
    existing.mime = dto.mime;

    return this.fileRepository.save(existing);
  }

  async findByModel(modelId: number) {
    return this.fileRepository.findOneBy({ model_id: modelId });
  }

  async findOne(id: number) {
    return this.fileRepository.findOneBy({ id });
  }

  async deleteByModel(modelId: number) {
    const file = await this.fileRepository.findOne({
      where: { model_id: modelId },
    });

    if (!file) return { message: 'No file found' };

    try {
      await fs.unlink(join(this.getUploadsDir(), file.file_name));
    } catch {
      console.warn('error al eliminar el archivo del sistema');
    }

    await this.fileRepository.delete(file.id);

    return { message: 'El archivo fue eliminado exitosamente' };
  }

  async getFileBuffer(filename: string) {
    const file = await this.fileRepository.findOneBy({ file_name: filename });

    if (!file) throw new Error('No se encontro el archivo');

    const buffer = readFileSync(join(this.getUploadsDir(), filename));

    return {
      file: buffer.toString('base64'),
      mime: file.mime,
    };
  }
}
