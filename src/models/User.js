export class User {
  constructor(id, name, email, role, createdBy = 'system') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = new Date();
    this.createdBy = createdBy;
  }

  get permissions() {
    const map = {
      admin: ['read', 'write', 'delete'],
      editor: ['read', 'write'],
      viewer: ['read'],
    };
    return map[this.role] ?? [];
  }

  hasPermission(action) {
    return this.permissions.includes(action);
  }

  clone() {
    return new User(this.id, this.name, this.email, this.role, this.createdBy);
  }

  toString() {
    return `User(${this.id}, ${this.name})`;
  }
}
