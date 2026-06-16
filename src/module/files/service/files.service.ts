import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs, readFileSync } from 'fs';
import { extname, join } from 'path';
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
  }

  private async ensureDir() {
    await fs.mkdir(this.getUploadsDir(), { recursive: true });
  }

  async create(dto: CreateFileDto) {
    await this.ensureDir();

    const fileName = `${Date.now()}${extname(dto.originalName ?? '')}`;
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

    const fileName = `${Date.now()}${extname(dto.originalName ?? '')}`;
    const filePath = join(this.getUploadsDir(), fileName);

    const buffer = Buffer.from(dto.buffer, 'base64');

    await fs.writeFile(filePath, buffer);

    try {
      await fs.unlink(join(this.getUploadsDir(), existing.file_name));
    } catch (error) {
      console.warn('Failed to delete old file:', error);
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
      return { message: 'File record deleted but file not found on disk' };
    }

    await this.fileRepository.delete(file.id);

    return { message: 'File deleted successfully' };
  }

  async getFileBuffer(filename: string) {
    const file = await this.fileRepository.findOneBy({ file_name: filename });

    if (!file) throw new Error('File not found');

    const buffer = readFileSync(join(this.getUploadsDir(), filename));

    return {
      file: buffer.toString('base64'),
      mime: file.mime,
    };
  }
}
