import { v4 as uuid } from 'uuid';
import { AuditableEntity } from './auditable-entity';

export class BaseEntity extends AuditableEntity {
  public id: string;

  constructor() {
    super();
    this.id = uuid();
  }
}
