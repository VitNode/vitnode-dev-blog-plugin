import { CategoryBlogView } from './category/layout/category-view';
import { LayoutCategoryBlog } from './category/layout/layout';
import { getArticlesData } from './get-articles-data';

export const BlogView = async () => {
  const { edges, categories } = await getArticlesData({});

  return (
    <LayoutCategoryBlog categories={categories} count={edges.length}>
      <CategoryBlogView edges={edges} />
    </LayoutCategoryBlog>
  );
};
