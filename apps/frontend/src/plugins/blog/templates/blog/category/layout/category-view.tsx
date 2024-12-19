import { ArticlesBlogObj } from 'shared/blog/articles';

import { ItemArticleBlog } from '../../item';

export const CategoryBlogView = ({
  edges,
}: {
  edges: ArticlesBlogObj['edges'];
}) => {
  return (
    <>
      {edges.map(edge => (
        <ItemArticleBlog key={edge.id} {...edge} />
      ))}
    </>
  );
};
