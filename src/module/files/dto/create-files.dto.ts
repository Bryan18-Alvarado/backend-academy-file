import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsNumber()
  model_id: number;

  @IsString()
  mime: string;

  @IsString()
  @IsOptional()
  file_name?: string;

  @IsString()
  buffer: string;

  @IsOptional()
  @IsString()
  originalName?: string;
}
