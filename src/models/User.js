import { isEmail, isNonEmpty } from '../utils/validator';

export class User {
  constructor({ id, name, email, role = 'viewer' } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = new Date();
  }

  validate() {
    if (!isNonEmpty(this.name)) throw new Error('名称不能为空');
    if (!isEmail(this.email)) throw new Error('邮箱格式不正确');
    if (!['admin', 'editor', 'viewer', 'guest', 'superadmin'].includes(this.role)) {
      throw new Error(`未知角色: ${this.role}`);
    }
  }

  hasPermission(action) {
    const permissions = {
      superadmin: ['read', 'write', 'delete', 'manage', 'audit'],
      admin: ['read', 'write', 'delete', 'manage'],
      editor: ['read', 'write'],
      viewer: ['read'],
      guest: [],
    };
    return permissions[this.role]?.includes(action) ?? false;
  }

  toJSON() {
    return { id: this.id, name: this.name, email: this.email, role: this.role };
  }

  toString() {
    return `User(${this.id}, ${this.name})`;
  }
}
