import { BaseEntity } from "./base-entity";

export class Follow extends BaseEntity {
    public followerId: string;
    public followedId: string;
    public status: FollowStatus

    constructor(followerId: string, followedId: string) {
        super();
        this.followerId = followerId;
        this.followedId = followedId;
        this.status = FollowStatus.Active;
    }

    public setStatus(status: FollowStatus) {
        this.status = status;
    }

    public getFollowerId() {
        return this.followerId;
    }

    public getFollowedId() {
        return this.followedId;
    }

    public getStatus() {
        return this.status;
    }
}

export enum FollowStatus {
    Active,
    Block,
    Unfollowed,
    Muted
}