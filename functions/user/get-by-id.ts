import { HttpStatusCode } from 'axios';
import * as db from '../db/db-operations';
import { httpResponse } from '../utils/http/http-response';
import { UserDTO } from '../../lib/dto/user-dto';
import { User } from '../../model/user';

export async function handler(id: string) : Promise <any> {
  try {
    const user: User = await db.getById(process.env.USER_TABLE_NAME!, id);
    const userDTO: UserDTO = new UserDTO(user);
    return httpResponse(HttpStatusCode.Ok, `Successfully fetched user with id: ${id}`, userDTO);
  } catch (dbError) {
    return httpResponse(HttpStatusCode.InternalServerError, dbError);
  }
}
