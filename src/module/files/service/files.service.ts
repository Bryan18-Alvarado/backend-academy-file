import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateFileDto } from '../dto/create-files.dto';
import { UpdateFileDto } from '../dto/update-files.dto';
import { Files } from '../entities/files.entity';
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepo: Repository<Files>,
    private readonly dataSource: DataSource,
  ) {}

  async getAll() {
    const rows = this.dataSource
      .getRepository(Files)
      .createQueryBuilder('files')
      .where('files.id is not null');

    return await rows.getMany();
  }

  async getOne(id: number) {
    const row = await this.filesRepo.findOne({
      where: { id: id },
    });

    if (!row) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return row;
  }

  async create(fileDto: CreateFileDto) {
    try {
      const file = this.filesRepo.create(fileDto);

      return await this.filesRepo.save(file);
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, fileDto: UpdateFileDto) {
    const row = await this.getOne(id);

    const mergeData = this.filesRepo.merge(row, fileDto);

    return await this.filesRepo.save(mergeData);
  }

  async delete(id: number, payload: CreateFileDto) {
    const row = await this.getOne(id);

    const mergeData = this.filesRepo.merge(row, payload);

    const updateData = await this.filesRepo.save(mergeData);

    await this.filesRepo.remove(updateData);

    return row;
  }
}
