import { BaseEntity, type BaseEntityProps } from "@/modules/shared/domain/base.entity";

export interface UserProps extends BaseEntityProps {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
}

export class User extends BaseEntity<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get image(): string | null {
    return this.props.image;
  }

  get isVerified(): boolean {
    return this.props.emailVerified;
  }

  static create(props: UserProps): User {
    return new User(props);
  }
}
