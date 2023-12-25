import {HttpStatusCode} from 'axios';
import {UserDTO} from '../../lib/dto/user-dto';
import {User} from '../../model/user';
import * as db from '../db/db-operations';
import {httpResponse} from '../utils/http/http-response';

const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;

export async function handler(): Promise<any> {
  try {
    const users: User[] = await db.getAll(USER_TABLE_NAME);
    const usersDTO: UserDTO[] = users.map(user => new UserDTO(user));
    return httpResponse(
      HttpStatusCode.Ok,
      'Successfully fetched all users ',
      usersDTO
    );
  } catch (dbError) {
    return httpResponse(HttpStatusCode.InternalServerError, dbError);
  }
}
