import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AccessEntity } from '../../access/entities/access.entity';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  rolename: string;

  @ManyToMany(() => AccessEntity)
  @JoinTable({ name: 'role_access' })
  access: AccessEntity[];
}
