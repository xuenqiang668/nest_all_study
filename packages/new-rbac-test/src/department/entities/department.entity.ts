import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEntity } from '../../role/entities/role.entity';
import { UsersEntity } from '../../user/entities/user.entity';

@Entity({ name: 'department' })
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  departmentname: string;

  @OneToMany(() => UsersEntity, (user) => user.department)
  users: UsersEntity[];

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'department_role' })
  roles: RoleEntity[];
}
