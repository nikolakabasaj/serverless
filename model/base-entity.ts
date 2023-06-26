import { AuditableEntity } from "./auditable-entity";
import { v4 as uuid } from 'uuid';

export class BaseEntity extends AuditableEntity {
    public id: string;

    constructor() {
        super();
        this.id = uuid();
    }
}