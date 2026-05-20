export type Article = {
  id: string;
  headline: string;
  text: string;
  authorId: string;
};

export type CreateArticleInput = {
  headline: string;
  text: string;
  authorId: string;
};

export type UpdateArticleInput = {
  headline?: string;
  text?: string;
  authorId?: string;
};

const articles: Article[] = [];

export class ArticleService {
  createArticle(input: CreateArticleInput): Article {
    const newArticle: Article = {
      id: crypto.randomUUID(),
      headline: input.headline,
      text: input.text,
      authorId: input.authorId,
    };
    articles.push(newArticle);
    return newArticle;
  }

  getArticleById(id: string): Article | undefined {
    return articles.find((article) => article.id === id);
  }

  updateArticleById(id: string, input: UpdateArticleInput): Article | undefined {
    const article = articles.find((article) => article.id === id);

    if (!article) {
      return undefined;
    }

    if (input.headline !== undefined) {
      article.headline = input.headline;
    }

    if (input.text !== undefined) {
      article.text = input.text;
    }

    if (input.authorId !== undefined) {
      article.authorId = input.authorId;
    }
    return article;
  }

  searchArticles(searchText: string): Article[] {
    const lowerSearchText = searchText.toLowerCase();

    return articles.filter((article) => {
      return (
        article.headline.toLowerCase().includes(lowerSearchText) ||
        article.text.toLowerCase().includes(lowerSearchText) ||
        article.authorId.toLowerCase().includes(lowerSearchText)
      );
    });
  }

  getAllArticles(): Article[] {
    return articles;
  }
}