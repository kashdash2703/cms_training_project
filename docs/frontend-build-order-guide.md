# Frontend Build Order Guide

This guide explains how a developer would build this frontend step by step and connect it to the backend.

It is not ordered by file line number. It is ordered by how developers usually think:

1. Make the browser show something.
2. Add data shapes.
3. Add backend communication.
4. Load real data.
5. Add user actions one by one.
6. Improve styling and behavior.

## Step 1: Start With The HTML Mount Point

File: `index.html`

The first thing the frontend needs is a place where React can appear.

Write this early:

```html
<div id="root"></div>
<script type="module" src="./main.tsx"></script>
```

Why this comes first:

- The browser needs an HTML page.
- React needs an empty container.
- `main.tsx` is the file that starts the React app.

At this point, the page is still blank. That is okay.

## Step 2: Create The React Entry File

File: `src/frontend/main.tsx`

Next, connect React to the HTML `root`.

Write imports first:

```ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { App } from './app';
```

Then write the render code:

```tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Why this comes before the real app:

- It proves React can mount.
- It tells the browser: put `<App />` inside `<div id="root">`.

Developer thought process:

```text
I need React to appear in the browser before I build features.
```

## Step 3: Create A Tiny App First

File: `src/frontend/app.tsx`

Before writing forms, API calls, search, or delete, start with the smallest possible app:

```tsx
export function App() {
  return (
    <main>
      <h1>CMS Engine</h1>
    </main>
  );
}
```

Run the frontend and check:

```bash
pnpm run dev:frontend
```

Open:

```text
http://localhost:5173/
```

If you see `CMS Engine`, the foundation works.

## Step 4: Add Basic Page Layout

File: `src/frontend/app.tsx`

Now add the visible page structure:

```tsx
<main className="page">
  <header className="hero">
    <h1>CMS Engine</h1>
  </header>
</main>
```

Then add the search bar:

```tsx
<div className="search-bar">
  <input placeholder="Search authors or articles by keyword" />
  <button>Search</button>
  <button className="secondary">Clear</button>
</div>
```

At this stage, the buttons do not need to work yet.

Developer thought process:

```text
First I place the UI skeleton. Then I make it interactive.
```

## Step 5: Add CSS For The Basic Page

File: `src/frontend/style.css`

Start with global styles:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f8fafc;
  color: #1f2937;
}
```

Then style common controls:

```css
button,
select,
input,
textarea {
  font: inherit;
}
```

Then buttons:

```css
button {
  border: none;
  background: #2563eb;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}
```

Then layout classes:

```css
.page
.hero
.search-bar
.toolbar
.panel
.content-grid
.result-card
```

Why CSS comes early:

- It makes it easier to see whether the UI structure is correct.
- You do not need perfect styling yet, just readable layout.

## Step 6: Define The Data Shapes

File: `src/frontend/types/index.ts`

Before calling the backend, define what data the frontend expects.

Start with `Author`:

```ts
export type Author = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};
```

Then `Article`:

```ts
export type Article = {
  id: string;
  headline: string;
  content: string;
  author: Author;
};
```

Then search responses:

```ts
export type AuthorSearchResponse = {
  totalSearchResults: number;
  results: {
    author: Author;
  }[];
};
```

```ts
export type ArticleSearchResponse = {
  totalSearchResults: number;
  results: {
    article: Article;
  }[];
};
```

Then articles-by-author response:

```ts
export type ArticlesByAuthorResponse = {
  author: Author;
  articles: Article[];
};
```

Developer thought process:

```text
Before I fetch data, I want TypeScript to know what that data looks like.
```

## Step 7: Create The API Helper

File: `src/frontend/api/cms.api.ts`

Now write the code that talks to the backend.

Start with imports:

```ts
import type {
  Author,
  Article,
  AuthorSearchResponse,
  ArticleSearchResponse,
  ArticlesByAuthorResponse,
} from './types';
```

Then define the base path:

```ts
const API_BASE = '/api';
```

Why `/api`?

The browser calls:

```text
http://localhost:5173/api/authors
```

Vite forwards it to:

```text
http://localhost:3000/authors
```

## Step 8: Write One Reusable Request Function

File: `src/frontend/api/cms.api.ts`

Instead of writing `fetch` again and again, create one helper:

```ts
async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
```

Then create headers:

```ts
const headers = new Headers(options?.headers);

if (options?.body !== undefined && !headers.has('Content-Type')) {
  headers.set('Content-Type', 'application/json');
}
```

Important beginner note:

