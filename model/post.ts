import { BaseEntity } from './base-entity';

export class Post extends BaseEntity {
  public userId: string;

  private imageLocation: any;

  public likes: number;

  private dislikes: number;

  private description: string;

  private comments: string[];

  constructor(userId: string, description: string, imageLocation?: any) {
    super();
    this.userId = userId;
    this.imageLocation = imageLocation;
    this.likes = 0;
    this.dislikes = 0;
    this.description = description;
    this.comments = [];
  }

  public getImageKey() {
    return `post/${Date.now().toString()}#${this.id}`;
  }

  public getUserId() {
    return this.userId;
  }

  public setImageLocation(imageLocation: any) {
    this.imageLocation = imageLocation;
  }

  public likePost() {
    this.likes++;
  }
}
