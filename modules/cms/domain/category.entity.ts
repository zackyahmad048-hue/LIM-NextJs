import { BaseEntity, type BaseEntityProps } from "@/modules/shared/domain/base.entity";

export interface CategoryProps extends BaseEntityProps {
  name: string;
  slug: string;
  description: string | null;
  deletedAt: Date | null;
}

export class Category extends BaseEntity<CategoryProps> {
  private constructor(props: CategoryProps) {
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

  get isDeleted(): boolean {
    return this.props.deletedAt !== null;
  }

  static create(props: CategoryProps): Category {
    return new Category(props);
  }
}