- `POST` and `PUT` usually send JSON bodies.
- `DELETE` usually does not send a body.
- So we only add `Content-Type: application/json` when a body exists.

Then make the request:

```ts
response = await fetch(`${API_BASE}${url}`, {
  ...options,
  headers,
});
```

Then handle errors:

```ts
if (!response.ok) {
  const errorBody = await response.json().catch(() => null);
  const message =
    errorBody?.message ||
    (response.status >= 500
      ? 'Backend request failed. Start the backend server and refresh.'
      : 'Something went wrong');
  throw new Error(message);
}
```

Then return JSON:

```ts
return response.json() as Promise<T>;
```

Developer thought process:

```text
All backend calls should behave consistently.
```

## Step 9: Add API Methods One By One

File: `src/frontend/api/cms.api.ts`

Start with read-only methods first because they are safer.

```ts
getAuthors(): Promise<Author[]> {
  return request<Author[]>('/authors');
}
```

```ts
getArticles(): Promise<Article[]> {
  return request<Article[]>('/articles');
}
```

Then add search:

```ts
searchAuthors(q: string): Promise<Author[]>
searchArticles(q: string): Promise<Article[]>
```

Then add detail view:

```ts
getArticlesByAuthorId(id: string): Promise<ArticlesByAuthorResponse> {
  return request<ArticlesByAuthorResponse>(`/articles/author/${id}`);
}
```

Then add create:

```ts
createAuthor(...)
createArticleWithExistingAuthor(...)
```

Then update:

```ts
updateAuthor(...)
updateArticle(...)
```

Then delete last:

```ts
deleteAuthor(...)
deleteArticle(...)
```

Why delete last?

Delete changes real data. Developers usually build and test safer actions first.

## Step 10: Add State To The App

File: `src/frontend/app.tsx`

Now return to `App`.

Import hooks:

```ts
import { useEffect, useState } from 'react';
```

Import API:

```ts
import { cmsApi } from './api/cms.api';
```

Import types:

```ts
import type { Author, Article } from './types';
```

Then add the main data state:

```ts
const [authors, setAuthors] = useState<Author[]>([]);
const [articles, setArticles] = useState<Article[]>([]);
```

Then UI state:

```ts
const [mode, setMode] = useState<Mode>('none');
const [searchText, setSearchText] = useState('');
const [message, setMessage] = useState('');
```

Then form state:

```ts
const [authorForm, setAuthorForm] = useState({
  firstName: '',
  lastName: '',
  email: '',
});
```

```ts
const [articleForm, setArticleForm] = useState({
  headline: '',
  content: '',
  authorId: '',
});
```

Then selection state:

```ts
const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
```

Developer thought process:

```text
What information can change on the screen? That information belongs in state.
```

## Step 11: Load Data When The Page Opens

File: `src/frontend/app.tsx`

Write this:

```ts
useEffect(() => {
  loadInitialData();
}, []);
```

Then write:

```ts
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
```

Why this comes before forms:

- The page must show existing data first.
- Create Article needs existing authors in a dropdown.

## Step 12: Render Authors And Articles

File: `src/frontend/app.tsx`

Start with static headings:

```tsx
<section className="content-grid">
  <section>
    <h2>Articles</h2>
  </section>

  <section>
    <h2>Authors</h2>
  </section>
</section>
```

Then add empty states:

```tsx
{articles.length === 0 && <p className="empty">No articles found.</p>}
```

```tsx
{authors.length === 0 && <p className="empty">No authors found.</p>}
```

Then add `.map()`:

```tsx
{articles.map((article) => (
  <article key={article.id} className="result-card">
    <h3>{article.headline}</h3>
    <p>{article.content}</p>
  </article>
))}
```

```tsx
{authors.map((author) => (
  <article key={author.id} className="result-card author-card">
    <h3>{author.firstName} {author.lastName}</h3>
    <p>{author.email}</p>
  </article>
))}
```

Developer thought process:

```text
Now that data loads, I need to display it.
```

## Step 13: Make Search Work

File: `src/frontend/app.tsx`

First connect input to state:

```tsx
<input
  value={searchText}
  onChange={(event) => setSearchText(event.target.value)}
  placeholder="Search authors or articles by keyword"
/>
```

Then write the search function:

```ts
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
```

Then connect the button:

```tsx
<button onClick={handleCommonSearch}>Search</button>
```

## Step 14: Add Create Mode

File: `src/frontend/app.tsx`

Add mode type:

```ts
type Mode = 'none' | 'create' | 'update-author' | 'update-article' | 'delete';
```

