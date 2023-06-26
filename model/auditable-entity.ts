export class AuditableEntity {
    public createdAt: string;

    constructor() {
        this.createdAt = new Date().toISOString();
    }
}