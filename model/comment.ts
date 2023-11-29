import { BaseEntity } from './base-entity';

export class Comment extends BaseEntity {
  private postId: string;

  private userId: string;

  private content: string;

  constructor(postId: string, userId: string, content: string) {
    super();
    this.postId = postId;
    this.userId = userId;
    this.content = content;
  }
}
