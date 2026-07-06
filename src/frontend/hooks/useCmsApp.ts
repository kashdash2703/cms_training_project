import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { cmsApi } from '../api/cms.api';
import type {
  Article,
  ArticleFormState,
  Author,
  AuthorFormState,
  Mode,
} from '../types';

export function useCmsApp() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [mode, setMode] = useState<Mode>('none');
  const [searchText, setSearchText] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [showCreateAuthor, setShowCreateAuthor] = useState(false);
  const [showCreateArticle, setShowCreateArticle] = useState(false);
  const [showDeleteAuthors, setShowDeleteAuthors] = useState(false);
  const [showDeleteArticles, setShowDeleteArticles] = useState(false);
  const [authorArticleView, setAuthorArticleView] = useState<{
    author: Author;
    articles: Article[];
  } | null>(null);
  const [authorForm, setAuthorForm] = useState<AuthorFormState>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [articleForm, setArticleForm] = useState<ArticleFormState>({
    headline: '',
    content: '',
    authorId: '',
  });
  const [editingAuthorId, setEditingAuthorId] = useState('');
  const [editingArticleId, setEditingArticleId] = useState('');

  function resetModeState() {
    setShowCreateAuthor(false);
    setShowCreateArticle(false);
    setShowDeleteAuthors(false);
    setShowDeleteArticles(false);
    setSelectedAuthorIds([]);
    setSelectedArticleIds([]);
    setEditingAuthorId('');
    setEditingArticleId('');
  }

  async function loadInitialData() {
    setIsLoading(true);

    try {
      const [authorsData, articlesData] = await Promise.all([
        cmsApi.getAuthors(),
        cmsApi.getArticles(),
      ]);

      setAuthors(authorsData);
      setArticles(articlesData);
      setAuthorArticleView(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  async function handleCommonSearch() {
    if (searchText.trim() === '') {
      await loadInitialData();
      return;
    }

    try {
      const [authorResults, articleResults] = await Promise.all([
        cmsApi.searchAuthors(searchText),
        cmsApi.searchArticles(searchText),
      ]);

      setAuthors(authorResults);
      setArticles(articleResults);
      setAuthorArticleView(null);
      setMessage(`Search completed for "${searchText}"`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Search failed');
    }
  }

  async function handleCreateAuthor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await cmsApi.createAuthor(authorForm);
      setAuthorForm({ firstName: '', lastName: '', email: '' });
      setMessage('Author created successfully');
      await loadInitialData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Author creation failed');
    }
  }

  async function handleCreateArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await cmsApi.createArticleWithExistingAuthor(articleForm);
      setArticleForm({ headline: '', content: '', authorId: '' });
      setMessage('Article created successfully');
      await loadInitialData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Article creation failed');
    }
  }

  function openCreateMode() {
    resetModeState();
    setMode('create');
  }

  function openDeleteMode() {
    resetModeState();
    setMode('delete');
  }

  function chooseCreateTarget(target: 'author' | 'article', checked: boolean) {
    setShowCreateAuthor(target === 'author' ? checked : false);
    setShowCreateArticle(target === 'article' ? checked : false);
  }

  function chooseDeleteTarget(target: 'authors' | 'articles', checked: boolean) {
    setShowDeleteAuthors(target === 'authors' ? checked : false);
    setShowDeleteArticles(target === 'articles' ? checked : false);
    setSelectedAuthorIds([]);
    setSelectedArticleIds([]);
  }

  function startUpdateAuthor(author: Author) {
    resetModeState();
    setMode('update-author');
    setEditingAuthorId(author.id);
    setAuthorForm({
      firstName: author.firstName,
      lastName: author.lastName,
      email: author.email,
    });
  }

  function startUpdateArticle(article: Article) {
    resetModeState();
    setMode('update-article');
    setEditingArticleId(article.id);
    setArticleForm({
      headline: article.headline,
      content: article.content,
      authorId: article.author.id,
    });
  }

  async function handleUpdateAuthor(event: FormEvent) {
    event.preventDefault();

    try {
      await cmsApi.updateAuthor(editingAuthorId, authorForm);
      setMessage('Author updated successfully');
      setEditingAuthorId('');
      setMode('none');
      await loadInitialData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Author update failed');
    }
  }

  async function handleUpdateArticle(event: FormEvent) {
    event.preventDefault();

    try {
      await cmsApi.updateArticle(editingArticleId, {
        headline: articleForm.headline,
        content: articleForm.content,
      });

      setMessage('Article updated successfully');
      setEditingArticleId('');
      setMode('none');
      await loadInitialData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Article update failed');
    }
  }

  function toggleAuthorSelection(id: string) {
    setSelectedAuthorIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((authorId) => authorId !== id)
        : [...currentIds, id]
    );
  }

  function toggleArticleSelection(id: string) {
    setSelectedArticleIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((articleId) => articleId !== id)
        : [...currentIds, id]
    );
  }

  async function showArticlesByAuthor(author: Author) {
    try {
      const result = await cmsApi.getArticlesByAuthorId(author.id);
      setAuthorArticleView(result);
      setMessage(`Showing articles by ${author.firstName} ${author.lastName}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load author articles');
    }
  }

  async function deleteSelectedAuthors() {
    try {
      await Promise.all(selectedAuthorIds.map((id) => cmsApi.deleteAuthor(id)));
      setSelectedAuthorIds([]);
      setShowDeleteAuthors(false);
      setMessage('Selected authors deleted successfully');
      await loadInitialData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Author deletion failed');
    }
  }

  async function deleteSelectedArticles() {
    try {
      await Promise.all(selectedArticleIds.map((id) => cmsApi.deleteArticle(id)));
      setSelectedArticleIds([]);
      setShowDeleteArticles(false);
      setMessage('Selected articles deleted successfully');
      await loadInitialData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Article deletion failed');
    }
  }

  return {
    articleForm,
    articles,
    authorArticleView,
    authorForm,
    authors,
    chooseCreateTarget,
    chooseDeleteTarget,
    deleteSelectedArticles,
    deleteSelectedAuthors,
    editingArticleId,
    editingAuthorId,
    handleCommonSearch,
    handleCreateArticle,
    handleCreateAuthor,
    handleUpdateArticle,
    handleUpdateAuthor,
    isLoading,
    loadInitialData,
    message,
    mode,
    openCreateMode,
    openDeleteMode,
    searchText,
    selectedArticleIds,
    selectedAuthorIds,
    setArticleForm,
    setAuthorForm,
    setSearchText,
    showArticlesByAuthor,
    showCreateArticle,
    showCreateAuthor,
    showDeleteArticles,
    showDeleteAuthors,
    startUpdateArticle,
    startUpdateAuthor,
    toggleArticleSelection,
    toggleAuthorSelection,
  };
}
