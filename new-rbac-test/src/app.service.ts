import { EntityManager } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

import { AccessEntity } from './access/entities/access.entity';
import { DepartmentEntity } from './department/entities/department.entity';
import { RoleEntity } from './role/entities/role.entity';

@Injectable()
export class AppService {
  @InjectEntityManager()
  entityManager: EntityManager;

  async getHello(): Promise<AccessEntity[]> {
    const res = await this.entityManager.find(AccessEntity, {
      where: {
        id: 2,
      },
      relations: {
        parentCategory: true,
        childCategorys: true,
      },
    });
    console.log(res);

    return res;
  }

  async getInit() {
    // 部门初始化
    const department1 = new DepartmentEntity();
    department1.departmentname = '人才部';
    const department2 = new DepartmentEntity();
    department2.departmentname = '维修部';
    const department3 = new DepartmentEntity();
    department3.departmentname = '调研部';
    const department4 = new DepartmentEntity();
    department4.departmentname = '销售部';
    // await this.entityManager.save(DepartmentEntity, [
    //   department1,
    //   department2,
    //   department3,
    //   department4,
    // ]);

    // 初始化角色
    const role1 = new RoleEntity();
    role1.rolename = '管理员';

    const role2 = new RoleEntity();
    role2.rolename = '普通用户';

    // await this.entityManager.save(RoleEntity, [role1, role2]);

    // 初始化权限
    const parentCategoryAcc = new AccessEntity();
    parentCategoryAcc.module_name = '管理模块';
    parentCategoryAcc.action_name = '';
    parentCategoryAcc.type = 1;
    parentCategoryAcc.url = 'module';
    // await this.entityManager.save(AccessEntity, [parentCategoryAcc]);

    const access4 = new AccessEntity();
    access4.module_name = '角色模块';
    access4.action_name = '';
    access4.type = 2;
    access4.url = 'user';
    access4.parentCategory = parentCategoryAcc;
    // await this.entityManager.save(AccessEntity, [access4]);

    const access = new AccessEntity();
    access.module_name = 'crud模块';
    access.action_name = '删除';
    access.type = 3;
    access.url = 'delete';
    access.parentCategory = access4;

    const access2 = new AccessEntity();
    access2.module_name = 'crud模块';
    access2.action_name = '新增';
    access2.type = 3;
    access2.url = 'add';
    access2.parentCategory = access4;

    const access3 = new AccessEntity();
    access3.module_name = 'crud模块';
    access3.action_name = '修改和更新';
    access3.type = 3;
    access3.url = 'editOrUpdate';
    access3.parentCategory = access4;

    // await this.entityManager.save(AccessEntity, [access, access2, access3]);

    this.entityManager.transaction(async (manager) => {
      await manager.save(DepartmentEntity, [
        department1,
        department2,
        department3,
        department4,
      ]);

      await manager.save(RoleEntity, [role1, role2]);

      await manager.save(AccessEntity, [parentCategoryAcc]);
      await manager.save(AccessEntity, [access4]);
      return await manager.save(AccessEntity, [access, access2, access3]);
    });
    return 'done';
  }
}
