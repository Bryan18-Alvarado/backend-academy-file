import { Module } from '@nestjs/common';
import { DatabaseProvider } from './datababase.provider';

@Module({
  imports: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
