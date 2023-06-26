import { httpResponse } from '../utils/http/http-response';
import { HttpStatusCode } from "axios";
import * as db from '../db/db-operations'
import { PostUserIdIndexFields } from '../constants/indexes-fields';
import { Indexes } from '../constants/indexes';
import { getPathParameter } from '../utils/event-parser';

const POST_TABLE_NAME = process.env.POST_TABLE_NAME!;

export async function handler(event: any={}) : Promise <any> {
    const userId = getPathParameter(event, 'userId');
    
    const posts = await getUserPosts(userId);
    return httpResponse(HttpStatusCode.Ok, `Fetched posts for current user`, posts);
}

async function getUserPosts(currentUserId: string) {
    const fields = new PostUserIdIndexFields(currentUserId);
    return await db.getByMultipleFields(POST_TABLE_NAME, Indexes.PostUserIdIndex, fields);
}