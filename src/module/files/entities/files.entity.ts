import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'files', name: 'file' })
export class FilesEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int4', nullable: false })
  model_id: number;

  @Column({ type: 'int4', nullable: false })
  user_id: number;

  @Column({ type: 'int4', nullable: false })
  user_updated_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  mime: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  file_name: string;
}
