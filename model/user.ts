import { BaseEntity } from './base-entity';

export class User extends BaseEntity {
  public username: string;

  public email: string;

  public password: string;

  constructor(username: string, email: string, password: string) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
