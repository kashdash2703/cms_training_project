import { useEffect, useState } from 'react';
import { cmsApi } from './api'; // FE asks BE for data through cmsApi
import type { Author, Article } from './types';

// Mode defines what action is the user currently doing?
// Why mode? - UI changes based on the selected user action
type Mode = 'none' | 'create' | 'update-author' | 'update-article' | 'delete';


export function App() {
  // Main backend data shown in the two lists.
  const [authors, setAuthors] = useState<Author[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // UI state: mode decides which panel is open; message shows feedback to the user.
  const [mode, setMode] = useState<Mode>('none');
  const [searchText, setSearchText] = useState('');
  const [message, setMessage] = useState('');

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
  const [authorForm, setAuthorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Controlled form state for the article form.
  const [articleForm, setArticleForm] = useState({
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

        {/* Search is controlled by React state, so searchText is always the input value. */}
        <div className="search-bar">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search authors or articles by keyword"
          />

          <button onClick={handleCommonSearch}>Search</button>

          <button
            className="secondary"
            onClick={async () => {
              setSearchText('');
              await loadInitialData();
            }}
          >
            Clear
          </button>
        </div>
      </header>

      <section className="toolbar">
        <button
          className={mode === 'create' ? 'active' : ''}
          onClick={openCreateMode}
        >
          Create
        </button>

        <button
          className={mode === 'delete' ? 'danger active' : 'danger'}
          onClick={openDeleteMode}
        >
          Delete
        </button>

        <button className="secondary" onClick={() => window.location.reload()}>
          Refresh
        </button>
      </section>

      {message && <p className="message">{message}</p>}

      {/* Create mode first asks whether the user wants to create an author or article. */}
      {mode === 'create' && (
        <section className="panel">
          <h2>Create</h2>

          <div className="choice-row">
            <label>
              <input
                type="checkbox"
                checked={showCreateAuthor}
                onChange={(event) => chooseCreateTarget('author', event.target.checked)}
              />
              Author
            </label>

            <label>
              <input
                type="checkbox"
                checked={showCreateArticle}
                onChange={(event) => chooseCreateTarget('article', event.target.checked)}
              />
              Article
            </label>
          </div>

          {!showCreateAuthor && !showCreateArticle && (
            <p className="helper-text">Select Author or Article to open a create form.</p>
          )}
        </section>
      )}

      {/* Render the Create Author form only when its checkbox is selected. */}
      {mode === 'create' && showCreateAuthor && (
        <section className="panel">
          <h2>Create Author</h2>

          <form onSubmit={handleCreateAuthor}>
            <input
              placeholder="First name"
              value={authorForm.firstName}
              onChange={(event) =>
                setAuthorForm({ ...authorForm, firstName: event.target.value })
              }
            />

            <input
              placeholder="Last name"
              value={authorForm.lastName}
              onChange={(event) =>
                setAuthorForm({ ...authorForm, lastName: event.target.value })
              }
            />

            <input
              placeholder="Email"
              value={authorForm.email}
              onChange={(event) =>
                setAuthorForm({ ...authorForm, email: event.target.value })
              }
            />

            <button type="submit">Create Author</button>
          </form>
        </section>
      )}

      {/* Render the Create Article form only when its checkbox is selected. */}
      {mode === 'create' && showCreateArticle && (
        <section className="panel">
          <h2>Create Article</h2>

          <form onSubmit={handleCreateArticle}>
            <input
              placeholder="Headline"
              value={articleForm.headline}
              onChange={(event) =>
                setArticleForm({ ...articleForm, headline: event.target.value })
              }
            />

            <textarea
              placeholder="Content"
              value={articleForm.content}
              onChange={(event) =>
                setArticleForm({ ...articleForm, content: event.target.value })
              }
            />

            <select
              value={articleForm.authorId}
              onChange={(event) =>
                setArticleForm({ ...articleForm, authorId: event.target.value })
              }
            >
              <option value="">Select existing author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.firstName} {author.lastName}
                </option>
              ))}
            </select>

            <button type="submit">Create Article</button>
          </form>
        </section>
      )}

      {/* Update panels are shown after clicking an Update button on a card. */}
      {mode === 'update-author' && editingAuthorId && (
        <section className="panel">
          <h2>Update Author</h2>

          <form onSubmit={handleUpdateAuthor}>
            <input
              value={authorForm.firstName}
              onChange={(event) =>
                setAuthorForm({ ...authorForm, firstName: event.target.value })
              }
            />

            <input
              value={authorForm.lastName}
              onChange={(event) =>
                setAuthorForm({ ...authorForm, lastName: event.target.value })
              }
            />

            <input
              value={authorForm.email}
              onChange={(event) =>
                setAuthorForm({ ...authorForm, email: event.target.value })
              }
            />

            <button type="submit">Save Author</button>
          </form>
        </section>
      )}

      {mode === 'update-article' && editingArticleId && (
        <section className="panel">
          <h2>Update Article</h2>

          <form onSubmit={handleUpdateArticle}>
            <input
              value={articleForm.headline}
              onChange={(event) =>
                setArticleForm({ ...articleForm, headline: event.target.value })
              }
            />

            <textarea
              value={articleForm.content}
              onChange={(event) =>
                setArticleForm({ ...articleForm, content: event.target.value })
              }
            />

            <button type="submit">Save Article</button>
          </form>
        </section>
      )}

      {/* Delete mode first asks whether the user wants to delete authors or articles. */}
      {mode === 'delete' && (
        <section className="panel">
          <h2>Delete</h2>

          <div className="choice-row">
            <label>
              <input
                type="checkbox"
                checked={showDeleteAuthors}
                onChange={(event) => chooseDeleteTarget('authors', event.target.checked)}
              />
              Authors
            </label>

            <label>
              <input
                type="checkbox"
                checked={showDeleteArticles}
                onChange={(event) => chooseDeleteTarget('articles', event.target.checked)}
              />
              Articles
            </label>
          </div>

          {!showDeleteAuthors && !showDeleteArticles && (
            <p className="helper-text">Select Authors or Articles to show delete checkboxes in the lists.</p>
          )}

          <div className="delete-actions">
            {showDeleteAuthors && (
              <button
                className="danger"
                disabled={selectedAuthorIds.length === 0}
                onClick={deleteSelectedAuthors}
              >
                Delete Selected Authors
              </button>
            )}

            {showDeleteArticles && (
              <button
                className="danger"
                disabled={selectedArticleIds.length === 0}
                onClick={deleteSelectedArticles}
              >
                Delete Selected Articles
              </button>
            )}
          </div>
        </section>
      )}

      {/* This detail panel appears after clicking an author card. */}
      {authorArticleView && (
        <section className="panel">
          <h2>
            Articles by {authorArticleView.author.firstName}{' '}
            {authorArticleView.author.lastName}
          </h2>

          {authorArticleView.articles.length === 0 && (
            <p className="empty">No articles found for this author.</p>
          )}

          {authorArticleView.articles.map((article) => (
            <article key={article.id} className="result-card">
              <h3>{article.headline}</h3>
              <p>{article.content}</p>
            </article>
          ))}
        </section>
      )}

      {/* Main content lists: articles on the left, authors on the right. */}
      <section className="content-grid">
        <section>
          <h2>Articles</h2>

          {articles.length === 0 && <p className="empty">No articles found.</p>}

          {articles.map((article) => (
            <article key={article.id} className="result-card">
              {/* Article delete checkbox appears only in Delete > Articles mode. */}
              {mode === 'delete' && showDeleteArticles && (
                <input
                  type="checkbox"
                  checked={selectedArticleIds.includes(article.id)}
                  onClick={(event) => event.stopPropagation()}
                  onChange={() => toggleArticleSelection(article.id)}
                />
              )}

              <h3>{article.headline}</h3>
              <p>{article.content}</p>

              <p className="meta">
                Author: {article.author.firstName} {article.author.lastName} ·{' '}
                {article.author.email}
              </p>

              <div className="card-actions">
                <button onClick={() => startUpdateArticle(article)}>
                  Update Article
                </button>
              </div>
            </article>
          ))}
        </section>

        <section>
          <h2>Authors</h2>

          {authors.length === 0 && <p className="empty">No authors found.</p>}

          {authors.map((author) => (
            // The whole author card is clickable so users can view that author's articles.
            <article
              key={author.id}
              className="result-card author-card clickable-card"
              role="button"
              tabIndex={0}
              onClick={() => showArticlesByAuthor(author)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) {
                  return;
                }

                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  showArticlesByAuthor(author);
                }
              }}
            >
              {/* Author delete checkbox appears only in Delete > Authors mode. */}
              {mode === 'delete' && showDeleteAuthors && (
                <input
                  type="checkbox"
                  checked={selectedAuthorIds.includes(author.id)}
                  onClick={(event) => event.stopPropagation()}
                  onChange={() => toggleAuthorSelection(author.id)}
                />
              )}

              <h3>
                {author.firstName} {author.lastName}
              </h3>

              <p>{author.email}</p>

              <div className="card-actions">
                <button
                  onClick={(event) => {
                    // Prevents the button click from also triggering the author card click.
                    event.stopPropagation();
                    startUpdateAuthor(author);
                  }}
                >
                  Update Author
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
