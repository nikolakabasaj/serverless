import { getAuthorizedUserId, getPathParameter } from '../utils/event-parser';
import * as db from '../db/db-operations'
import { httpResponse } from '../utils/http/http-response';
import { HttpStatusCode } from 'axios';
import { Comment } from '../../model/comment';

const COMMENT_TABLE_NAME = process.env.POST_TABLE_NAME!;

export async function handler(event: any={}) : Promise <any> {
    const currentUserId = getAuthorizedUserId(event)
    const postId = getPathParameter(event, 'postId');
    const commentContent = event.body.content;

    const comment = new Comment(postId, currentUserId, commentContent);

    await db.add(COMMENT_TABLE_NAME, comment);
    return httpResponse(HttpStatusCode.Ok, `Post with id ${postId} successfully created`);
}
    