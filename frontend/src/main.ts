import './style.css';

type Author = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Article = {
  id: number;
  headline: string;
  text: string;
  authorId: number;
};

let authors: Author[] = [];
let articles: Article[] = [];

let nextAuthorId = 1;
let nextArticleId = 1;

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <h1>CMS Training Project</h1>

    <section class="card">
      <h2>Create Author</h2>

      <input id="authorFirstName" placeholder="First name" />
      <input id="authorLastName" placeholder="Last name" />
      <input id="authorEmail" placeholder="Email" />

      <button id="createAuthorButton">Create Author</button>
    </section>

    <section class="card">
      <h2>Create Article</h2>

      <input id="articleHeadline" placeholder="Headline" />
      <textarea id="articleText" placeholder="Article text"></textarea>
      <select id="articleAuthor"></select>

      <button id="createArticleButton">Create Article</button>
    </section>

    <section class="card">
      <h2>Search</h2>

      <input id="searchInput" placeholder="Search articles or authors..." />
      <button id="searchButton">Search</button>
      <button id="clearSearchButton">Clear</button>
    </section>

    <section class="card">
      <h2>Authors</h2>
      <div id="authorsList"></div>
    </section>

    <section class="card">
      <h2>Articles</h2>
      <div id="articlesList"></div>
    </section>
  `;

  setupEventListeners();
  renderAuthors();
  renderArticles();
  renderAuthorDropdown();
}

function setupEventListeners() {
  const createAuthorButton = document.getElementById('createAuthorButton') as HTMLButtonElement;
  const createArticleButton = document.getElementById('createArticleButton') as HTMLButtonElement;
  const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
  const clearSearchButton = document.getElementById('clearSearchButton') as HTMLButtonElement;

  createAuthorButton.addEventListener('click', createAuthor);
  createArticleButton.addEventListener('click', createArticle);
  searchButton.addEventListener('click', searchCms);
  clearSearchButton.addEventListener('click', clearSearch);
}

function createAuthor() {
  const firstNameInput = document.getElementById('authorFirstName') as HTMLInputElement;
  const lastNameInput = document.getElementById('authorLastName') as HTMLInputElement;
  const emailInput = document.getElementById('authorEmail') as HTMLInputElement;

  const author: Author = {
    id: nextAuthorId,
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
  };

  authors.push(author);
  nextAuthorId++;

  firstNameInput.value = '';
  lastNameInput.value = '';
  emailInput.value = '';

  renderAuthors();
  renderAuthorDropdown();
}

function createArticle() {
  const headlineInput = document.getElementById('articleHeadline') as HTMLInputElement;
  const textInput = document.getElementById('articleText') as HTMLTextAreaElement;
  const authorSelect = document.getElementById('articleAuthor') as HTMLSelectElement;

  const article: Article = {
    id: nextArticleId,
    headline: headlineInput.value,
    text: textInput.value,
    authorId: Number(authorSelect.value),
  };

  articles.push(article);
  nextArticleId++;

  headlineInput.value = '';
  textInput.value = '';

  renderArticles();
}

function renderAuthors(filteredAuthors = authors) {
  const authorsList = document.getElementById('authorsList');

  if (!authorsList) return;

  authorsList.innerHTML = '';

  filteredAuthors.forEach((author) => {
    authorsList.innerHTML += `
      <div class="item">
        <strong>ID:</strong> ${author.id}<br />
        <strong>Name:</strong> ${author.firstName} ${author.lastName}<br />
        <strong>Email:</strong> ${author.email}<br />
        <button onclick="updateAuthor(${author.id})">Update Author</button>
        <button onclick="getAuthorById(${author.id})">Retrieve by ID</button>
      </div>
    `;
  });
}

function renderArticles(filteredArticles = articles) {
  const articlesList = document.getElementById('articlesList');

  if (!articlesList) return;

  articlesList.innerHTML = '';

  filteredArticles.forEach((article) => {
    const author = authors.find((a) => a.id === article.authorId);

    articlesList.innerHTML += `
      <div class="item">
        <strong>ID:</strong> ${article.id}<br />
        <strong>Headline:</strong> ${article.headline}<br />
        <strong>Text:</strong> ${article.text}<br />
        <strong>Author:</strong> ${author ? `${author.firstName} ${author.lastName}` : 'Unknown'}<br />
        <button onclick="updateArticle(${article.id})">Update Article</button>
        <button onclick="getArticleById(${article.id})">Retrieve by ID</button>
      </div>
    `;
  });
}

function renderAuthorDropdown() {
  const authorSelect = document.getElementById('articleAuthor') as HTMLSelectElement;

  if (!authorSelect) return;

  authorSelect.innerHTML = '';

  authors.forEach((author) => {
    authorSelect.innerHTML += `
      <option value="${author.id}">
        ${author.firstName} ${author.lastName}
      </option>
    `;
  });
}

function searchCms() {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  const searchText = searchInput.value.toLowerCase();

  const filteredAuthors = authors.filter((author) =>
    author.firstName.toLowerCase().includes(searchText) ||
    author.lastName.toLowerCase().includes(searchText) ||
    author.email.toLowerCase().includes(searchText)
  );

  const filteredArticles = articles.filter((article) => {
    const author = authors.find((a) => a.id === article.authorId);

    return (
      article.headline.toLowerCase().includes(searchText) ||
      article.text.toLowerCase().includes(searchText) ||
      author?.firstName.toLowerCase().includes(searchText) ||
      author?.lastName.toLowerCase().includes(searchText)
    );
  });

  renderAuthors(filteredAuthors);
  renderArticles(filteredArticles);
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  searchInput.value = '';

  renderAuthors();
  renderArticles();
}

function updateAuthor(authorId: number) {
  const author = authors.find((a) => a.id === authorId);

  if (!author) return;

  const newFirstName = prompt('Enter new first name', author.firstName);
  const newLastName = prompt('Enter new last name', author.lastName);
  const newEmail = prompt('Enter new email', author.email);

  if (newFirstName) author.firstName = newFirstName;
  if (newLastName) author.lastName = newLastName;
  if (newEmail) author.email = newEmail;

  renderAuthors();
  renderArticles();
  renderAuthorDropdown();
}

function updateArticle(articleId: number) {
  const article = articles.find((a) => a.id === articleId);

  if (!article) return;

  const newHeadline = prompt('Enter new headline', article.headline);
  const newText = prompt('Enter new text', article.text);

  if (newHeadline) article.headline = newHeadline;
  if (newText) article.text = newText;

  renderArticles();
}

function getAuthorById(authorId: number) {
  const author = authors.find((a) => a.id === authorId);

  if (!author) return;

  alert(`Author ID: ${author.id}
Name: ${author.firstName} ${author.lastName}
Email: ${author.email}`);
}

function getArticleById(articleId: number) {
  const article = articles.find((a) => a.id === articleId);

  if (!article) return;

  alert(`Article ID: ${article.id}
Headline: ${article.headline}
Text: ${article.text}`);
}

declare global {
  interface Window {
    updateAuthor: (authorId: number) => void;
    updateArticle: (articleId: number) => void;
    getAuthorById: (authorId: number) => void;
    getArticleById: (articleId: number) => void;
  }
}

window.updateAuthor = updateAuthor;
window.updateArticle = updateArticle;
window.getAuthorById = getAuthorById;
window.getArticleById = getArticleById;