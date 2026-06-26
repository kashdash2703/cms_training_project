import { useEffect, useState } from 'react';
import { cmsApi } from './api/cms.api';
import { ArticleList } from './components/ArticleList';
import { AuthorArticleView } from './components/AuthorArticleView';
import { AuthorList } from './components/AuthorList';
import { CreateArticleForm } from './components/CreateArticleForm';
import { CreateAuthorForm } from './components/CreateAuthorForm';
import { CreatePanel } from './components/CreatePanel';
import { DeletePanel } from './components/DeletePanel';
import { SearchBar } from './components/SearchBar';
import { Toolbar } from './components/Toolbar';
import { UpdateArticleForm } from './components/UpdateArticleForm';
import { UpdateAuthorForm } from './components/UpdateAuthorForm';
import type {
  Article,
  ArticleFormState,
  Author,
  AuthorFormState,
  Mode,
} from './types';

export function App() {
  // Main backend data shown in the two lists.
  const [authors, setAuthors] = useState<Author[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // UI state: mode decides which panel is open; message shows feedback to the user.
  const [mode, setMode] = useState<Mode>('none');
  const [searchText, setSearchText] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Stores IDs selected by delete checkboxes.
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);

  // These booleans control which create/delete sub-form is visible.
  // The handlers below make Author and Article mutually exclusive.
  const [showCreateAuthor, setShowCreateAuthor] = useState(false);
  const [showCreateArticle, setShowCreateArticle] = useState(false);
  const [showDeleteAuthors, setShowDeleteAuthors] = useState(false);
  const [showDeleteArticles, setShowDeleteArticles] = useState(false);

  // Holds the selected author's articles when an author card is clicked.
  const [authorArticleView, setAuthorArticleView] = useState<{
    author: Author;
    articles: Article[];
  } | null>(null);

  // Controlled form state for the author form.
  const [authorForm, setAuthorForm] = useState<AuthorFormState>({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Controlled form state for the article form.
  const [articleForm, setArticleForm] = useState<ArticleFormState>({
    headline: '',
    content: '',
    authorId: '',
  });

  // Empty means no record is currently being edited.
  const [editingAuthorId, setEditingAuthorId] = useState('');
  const [editingArticleId, setEditingArticleId] = useState('');

  // Load authors and articles once when the component first appears.
  useEffect(() => {
    loadInitialData();
  }, []);

  // Shared reload function used after create, update, delete, clear, and first page load.
  async function loadInitialData() {
    setIsLoading(true);

    try {
      // Promise.all runs both backend requests at the same time.
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

  // Searches authors and articles together using one search box.
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

  // Form submit handler for creating an author.
  async function handleCreateAuthor(event: React.SubmitEvent<HTMLFormElement>) {
    // Prevents the browser's default full-page form submission.
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

  // Form submit handler for creating an article with an existing author.
  async function handleCreateArticle(event: React.SubmitEvent<HTMLFormElement>) {
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

  // Opens create mode and clears delete/update selections so modes do not overlap.
  function openCreateMode() {
    setMode('create');
    setEditingAuthorId('');
    setEditingArticleId('');
    setShowDeleteAuthors(false);
    setShowDeleteArticles(false);
    setSelectedAuthorIds([]);
    setSelectedArticleIds([]);
  }

  // Opens delete mode and clears create/update state.
  function openDeleteMode() {
    setMode('delete');
    setEditingAuthorId('');
    setEditingArticleId('');
    setShowCreateAuthor(false);
    setShowCreateArticle(false);
  }

  // Keeps create target mutually exclusive: choose Author or Article, not both.
  function chooseCreateTarget(target: 'author' | 'article', checked: boolean) {
    setShowCreateAuthor(target === 'author' ? checked : false);
    setShowCreateArticle(target === 'article' ? checked : false);
  }

  // Keeps delete target mutually exclusive and clears old selected IDs when switching.
  function chooseDeleteTarget(target: 'authors' | 'articles', checked: boolean) {
    setShowDeleteAuthors(target === 'authors' ? checked : false);
    setShowDeleteArticles(target === 'articles' ? checked : false);
    setSelectedAuthorIds([]);
    setSelectedArticleIds([]);
  }

  // Opens the author update form and pre-fills it with the selected author's values.
  function startUpdateAuthor(author: Author) {
    setMode('update-author');
    setShowCreateAuthor(false);
    setShowCreateArticle(false);
    setShowDeleteAuthors(false);
    setShowDeleteArticles(false);
    setSelectedAuthorIds([]);
    setSelectedArticleIds([]);
    setEditingAuthorId(author.id);
    setAuthorForm({
      firstName: author.firstName,
      lastName: author.lastName,
      email: author.email,
    });
  }

  // Opens the article update form and pre-fills it with the selected article's values.
  function startUpdateArticle(article: Article) {
    setMode('update-article');
    setShowCreateAuthor(false);
    setShowCreateArticle(false);
    setShowDeleteAuthors(false);
    setShowDeleteArticles(false);
    setSelectedAuthorIds([]);
    setSelectedArticleIds([]);
    setEditingArticleId(article.id);
    setArticleForm({
      headline: article.headline,
      content: article.content,
      authorId: article.author.id,
    });
  }

  // Sends the edited author fields to the backend.
  async function handleUpdateAuthor(event: React.FormEvent) {
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

  // Sends the edited article fields to the backend.
  async function handleUpdateArticle(event: React.FormEvent) {
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

  // Adds/removes an author ID from the selected delete list.
  function toggleAuthorSelection(id: string) {
    setSelectedAuthorIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((authorId) => authorId !== id)
        : [...currentIds, id]
    );
  }

  // Adds/removes an article ID from the selected delete list.
  function toggleArticleSelection(id: string) {
    setSelectedArticleIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((articleId) => articleId !== id)
        : [...currentIds, id]
    );
  }

  // Clicking an author loads a focused list of articles written by that author.
  async function showArticlesByAuthor(author: Author) {
    try {
      const result = await cmsApi.getArticlesByAuthorId(author.id);
      setAuthorArticleView(result);
      setMessage(`Showing articles by ${author.firstName} ${author.lastName}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load author articles');
    }
  }

  // Deletes every selected author, then refreshes the main data lists.
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

  // Deletes every selected article, then refreshes the main data lists.
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

  return (
    <main className="page">
      <header className="hero">
        <h1>CMS Engine</h1>

        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearch={handleCommonSearch}
          onClear={async () => {
            setSearchText('');
            await loadInitialData();
          }}
        />
      </header>

      <Toolbar
        mode={mode}
        onCreate={openCreateMode}
        onDelete={openDeleteMode}
        onRefresh={() => window.location.reload()}
      />

      {message && <p className="message">{message}</p>}
      {isLoading && <p className="message">Loading...</p>}

      {mode === 'create' && (
        <CreatePanel
          showCreateAuthor={showCreateAuthor}
          showCreateArticle={showCreateArticle}
          onChooseTarget={chooseCreateTarget}
        />
      )}

      {mode === 'create' && showCreateAuthor && (
        <CreateAuthorForm
          authorForm={authorForm}
          onAuthorFormChange={setAuthorForm}
          onSubmit={handleCreateAuthor}
        />
      )}

      {mode === 'create' && showCreateArticle && (
        <CreateArticleForm
          authors={authors}
          articleForm={articleForm}
          onArticleFormChange={setArticleForm}
          onSubmit={handleCreateArticle}
        />
      )}

      {mode === 'update-author' && editingAuthorId && (
        <UpdateAuthorForm
          authorForm={authorForm}
          onAuthorFormChange={setAuthorForm}
          onSubmit={handleUpdateAuthor}
        />
      )}

      {mode === 'update-article' && editingArticleId && (
        <UpdateArticleForm
          articleForm={articleForm}
          onArticleFormChange={setArticleForm}
          onSubmit={handleUpdateArticle}
        />
      )}

      {mode === 'delete' && (
        <DeletePanel
          showDeleteAuthors={showDeleteAuthors}
          showDeleteArticles={showDeleteArticles}
          selectedAuthorCount={selectedAuthorIds.length}
          selectedArticleCount={selectedArticleIds.length}
          onChooseTarget={chooseDeleteTarget}
          onDeleteAuthors={deleteSelectedAuthors}
          onDeleteArticles={deleteSelectedArticles}
        />
      )}

      {authorArticleView && (
        <AuthorArticleView
          author={authorArticleView.author}
          articles={authorArticleView.articles}
        />
      )}

      <section className="content-grid">
        <ArticleList
          articles={articles}
          mode={mode}
          showDeleteArticles={showDeleteArticles}
          selectedArticleIds={selectedArticleIds}
          onToggleArticleSelection={toggleArticleSelection}
          onStartUpdateArticle={startUpdateArticle}
        />

        <AuthorList
          authors={authors}
          mode={mode}
          showDeleteAuthors={showDeleteAuthors}
          selectedAuthorIds={selectedAuthorIds}
          onToggleAuthorSelection={toggleAuthorSelection}
          onStartUpdateAuthor={startUpdateAuthor}
          onShowArticlesByAuthor={showArticlesByAuthor}
        />
      </section>
    </main>
  );
}
