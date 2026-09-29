// CMS Module — barrel exports

// Domain
export { Category } from "./domain/category.entity";
export { Post } from "./domain/post.entity";

// Application
export { CategoryService } from "./application/category.service";
export { PostService } from "./application/post.service";

// Infrastructure (low-level repository functions - prefixed to avoid collisions with actions)
export {
  countPostsAll as repoCountPostsAll,
  countPostsPublished as repoCountPostsPublished,
  countPostsDraft as repoCountPostsDraft,
  countPostsByCategory as repoCountPostsByCategory,
  findRecentPosts as repoFindRecentPosts,
  findPublishedPostsByCategorySlug as repoFindPublishedPostsByCategorySlug,
  findPublishedPostBySlug as repoFindPublishedPostBySlug,
  findPostById as repoFindPostById,
  findPaginatedPosts as repoFindPaginatedPosts,
  checkPostSlugTaken as repoCheckPostSlugTaken,
  createPost as repoCreatePost,
  updatePost as repoUpdatePost,
  publishPost as repoPublishPost,
  archivePost as repoArchivePost,
  restorePostToDraft as repoRestorePostToDraft,
  softDeletePost as repoSoftDeletePost,
  countCategoriesAll as repoCountCategoriesAll,
  findCategories as repoFindCategories,
  findCategoryById as repoFindCategoryById,
  findCategoryBySlug as repoFindCategoryBySlug,
  checkCategorySlugTaken as repoCheckCategorySlugTaken,
  checkCategoryNameTaken as repoCheckCategoryNameTaken,
  createCategory as repoCreateCategory,
  updateCategory as repoUpdateCategory,
  softDeleteCategory as repoSoftDeleteCategory,
} from "./infrastructure/post.repository";

// Presentation (server actions)
export {
  createCategory,
  updateCategory,
  deleteCategory,
} from "./presentation/category.action";
export {
  createPost,
  updatePost,
  publishPost,
  archivePost,
  restorePostToDraft,
  deletePost,
} from "./presentation/post.action";
export { saveStructureAction } from "./presentation/structure.action";

// Queries
export { getCategories } from "./queries/category.query";
export {
  getRecentPosts,
  getPaginatedPosts,
  getPublishedPostsByCategorySlug,
  getPublishedPostBySlug,
} from "./queries/post.query";
export { getHeroConfig } from "./queries/hero.query";
export { getContentSummary } from "./queries/content.query";
export {
  getSitePageValues,
  getSitePageStatuses,
  getAboutContent,
  getProfilContent,
  getTentangContent,
  getVisiMisiContent,
  getFalakContent,
  getKontakContent,
  getTimWajibKhidmahContent,
} from "./queries/site-page.query";

// Validators
export { categorySchema } from "./validations/category.schema";
export type { CategoryInput } from "./validations/category.schema";
export { postIdSchema, postSchema } from "./validations/post.schema";
export type { PostInput } from "./validations/post.schema";
