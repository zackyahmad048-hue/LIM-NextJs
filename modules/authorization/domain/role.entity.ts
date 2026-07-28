import { BaseEntity, type BaseEntityProps } from "@/modules/shared/domain/base.entity";

export interface RoleProps extends BaseEntityProps {
  name: string;
  slug: string;
  description: string | null;
}

export class Role extends BaseEntity<RoleProps> {
  private constructor(props: RoleProps) {
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

  static create(props: RoleProps): Role {
    return new Role(props);
  }
}
