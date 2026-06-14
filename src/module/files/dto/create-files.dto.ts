import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  model_id: number;

  @IsString()
  mime: string;

  @IsString()
  file_name: string;

  @IsDate()
  @IsOptional()
  created_at: string;

  @IsDate()
  @IsOptional()
  updated_at: string;
}
