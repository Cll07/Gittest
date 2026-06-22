export class User {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = new Date();
  }

  hasPermission(action) {
    const permissions = {
      admin: ['read', 'write', 'delete'],
      editor: ['read', 'write'],
      viewer: ['read'],
    };
    return permissions[this.role]?.includes(action) ?? false;
  }

  toString() {
    return `User(${this.id}, ${this.name})`;
  }
}
