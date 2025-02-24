import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DepartmentEntity } from '../../department/entities/department.entity';
import { RoleEntity } from '../../role/entities/role.entity';

@Entity({ name: 'user' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    name: 'password',
    length: 100,
    nullable: false,
    select: true,
    comment: '密码',
  })
  password: string;

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'user_role' })
  roles: RoleEntity[];

  @ManyToOne(() => DepartmentEntity, (department) => department.users)
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;
}