Add create button:

```tsx
<button
  className={mode === 'create' ? 'active' : ''}
  onClick={openCreateMode}
>
  Create
</button>
```

Write `openCreateMode`:

```ts
function openCreateMode() {
  setMode('create');
  setEditingAuthorId('');
  setEditingArticleId('');
  setShowDeleteAuthors(false);
  setShowDeleteArticles(false);
  setSelectedAuthorIds([]);
  setSelectedArticleIds([]);
}
```

Add one-at-a-time create choice:

```ts
function chooseCreateTarget(target: 'author' | 'article', checked: boolean) {
  setShowCreateAuthor(target === 'author' ? checked : false);
  setShowCreateArticle(target === 'article' ? checked : false);
}
```

Why this function exists:

- If Author is selected, Article becomes unselected.
- If Article is selected, Author becomes unselected.

## Step 15: Add Create Forms

File: `src/frontend/app.tsx`

Start with the create selector panel:

```tsx
{mode === 'create' && (
  <section className="panel">
    <h2>Create</h2>
    ...
  </section>
)}
```

Then show Create Author form only when selected:

```tsx
{mode === 'create' && showCreateAuthor && (
  <section className="panel">
    <h2>Create Author</h2>
    <form onSubmit={handleCreateAuthor}>
      ...
    </form>
  </section>
)}
```

Then write `handleCreateAuthor`:

```ts
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
```

Then repeat the same pattern for Create Article.

## Step 16: Add Update

File: `src/frontend/app.tsx`

Update is usually added after create because it reuses form ideas.

First add Update buttons inside cards:

```tsx
<button onClick={() => startUpdateAuthor(author)}>
  Update Author
</button>
```

Then write:

```ts
function startUpdateAuthor(author: Author) {
  setMode('update-author');
  setEditingAuthorId(author.id);
  setAuthorForm({
    firstName: author.firstName,
    lastName: author.lastName,
    email: author.email,
  });
}
```

Then show update form:

```tsx
{mode === 'update-author' && editingAuthorId && (...)}
```

Then submit update:

```ts
async function handleUpdateAuthor(event: React.FormEvent) {
  event.preventDefault();
  await cmsApi.updateAuthor(editingAuthorId, authorForm);
}
```

Do the same for articles.

## Step 17: Add Delete Mode

File: `src/frontend/app.tsx`

Add Delete button:

```tsx
<button
  className={mode === 'delete' ? 'danger active' : 'danger'}
  onClick={openDeleteMode}
>
  Delete
</button>
```

Write:

```ts
function openDeleteMode() {
  setMode('delete');
  setEditingAuthorId('');
  setEditingArticleId('');
  setShowCreateAuthor(false);
  setShowCreateArticle(false);
}
```

Then one-at-a-time delete choice:

```ts
function chooseDeleteTarget(target: 'authors' | 'articles', checked: boolean) {
  setShowDeleteAuthors(target === 'authors' ? checked : false);
  setShowDeleteArticles(target === 'articles' ? checked : false);
  setSelectedAuthorIds([]);
  setSelectedArticleIds([]);
}
```

## Step 18: Add Delete Checkboxes

File: `src/frontend/app.tsx`

Only show article delete checkboxes in delete/article mode:

```tsx
{mode === 'delete' && showDeleteArticles && (
  <input
    type="checkbox"
    checked={selectedArticleIds.includes(article.id)}
    onChange={() => toggleArticleSelection(article.id)}
  />
)}
```

Only show author delete checkboxes in delete/author mode:

```tsx
{mode === 'delete' && showDeleteAuthors && (...)}
```

Write toggle functions:

```ts
function toggleAuthorSelection(id: string) {
  setSelectedAuthorIds((currentIds) =>
    currentIds.includes(id)
      ? currentIds.filter((authorId) => authorId !== id)
      : [...currentIds, id]
  );
}
```

This means:

```text
If selected already, remove it.
If not selected yet, add it.
```

Then delete selected records:

```ts
async function deleteSelectedAuthors() {
  await Promise.all(selectedAuthorIds.map((id) => cmsApi.deleteAuthor(id)));
}
```

Developer thought process:

```text
Delete needs selection state before it can call the backend.
```

## Step 19: Add Refresh

File: `src/frontend/app.tsx`

Add the Refresh button near Delete:

```tsx
<button className="secondary" onClick={() => window.location.reload()}>
  Refresh
</button>
```

This refreshes the whole browser page.

Alternative developer option:

```ts
await loadInitialData();
```

