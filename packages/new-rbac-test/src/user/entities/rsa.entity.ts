import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RsaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  publicKey: string;
}
