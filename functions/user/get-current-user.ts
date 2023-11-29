import { HttpStatusCode } from 'axios';
import * as db from '../db/db-operations';
import { httpResponse } from '../utils/http/http-response';
import { UserDTO } from '../../lib/dto/user-dto';
import { User } from '../../model/user';
import { isEmpty } from '../utils/object-validator';
import { getAuthorizedUserId } from '../utils/event-parser';

const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;

export async function handler(event: any = {}) : Promise <any> {
  const currentUserId = getAuthorizedUserId(event);

  const user : User = await db.getById(USER_TABLE_NAME, currentUserId);
  if (isEmpty(user)) {
    return httpResponse(HttpStatusCode.InternalServerError, `There is not user with id ${currentUserId}`);
  }

  console.log('u', user);
  const userDTO: UserDTO = new UserDTO(user);
  console.log('user', userDTO);
  return httpResponse(HttpStatusCode.Ok, 'Successfully fetched currently logged user ', user);
}
