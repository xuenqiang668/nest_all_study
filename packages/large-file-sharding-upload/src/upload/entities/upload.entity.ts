import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: '文件的唯一以hash值',
    default: null,
  })
  file_hash: string;

  @Column({
    type: 'varchar',
    comment: '分片序号',
    default: null,
  })
  chunck_number: string;

  @Column({
    type: 'varchar',
    comment: '分片大小',
    default: null,
  })
  chunck_size: string;

  @Column({
    type: 'varchar',
    comment: '文件名称',
    default: null,
  })
  file_name: string;

  @Column({
    type: 'varchar',
    comment: '总分片数',
    default: null,
  })
  chunck_total_number: string;
}
