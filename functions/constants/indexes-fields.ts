// TODO
class FieldsExtractor {
  public getKeys(): (keyof FieldsExtractor)[] {
    const keys: (keyof FieldsExtractor)[] = [];
    for (const key in this) {
      keys.push(key as keyof FieldsExtractor);
    }
    return keys;
  }
}

export class FollowedIdIndexFields {
  followedId: string;

  constructor(followedId: string) {
    this.followedId = followedId;
  }
}

export class FollowerIdIndexFields {
  followerId: string;

  constructor(followerId: string) {
    this.followerId = followerId;
  }
}

export class FollowerAndFollowedIdIndexFiels extends FieldsExtractor {
  followerId: string;

  followedId: string;

  constructor(followerId: string, followedId: string) {
    super();
    this.followerId = followerId;
    this.followedId = followedId;
  }
}

export class PostUserIdIndexFields {
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
