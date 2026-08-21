import {
  BaseEntity,
  type BaseEntityProps,
} from "@/modules/shared/domain/base.entity";

export interface PostProps extends BaseEntityProps {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;
  published: boolean;
  publishedAt: Date | null;
  categoryId: string;
  authorId: string;
}

export class Post extends BaseEntity<PostProps> {
  private constructor(props: PostProps) {
    super(props);
  }

  get title(): string {
    return this.props.title;
  }

  get slug(): string {
    return this.props.slug;
  }

  get excerpt(): string | null {
    return this.props.excerpt;
  }

  get content(): string {
    return this.props.content;
  }

  get thumbnail(): string | null {
    return this.props.thumbnail;
  }

  get published(): boolean {
    return this.props.published;
  }

  get publishedAt(): Date | null {
    return this.props.publishedAt;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  static create(props: PostProps): Post {
    return new Post(props);
  }
}
