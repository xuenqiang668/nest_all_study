import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity({ name: 'access' })
@Tree('closure-table')
export class AccessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, comment: '模块' })
  module_name: string;

  @Column({ type: 'varchar', length: 30, nullable: true, comment: '操作' })
  action_name: string;

  @Column({ type: 'tinyint', comment: '类型：1:模块，2：菜单，3：操作' })
  type: number;

  @Column({ type: 'text', nullable: true, comment: '操作地址' })
  url: string;

  @TreeParent()
  parentCategory: AccessEntity;

  @TreeChildren()
  childCategorys: AccessEntity[];
}
