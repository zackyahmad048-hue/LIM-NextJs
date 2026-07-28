export interface BaseEntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseEntity<T extends BaseEntityProps> {
  protected props: T;

  constructor(props: T) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  equals(other: BaseEntity<T>): boolean {
    if (other === null || other === undefined) return false;
    if (this === other) return true;
    return this.id === other.id;
  }
}
