import {
  BaseEntity,
  type BaseEntityProps,
} from "@/modules/shared/domain/base.entity";

export interface SessionProps extends BaseEntityProps {
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}

export class Session extends BaseEntity<SessionProps> {
  private constructor(props: SessionProps) {
    super(props);
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  get userId(): string {
    return this.props.userId;
  }

  static create(props: SessionProps): Session {
    return new Session(props);
  }
}
