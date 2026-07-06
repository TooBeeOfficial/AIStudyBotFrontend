export class UserModel {
  id: number;
  name: string;
  email: string;

  constructor(id: number = -1, name: string = '', email: string = '') {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static fromApi(data: any): UserModel {
    return new UserModel(data.id, data.name, data.email);
  }
}