That reloads data without refreshing the full page. Your requested behavior is full page refresh, so the app uses `window.location.reload()`.

## Step 20: Add Click Author To See Their Articles

Backend endpoint:

```text
GET /articles/author/:id
```

Frontend API method:

```ts
getArticlesByAuthorId(id: string): Promise<ArticlesByAuthorResponse> {
  return request<ArticlesByAuthorResponse>(`/articles/author/${id}`);
}
```

Add state:

```ts
const [authorArticleView, setAuthorArticleView] = useState<{
  author: Author;
  articles: Article[];
} | null>(null);
```

Add function:

```ts
async function showArticlesByAuthor(author: Author) {
  try {
    const result = await cmsApi.getArticlesByAuthorId(author.id);
    setAuthorArticleView(result);
    setMessage(`Showing articles by ${author.firstName} ${author.lastName}`);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Failed to load author articles');
  }
}
```

Make author card clickable:

```tsx
<article
  className="result-card author-card clickable-card"
  role="button"
  tabIndex={0}
  onClick={() => showArticlesByAuthor(author)}
>
```

Show the articles:

```tsx
{authorArticleView && (
  <section className="panel">
    <h2>
      Articles by {authorArticleView.author.firstName}{' '}
      {authorArticleView.author.lastName}
    </h2>

    {authorArticleView.articles.map((article) => (
      <article key={article.id} className="result-card">
        <h3>{article.headline}</h3>
        <p>{article.content}</p>
      </article>
    ))}
  </section>
)}
```

## Step 21: Prevent Click Conflicts

When the whole author card is clickable, the Update button inside it could accidentally trigger the author-card click too.

So the Update button uses:

```tsx
event.stopPropagation();
```

Example:

```tsx
<button
  onClick={(event) => {
    event.stopPropagation();
    startUpdateAuthor(author);
  }}
>
  Update Author
</button>
```

Meaning:

```text
Click only this button. Do not also click the parent card.
```

The delete checkbox uses the same idea.

## Step 22: Connect Frontend To Backend Through Vite

File: `src/frontend/vite.config.ts`

The frontend runs at:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:3000
```

The Vite proxy connects them:

```ts
proxy: {
  '^/api(/|$)': {
    target: backendUrl,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api(?=\/|$)/, '')
  }
}
```

Meaning:

```text
Frontend calls /api/authors
Vite sends it to http://localhost:3000/authors
```

This avoids browser CORS problems during local development.

## Step 23: Test In This Order

Use this order when developing:

1. Start Docker Desktop.
2. Start MongoDB:

```bash
docker compose -f src/backend/docker-compose.yml up -d mongodb
```

3. Start backend:

```bash
pnpm run dev:backend
```

4. Start frontend:

```bash
pnpm run dev:frontend
```

5. Open:

```text
http://localhost:5173/
```

6. Test read first:

```text
Authors and articles appear.
```

7. Test search.
8. Test create author.
9. Test create article.
10. Test update.
11. Test delete last.

## Step 24: Run Developer Checks

Frontend typecheck:

```bash
pnpm run typecheck:frontend
```

Frontend build:

```bash
pnpm run build:frontend
```

Backend typecheck:

```bash
pnpm run typecheck
```

## The Real Developer Order Summary

If this project were written from scratch, a developer would usually build it like this:

1. `index.html`: add `root` and `main.tsx` script.
2. `main.tsx`: mount React.
3. `app.tsx`: show only a heading.
4. `style.css`: add basic styling.
5. `types.ts`: define `Author` and `Article`.
6. `api.ts`: create reusable `request`.
7. `api.ts`: add `getAuthors` and `getArticles`.
8. `app.tsx`: add state for authors/articles.
9. `app.tsx`: load data with `useEffect`.
10. `app.tsx`: render author/article lists.
11. `api.ts`: add search methods.
12. `app.tsx`: add search input and button.
13. `api.ts`: add create methods.
14. `app.tsx`: add create mode and forms.
15. `api.ts`: add update methods.
16. `app.tsx`: add update buttons and forms.
17. `api.ts`: add delete methods.
18. `app.tsx`: add delete mode, checkboxes, and delete buttons.
19. `api.ts`: add articles-by-author method.
20. `app.tsx`: make author cards clickable and show detail panel.
21. `style.css`: polish panels, cards, buttons, and responsive layout.
22. `src/frontend/vite.config.ts`: make sure `/api` proxy works.
23. Run typecheck/build.
24. Test manually in browser.

That is the kind of order real developers use: small working version first, then one feature at a time.
