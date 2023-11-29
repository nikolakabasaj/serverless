import { BaseDTO } from './base-dto';
import { User } from '../../model/user';

export class UserDTO extends BaseDTO {
  public username: string;

  public email: string;

  constructor(user: User) {
    super();
    this.id = user.id;
    this.createdAt = user.createdAt;
    this.username = user.username;
    this.email = user.email;
  }
}
