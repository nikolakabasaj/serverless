import { getPathParameter } from '../utils/event-parser';
import * as db from '../db/db-operations'
import { Post } from '../../model/post';
import { httpResponse } from '../utils/http/http-response';
import { HttpStatusCode } from 'axios';

const POST_TABLE_NAME = process.env.POST_TABLE_NAME!;

export async function handler(event: any={}) : Promise <any> {
    const postId = getPathParameter(event, 'postId');

    const post = await db.getById(POST_TABLE_NAME, postId) as Post;
    post.likes++;

    await db.add(POST_TABLE_NAME, post);
    return httpResponse(HttpStatusCode.Ok, `Post with id ${postId} is successfully liked`);
}
    