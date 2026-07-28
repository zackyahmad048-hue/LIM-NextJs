// CMS Module — barrel exports

// Domain
export { Category } from "./domain/category.entity";
export { Post } from "./domain/post.entity";

// Application
export { CategoryService } from "./application/category.service";
export { PostService } from "./application/post.service";

// Infrastructure
export { PrismaCategoryRepository, categoryRepository } from "./infrastructure/category.repository";
export { PrismaPostRepository, postRepository } from "./infrastructure/post.repository";

// Presentation
export { createCategory, updateCategory, deleteCategory } from "./presentation/category.action";
export { createPost, updatePost, publishPost, archivePost, restorePostToDraft, deletePost } from "./presentation/post.action";

// Queries
export { getCategories } from "./queries/category.query";
export { getRecentPosts, getPaginatedPosts } from "./queries/post.query";
export { getHeroConfig } from "./queries/hero.query";
export { getContentSummary } from "./queries/content.query";
export { getPages, getPage, savePage } from "./queries/page.query";

// Validators
export { categorySchema } from "./validations/category.schema";
export type { CategoryInput } from "./validations/category.schema";
export { postIdSchema, postSchema } from "./validations/post.schema";
export type { PostInput } from "./validations/post.schema";
