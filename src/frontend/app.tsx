import { useEffect, useState } from 'react';
import { cmsApi } from './api'; // FE asks BE for data through cmsApi
import type { Author, Article } from './types';

// Mode defines what action is the user currently doing?
// Why mode? - UI changes based on the selected user action
type Mode = 'none' | 'create' | 'update-author' | 'update-article' | 'delete';


export function App() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const [mode, setMode] = useState<Mode>('none');
  const [searchText, setSearchText] = useState('');
  const [message, setMessage] = useState('');

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

  const [authorForm, setAuthorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [articleForm, setArticleForm] = useState({
    headline: '',
    content: '',
    authorId: '',
  });

  const [editingAuthorId, setEditingAuthorId] = useState('');
  const [editingArticleId, setEditingArticleId] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
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
    }
  }

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

  async function handleCreateAuthor(event: React.SubmitEvent<HTMLFormElement>) {
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

  function openCreateMode() {
    setMode('create');
    setEditingAuthorId('');
    setEditingArticleId('');
    setShowDeleteAuthors(false);
    setShowDeleteArticles(false);
    setSelectedAuthorIds([]);
    setSelectedArticleIds([]);
  }

  function openDeleteMode() {
    setMode('delete');
    setEditingAuthorId('');
    setEditingArticleId('');
    setShowCreateAuthor(false);
    setShowCreateArticle(false);
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

  return (
    <main className="page">
      <header className="hero">
        <h1>CMS Engine</h1>

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

      <section className="content-grid">
        <section>
          <h2>Articles</h2>

          {articles.length === 0 && <p className="empty">No articles found.</p>}

          {articles.map((article) => (
            <article key={article.id} className="result-card">
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
