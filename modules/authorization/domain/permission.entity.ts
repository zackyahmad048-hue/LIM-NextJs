import {
  BaseEntity,
  type BaseEntityProps,
} from "@/modules/shared/domain/base.entity";

export interface PermissionProps extends BaseEntityProps {
  name: string;
  slug: string;
  description: string | null;
}

export class Permission extends BaseEntity<PermissionProps> {
  private constructor(props: PermissionProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string | null {
    return this.props.description;
  }

  static create(props: PermissionProps): Permission {
    return new Permission(props);
  }
}
