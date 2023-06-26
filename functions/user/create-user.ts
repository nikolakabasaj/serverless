import * as db from '../db/db-operations'
import { httpResponse } from '../utils/http/http-response';
import { HttpStatusCode } from "axios";

export async function handler(event: any={}) : Promise <any> {
  const item = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
  
  try {
    await db.add(process.env.USER_TABLE_NAME!, item);
    return httpResponse(HttpStatusCode.Ok, `Item successfully added to ${process.env.USER_TABLE_NAME!} database`);
  } catch (dbError) {
    return httpResponse(HttpStatusCode.InternalServerError, dbError);
  }
}