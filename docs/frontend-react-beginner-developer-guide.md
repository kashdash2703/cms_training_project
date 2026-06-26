# Frontend React Beginner Developer Guide

This guide explains the frontend as if you are learning React and TypeScript from the project itself.

The important idea: developers usually do not write files from top to bottom exactly as you see them. They first make a tiny working app, then add types, API calls, state, forms, lists, and styling. This guide follows that real developer order first, then explains every frontend source file and every line range.

## What The Frontend Does

This frontend is a React app for a CMS.

It lets a user:

1. See authors.
2. See articles.
3. Search authors and articles.
4. Create one author or one article.
5. Update an author or article.
6. Delete selected authors or selected articles.
7. Click an author to see articles written by that author.
8. Refresh the page.

## Source Files Covered

These are the files humans edit and learn from:

```text
src/frontend/index.html
src/frontend/package.json
src/frontend/tsconfig.json
src/frontend/vite.config.ts
src/frontend/main.tsx
src/frontend/style.css
src/frontend/types/index.ts
src/frontend/api/cms.api.ts
src/frontend/app.tsx
src/frontend/components/SearchBar.tsx
src/frontend/components/Toolbar.tsx
src/frontend/components/CreatePanel.tsx
src/frontend/components/CreateAuthorForm.tsx
src/frontend/components/CreateArticleForm.tsx
src/frontend/components/UpdateAuthorForm.tsx
src/frontend/components/UpdateArticleForm.tsx
src/frontend/components/DeletePanel.tsx
src/frontend/components/AuthorArticleView.tsx
src/frontend/components/ArticleList.tsx
src/frontend/components/AuthorList.tsx
src/frontend/public/favicon.svg
src/frontend/public/icons.svg
```

Generated folders are not meant to be learned line by line:

```text
src/frontend/dist
src/frontend/node_modules
```

`dist` is created by `pnpm run build:frontend`.

`node_modules` is created by `pnpm install`.

## The Developer's Real Build Order

This is the order a developer would normally think and write the frontend.

### Step 1: Create The Browser Entry

Start with `src/frontend/index.html`.

The developer first needs one real HTML page and one empty place where React can appear.

They write:

1. A normal HTML document.
2. A `<div id="root"></div>`.
3. A script that loads `src/frontend/main.tsx`.

Why this comes first: without `src/frontend/index.html`, the browser has no page to open.

### Step 2: Mount React Into The Page

Then write `src/frontend/main.tsx`.

The developer imports:

1. React.
2. ReactDOM.
3. CSS.
4. The main `App` component.

Then they tell React:

```text
Find the HTML element with id="root" and render <App /> inside it.
```

Why this comes second: React needs a starting point.

### Step 3: Create A Tiny App First

Then create `src/frontend/app.tsx`.

The first version would probably only return:

```tsx
export function App() {
  return <h1>CMS Engine</h1>;
}
```

Developers do this because they want to prove the page works before adding complicated code.

### Step 4: Add TypeScript Shapes

Then write `src/frontend/types/index.ts`.

The developer asks:

```text
What data does the backend send me?
```

The answer becomes TypeScript types:

1. `Author`
2. `Article`
3. Search responses
4. Articles-by-author response
5. UI mode names
6. Form state shapes

Why this happens early: once the data shapes exist, TypeScript can catch mistakes.

### Step 5: Create The API Client

Then write `src/frontend/api/cms.api.ts`.

The developer asks:

```text
How should the frontend talk to the backend?
```

Instead of writing `fetch(...)` everywhere inside React components, the developer creates one API file.

That gives the app one clear place for:

1. Backend URL prefix.
2. JSON headers.
3. Error handling.
4. Authors API calls.
5. Articles API calls.

Why this comes before big UI work: once API functions exist, React can call simple names like `cmsApi.getAuthors()`.

### Step 6: Add App State

Then return to `src/frontend/app.tsx`.

The developer now adds `useState`.

They think:

```text
What can change on the screen?
```

The changing things become state:

1. Authors list.
2. Articles list.
3. Current mode.
4. Search text.
5. Message.
6. Loading flag.
7. Selected delete IDs.
8. Which create/delete panel is open.
9. Which author's articles are being viewed.
10. Form field values.
11. Editing record IDs.

React rule: if changing data should update the screen, put it in state.

### Step 7: Load Data When The App Opens

Still in `app.tsx`, the developer adds `useEffect`.

They think:

```text
When the page first opens, call the backend and fill the lists.
```

That is why `useEffect` calls `loadInitialData()`.

### Step 8: Render The First Visible UI

The developer now adds the main return JSX in `app.tsx`.

They render:

1. Page wrapper.
2. Header.
3. Search bar.
4. Toolbar.
5. Message/loading text.
6. Panels depending on mode.
7. Articles list.
8. Authors list.

At this stage the UI appears.

### Step 9: Extract Small Components

The developer sees `app.tsx` getting large.

They move repeated UI pieces into `src/frontend/components`.

This is how they think:

```text
App should decide what happens.
Components should display one focused part of the screen.
```

So:

1. `SearchBar` displays search input/buttons.
2. `Toolbar` displays create/delete/refresh buttons.
3. `CreatePanel` lets the user choose author or article.
4. `DeletePanel` lets the user choose authors or articles.
5. Form components display input fields.
6. List components display authors/articles.

### Step 10: Add Create Behavior

Back in `app.tsx`, the developer writes:

1. `openCreateMode`
2. `chooseCreateTarget`
3. `handleCreateAuthor`
4. `handleCreateArticle`

Important React idea: the form inputs are controlled by state.

That means:

```text
input value comes from React state
input onChange updates React state
submit sends React state to backend
```

### Step 11: Add Update Behavior

The developer writes:

1. `startUpdateAuthor`
2. `startUpdateArticle`
3. `handleUpdateAuthor`
4. `handleUpdateArticle`

The developer thinking:

```text
When the user clicks Update, copy existing values into the form.
Then when they submit, send changed values to backend.
```

### Step 12: Add Delete Behavior

The developer writes:

1. `openDeleteMode`
2. `chooseDeleteTarget`
3. `toggleAuthorSelection`
4. `toggleArticleSelection`
5. `deleteSelectedAuthors`
6. `deleteSelectedArticles`

The key idea:

```text
Checkboxes store selected IDs.
Delete button sends those IDs to backend.
```

### Step 13: Add Author Click Behavior

The developer writes `showArticlesByAuthor`.

The thinking:

```text
Clicking an author should call /articles/author/:id
Then show a focused panel with only that author's articles.
```

### Step 14: Add Styling

Then the developer writes `src/frontend/style.css`.

The styling is usually done after basic behavior works.

CSS decides:

1. Layout.
2. Spacing.
3. Button colors.
4. Panels.
5. Cards.
6. Mobile layout.

### Step 15: Add Tooling Config

The developer then makes sure the app can run cleanly:

1. `src/frontend/package.json`
2. `src/frontend/tsconfig.json`
3. `src/frontend/vite.config.ts`

These files make commands like this work:

```bash
pnpm run dev:frontend
pnpm run typecheck:frontend
pnpm run build:frontend
```

## Beginner React Concepts Used Here

### Component

A component is a reusable UI function.

Example:

```tsx
export function Toolbar() {
  return <section>...</section>;
}
```

Think of a component as a custom HTML tag you create yourself.

### JSX

JSX is HTML-like code inside JavaScript/TypeScript.

Example:

```tsx
return <h1>CMS Engine</h1>;
```

It looks like HTML, but it is actually React syntax.

### Props

Props are values passed from a parent component to a child component.

Example:

```tsx
<SearchBar searchText={searchText} onSearch={handleCommonSearch} />
```

`App` is the parent. `SearchBar` is the child.

### State

State is memory inside a component.

Example:

```tsx
const [message, setMessage] = useState('');
```

`message` is the current value.

`setMessage` changes the value and tells React to re-render the screen.

### Event Handler

An event handler is a function that runs when the user does something.

Examples:

```tsx
onClick={onSearch}
onChange={(event) => onSearchTextChange(event.target.value)}
onSubmit={onSubmit}
```

### Controlled Input

A controlled input is an input where React owns the value.

Example:

```tsx
<input
  value={authorForm.firstName}
  onChange={(event) =>
    onAuthorFormChange({ ...authorForm, firstName: event.target.value })
  }
/>
```

This means:

```text
Show authorForm.firstName in the input.
When the user types, update authorForm.firstName.
```

### Conditional Rendering

Conditional rendering means showing UI only when a condition is true.

Example:

```tsx
{mode === 'create' && <CreatePanel />}
```

Meaning:

```text
If mode is create, show CreatePanel.
Otherwise show nothing.
```

### Mapping Lists

Mapping means turning an array into UI.

Example:

```tsx
authors.map((author) => (
  <article key={author.id}>...</article>
))
```

React needs `key` so it can track each item efficiently.

## File-By-File Explanation

## `src/frontend/index.html`

Purpose: the real HTML page opened by the browser.

Line 1:

```html
<!doctype html>
```

Tells the browser this is a modern HTML document.

Line 2:

```html
<html lang="en">
```

Starts the HTML page and says the language is English.

Line 3:

```html
<head>
```

Starts the metadata area. Metadata is information about the page, not visible page content.

Line 4:

```html
<meta charset="UTF-8" />
```

Allows normal text characters.

Line 5:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

Uses `src/frontend/public/favicon.svg` as the browser tab icon.

Line 6:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Makes the page scale correctly on phones and desktops.

Line 7:

```html
<title>CMS Engine</title>
```

Browser tab title.

Line 8:

```html
</head>
```

Ends the metadata area.

Line 9:

```html
<body>
```

Starts visible page content.

Line 10:

```html
<div id="root"></div>
```

This empty `div` is where React will place the app.

Line 11:

```html
<script type="module" src="/main.tsx"></script>
```

Loads the TypeScript React entry file.

Lines 12-13 close `body` and `html`.

## `src/frontend/main.tsx`

Purpose: connect React to `src/frontend/index.html`.

Line 1 imports React.

Line 2 imports ReactDOM, the React library that talks to the browser DOM.

Line 3 imports global CSS so the whole app gets styles.

Line 4 imports the main `App` component.

Lines 6-10:

```tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Meaning:

1. Find `<div id="root"></div>`.
2. Tell React to control it.
3. Render `<App />` inside it.
4. Wrap the app in `React.StrictMode`, which helps catch React mistakes during development.

The `as HTMLElement` part is TypeScript. It tells TypeScript:

```text
Trust me, this element exists and is an HTML element.
```

## `src/frontend/types/index.ts`

Purpose: define data shapes.

Lines 1-2 are comments explaining that frontend types should match backend types.

Lines 3-8 define `Author`.

An author has:

1. `id`
2. `firstName`
3. `lastName`
4. `email`

All are strings.

Lines 10-15 define `Article`.

An article has:

1. `id`
2. `headline`
3. `content`
4. `author`

The `author` field uses the `Author` type from above.

Lines 17-22 define `AuthorSearchResponse`.

The backend search response is not just `Author[]`. It is:

```text
totalSearchResults
results: [{ author }]
```

Lines 24-29 define `ArticleSearchResponse`.

Same idea, but each result has an `article`.

Lines 31-34 define `ArticlesByAuthorResponse`.

When clicking an author, the backend returns:

1. The author.
2. That author's articles.

Line 36 defines `Mode`.

This is a TypeScript union type. It says `mode` can only be one of these exact strings:

```text
none
create
update-author
update-article
delete
```

This prevents spelling mistakes like `creat` or `deletee`.

Lines 38-42 define `AuthorFormState`.

This is the shape of the author form state.

Lines 44-48 define `ArticleFormState`.

This is the shape of the article form state.

## `src/frontend/api/cms.api.ts`

Purpose: all frontend-to-backend requests.

Line 1 is a comment explaining the purpose of the file.

Lines 2-8 import TypeScript types. `import type` means these imports are only for TypeScript checking, not browser runtime code.

Lines 10-12:

```ts
const API_BASE = '/api';
```

The frontend calls `/api/...`.

Vite changes `/api/authors` into `http://localhost:3000/authors`.

Lines 14-19 define a reusable `request<T>` function.

`<T>` is a TypeScript generic. It means:

```text
The caller can tell this function what type of data it expects back.
```

Lines 20-21 prepare a `response` variable and headers.

Lines 23-27 add the JSON `Content-Type` header only when a request body exists.

This is important because DELETE requests usually have no body. Sending JSON content type with no body caused the warning:

```text
Body cannot be empty when content-type is set to application/json
```

Lines 29-37 call `fetch`.

If the backend is not running, it throws a friendly error message.

Lines 39-48 handle HTTP errors like 400, 404, 409, and 500.

The code tries to read `message` from the backend error response. If it cannot, it uses a fallback.

Lines 50-51 convert the response JSON into the expected TypeScript type.

Lines 54-56 create `cmsApi`, one object containing every backend action used by the UI.

Lines 57-59 get all authors.

Lines 61-70 create an author.

The body is converted to JSON using `JSON.stringify(author)`.

Lines 72-84 update an author.

`firstName`, `lastName`, and `email` are optional because the user might update only some fields.

Lines 86-90 delete an author.

No body is sent.

Lines 92-99 search authors.

The backend returns wrapped results, so line 98 extracts only the actual authors.

Lines 101-103 get all articles.

Lines 105-107 get articles by one author ID.

Lines 109-118 create an article linked to an existing author.

Lines 120-131 update an article.

Lines 133-137 delete an article.

No body is sent.

Lines 139-146 search articles.

The backend returns wrapped results, so line 145 extracts only the actual articles.

## `src/frontend/app.tsx`

Purpose: the main brain of the frontend.

`App` owns the main state and decides which components appear.

Lines 1-20 import everything this file needs.

Line 1 imports React hooks:

1. `useEffect`
2. `useState`

Line 2 imports backend API functions.

Lines 3-13 import UI components.

Lines 14-20 import TypeScript types.

Line 22 starts the `App` component.

Lines 23-25 create state for backend data:

1. `authors`
2. `articles`

Both start as empty arrays.

Lines 27-31 create UI state:

1. `mode`
2. `searchText`
3. `message`
4. `isLoading`

Lines 33-35 store selected IDs for delete checkboxes.

Lines 37-42 control which create/delete checkbox choice is active.

The app keeps Author and Article mutually exclusive by setting one to true and the other to false.

Lines 44-48 store the clicked author's article view.

It can either be:

1. An object with `author` and `articles`.
2. `null`, meaning no focused author view is open.

Lines 50-55 store author form input values.

Lines 57-62 store article form input values.

Lines 64-66 store which author or article is currently being edited.

Lines 68-71:

```tsx
useEffect(() => {
  loadInitialData();
}, []);
```

This runs once when the app first appears.

The empty `[]` means:

```text
Do this only on first load.
```

Lines 73-92 define `loadInitialData`.

This function:

1. Turns loading on.
2. Calls authors and articles APIs at the same time.
3. Stores results in state.
4. Clears the focused author-article view.
5. Shows an error if loading fails.
6. Turns loading off.

Lines 94-114 define `handleCommonSearch`.

If the search box is empty, it reloads all data.

Otherwise it searches authors and articles together.

Lines 116-129 define `handleCreateAuthor`.

This function:

1. Prevents default browser form submit.
2. Sends author form state to the backend.
3. Clears the form.
4. Shows success message.
5. Reloads data.
6. Shows error if creation fails.

Lines 131-143 define `handleCreateArticle`.

Same pattern, but for articles.

Lines 145-154 define `openCreateMode`.

This switches the app into create mode and clears update/delete state.

Lines 156-163 define `openDeleteMode`.

This switches the app into delete mode and clears create/update state.

Lines 165-169 define `chooseCreateTarget`.

If user selects Author, Article is turned off.

If user selects Article, Author is turned off.

This satisfies the requirement:

```text
Either author or article must be selected, not both.
```

Lines 171-177 define `chooseDeleteTarget`.

Same mutual-exclusion idea for delete mode.

It also clears selected IDs when switching between authors and articles.

Lines 179-194 define `startUpdateAuthor`.

This function:

1. Opens update-author mode.
2. Clears other modes.
3. Stores the author's ID.
4. Copies the author's existing values into the form.

Lines 196-211 define `startUpdateArticle`.

Same idea for an article.

Lines 213-226 define `handleUpdateAuthor`.

This sends edited author form values to the backend.

Lines 228-245 define `handleUpdateArticle`.

This sends edited article values to the backend.

Notice it only sends:

1. `headline`
2. `content`

It does not send `authorId` during update.

Lines 247-254 define `toggleAuthorSelection`.

If an author ID is already selected, remove it.

If it is not selected, add it.

Lines 256-263 define `toggleArticleSelection`.

Same idea for article IDs.

Lines 265-274 define `showArticlesByAuthor`.

When an author card is clicked:

1. Call backend for articles by that author.
2. Store response in `authorArticleView`.
3. Show a message.

Lines 276-287 define `deleteSelectedAuthors`.

It deletes all selected author IDs using `Promise.all`.

Lines 289-300 define `deleteSelectedArticles`.

Same idea for selected article IDs.

Lines 302-409 are the JSX returned by the component.

Line 303 starts the page wrapper.

Lines 304-316 render the header and `SearchBar`.

The `SearchBar` receives:

1. Current search text.
2. Function to update search text.
3. Function to search.
4. Function to clear.

Lines 318-323 render `Toolbar`.

The refresh button uses:

```tsx
window.location.reload()
```

That reloads the whole page.

Lines 325-326 conditionally show message and loading text.

Lines 328-334 show `CreatePanel` only when mode is `create`.

Lines 336-342 show `CreateAuthorForm` only when create mode and author target are selected.

Lines 344-351 show `CreateArticleForm` only when create mode and article target are selected.

Lines 353-359 show `UpdateAuthorForm` only when updating an author.

Lines 361-367 show `UpdateArticleForm` only when updating an article.

Lines 369-379 show `DeletePanel` only in delete mode.

Lines 381-386 show `AuthorArticleView` only after an author is clicked.

Lines 388-407 render the two main lists:

1. `ArticleList`
2. `AuthorList`

Line 408 closes `<main>`.

Line 409 closes the return.

Line 410 closes the component.

## `src/frontend/components/SearchBar.tsx`

Purpose: search input and buttons.

Lines 1-6 define props:

1. `searchText`
2. `onSearchTextChange`
3. `onSearch`
4. `onClear`

Lines 8-13 start the component and unpack props.

Line 15 starts the search bar wrapper.

Lines 16-20 render the input.

Line 17 shows the current search text.

Line 18 updates search text when the user types.

Line 19 shows placeholder text.

Line 22 renders the Search button.

Lines 24-26 render the Clear button.

Lines 27-29 close the component.

## `src/frontend/components/Toolbar.tsx`

Purpose: top action buttons.

Line 1 imports the `Mode` type.

Lines 3-8 define props:

1. Current mode.
2. Create click handler.
3. Delete click handler.
4. Refresh click handler.

Line 10 starts the component.

Line 12 starts the toolbar wrapper.

Lines 13-15 render Create button.

If current mode is `create`, the button gets the `active` CSS class.

Lines 17-22 render Delete button.

If current mode is `delete`, it gets `danger active`.

Lines 24-26 render Refresh button.

Lines 27-29 close the component.

## `src/frontend/components/CreatePanel.tsx`

Purpose: choose whether to create an author or article.

Lines 1-5 define props.

Lines 7-11 start component and unpack props.

Line 13 starts panel.

Line 14 shows title.

Lines 16-34 render two checkbox labels.

Lines 18-22 are the Author checkbox.

Lines 27-31 are the Article checkbox.

The checkboxes call `onChooseTarget`.

Lines 36-38 show helper text if neither checkbox is selected.

Lines 39-41 close component.

## `src/frontend/components/CreateAuthorForm.tsx`

Purpose: create author form.

Line 1 imports `AuthorFormState`.

Lines 3-7 define props.

Lines 9-13 start component and unpack props.

Line 15 starts panel.

Line 16 title.

Line 18 starts form.

Lines 19-25 render first name input.

Lines 27-33 render last name input.

Lines 35-41 render email input.

Each input uses:

```text
value = current React state
onChange = update React state
```

Line 43 renders submit button.

Lines 44-47 close form, panel, and component.

## `src/frontend/components/CreateArticleForm.tsx`

Purpose: create article form.

Line 1 imports `ArticleFormState` and `Author`.

Lines 3-8 define props.

`authors` is needed because the article must be linked to an existing author.

Lines 10-15 start component and unpack props.

Line 17 starts panel.

Line 18 title.

Line 20 starts form.

Lines 21-27 render headline input.

Lines 29-35 render content textarea.

Lines 37-49 render author dropdown.

Line 43 gives the empty default option.

Lines 44-48 use `authors.map` to create one `<option>` per author.

Line 51 submit button.

Lines 52-55 close component.

## `src/frontend/components/UpdateAuthorForm.tsx`

Purpose: update author form.

Line 1 imports `AuthorFormState`.

Lines 3-7 define props.

Lines 9-13 start component.

Line 15 starts panel.

Line 16 title.

Line 18 starts form.

Lines 19-24 render first name input.

Lines 26-31 render last name input.

Lines 33-38 render email input.

Line 40 submit button.

Lines 41-44 close component.

This looks like create author form, but it is pre-filled by `startUpdateAuthor` in `app.tsx`.

## `src/frontend/components/UpdateArticleForm.tsx`

Purpose: update article form.

Line 1 imports `ArticleFormState`.

Lines 3-7 define props.

Lines 9-13 start component.

Line 15 starts panel.

Line 16 title.

Line 18 starts form.

Lines 19-24 render headline input.

Lines 26-31 render content textarea.

Line 33 submit button.

Lines 34-37 close component.

The form does not show author dropdown because this app updates article text, not article ownership.

## `src/frontend/components/DeletePanel.tsx`

Purpose: choose whether to delete authors or articles and run selected delete.

Lines 1-9 define props.

Lines 11-19 start component and unpack props.

Line 21 starts panel.

Line 22 title.

Lines 24-42 render the Author and Article delete choice checkboxes.

Lines 26-30 are the Authors checkbox.

Lines 35-39 are the Articles checkbox.

Lines 44-46 show helper text if neither is selected.

Line 48 starts delete action area.

Lines 49-57 show Delete Selected Authors button only when author delete mode is active.

Line 52 disables the button when zero authors are selected.

Lines 59-67 show Delete Selected Articles button only when article delete mode is active.

Line 62 disables the button when zero articles are selected.

Lines 68-71 close component.

## `src/frontend/components/AuthorArticleView.tsx`

Purpose: show articles for one clicked author.

Line 1 imports `Article` and `Author`.

Lines 3-6 define props.

Line 8 starts component.

Line 10 starts panel.

Lines 11-13 title with author name.

Lines 15-17 show empty message when this author has no articles.

Lines 19-24 map articles into cards.

Line 20 uses `article.id` as React key.

Lines 21-22 show headline and content.

Lines 25-27 close component.

## `src/frontend/components/ArticleList.tsx`

Purpose: show all articles.

Line 1 imports `Article` and `Mode`.

Lines 3-10 define props.

The list receives data and functions from `App`.

Lines 12-19 start component and unpack props.

Line 21 starts section.

Line 22 title.

Line 24 shows empty state if there are no articles.

Lines 26-51 map each article to a card.

Line 27 creates article card with `key`.

Lines 28-35 show delete checkbox only when:

```text
mode is delete
and showDeleteArticles is true
```

Line 31 checks whether the article ID is currently selected.

Line 32 stops click behavior from accidentally affecting parent elements.

Line 33 toggles selection.

Lines 37-38 show headline and content.

Lines 40-43 show author metadata.

Lines 45-49 show update button.

Line 46 calls `onStartUpdateArticle(article)`.

Lines 50-54 close component.

## `src/frontend/components/AuthorList.tsx`

Purpose: show all authors.

Line 1 imports `Author` and `Mode`.

Lines 3-11 define props.

Lines 13-21 start component and unpack props.

Line 23 starts section.

Line 24 title.

Line 26 shows empty state if there are no authors.

Lines 28-72 map authors into cards.

Lines 29-35 start clickable author card.

The card has:

1. `role="button"`
2. `tabIndex={0}`
3. `onClick`
4. `onKeyDown`

This makes the author card clickable by mouse and usable by keyboard.

Lines 35-44 handle keyboard behavior.

If the focused card receives Enter or Space, it opens that author's articles.

Lines 46-53 show delete checkbox only in author delete mode.

Line 49 checks whether this author ID is selected.

Line 50 stops the checkbox click from also opening author articles.

Line 51 toggles selection.

Lines 55-57 show author name.

Line 59 shows author email.

Lines 61-70 show Update Author button.

Lines 63-66 stop the button click from also triggering the parent card click, then starts update mode.

Lines 71-75 close component.

## `src/frontend/style.css`

Purpose: visual styling.

Lines 1-3:

```css
* {
  box-sizing: border-box;
}
```

Makes sizing easier. Padding and borders are included inside element width.

Lines 5-10 style the whole page body.

Lines 12-17 make buttons and form fields inherit the page font.

Lines 19-26 style normal buttons.

Lines 28-30 style button hover.

Lines 32-35 style disabled buttons.

Lines 37-44 style secondary buttons.

Lines 46-48 style active buttons.

Lines 50-60 style danger buttons and active danger buttons.

Lines 62-66 style the main page width and padding.

Lines 68-71 style the hero/header area.

Lines 73-79 style `.eyebrow`.

This class is currently available but not used in the current JSX.

Lines 81-84 style `h1`.

Lines 86-89 style `.subtitle`.

This class is currently available but not used in the current JSX.

Lines 91-96 style the search bar layout.

Lines 98-104 style the search input.

Lines 106-111 style the toolbar layout.

Lines 113-118 style toolbar select fields.

This is leftover styling from when toolbar had a select/dropdown. It is harmless but not currently used.

Lines 120-127 style message boxes.

Lines 129-137 style panels.

Lines 139-142 style `.danger-panel`.

This class is currently not used because the delete panel was changed to look like the create panel.

Lines 144-148 style checkbox choice rows.

Lines 150-155 style labels inside choice rows.

Lines 157-159 prevent choice row checkboxes from stretching full width.

Lines 161-164 style helper text.

Lines 166-171 style delete action buttons area.

Lines 173-176 style forms inside panels.

Lines 178-185 style panel inputs, textareas, and selects.

Lines 187-190 style panel textareas.

Lines 192-197 create the two-column content grid.

Articles get more width than authors.

Lines 199-206 style result cards.

Lines 208-211 style card headings.

Lines 213-215 style card paragraph line height.

Lines 217-220 style metadata text.

Lines 222-226 style card button area.

Lines 228-230 style author card headings.

Lines 232-234 show pointer cursor for clickable cards.

Lines 236-241 style clickable card hover/focus.

Lines 243-249 style empty states.

Lines 251-264 are responsive styles for screens under 800px.

On small screens:

1. H1 becomes smaller.
2. Search bar stacks vertically.
3. Toolbar stacks vertically.
4. Content grid becomes one column.

## `src/frontend/vite.config.ts`

Purpose: configure Vite development server and frontend build.

Line 1 imports Vite config helpers.

Line 2 imports React plugin for Vite.

Lines 4-27 export Vite configuration.

Line 5 loads `.env` values from the frontend package directory.

Line 6 reads `BACKEND_URL` or defaults to `http://localhost:3000`.

Line 10 enables React support.

Lines 11-14 set build output to `dist/frontend` at the repository root.

Lines 15-25 configure the dev server.

Line 16 reads frontend host from env or uses `localhost`.

Line 17 reads frontend port from env or uses `5173`.

Lines 18-24 configure the `/api` proxy.

Meaning:

```text
Browser calls http://localhost:5173/api/authors
Vite forwards it to http://localhost:3000/authors
```

Line 25 removes `/api` before forwarding to backend.

## `src/frontend/tsconfig.json`

Purpose: TypeScript rules for the frontend.

Lines 1-47 are JSON with comments, which TypeScript allows in tsconfig files.

Lines 3-45 define compiler options.

Lines 5-6 say source files are in this folder and build output goes to `dist/frontend`.

Line 7 allows smoother default imports from some older package styles.

Lines 11-14 configure modern browser TypeScript modules and Vite client types.

Lines 21-23 generate source maps and declaration files.

Lines 26-27 enable stricter checking for arrays and optional properties.

Line 30 requires functions to return correctly.

Lines 31-35 are stricter options currently commented out.

Line 38 enables strict TypeScript.

Line 39 enables React JSX.

Lines 40-44 enable recommended safety options.

Line 46 excludes `vite.config.ts` from browser app typechecking.

Why exclude it: `vite.config.ts` uses Node features, while this tsconfig is mainly for browser React code.

## `src/frontend/package.json`

Purpose: frontend-only dependencies and scripts.

Line 2 names the frontend package `cms-frontend`.

Line 4 makes it private, meaning it will not be published to npm.

Line 5 says this package uses ES modules.

Lines 6-10 define scripts:

1. `dev`: run Vite dev server.
2. `typecheck`: run TypeScript checks.
3. `build`: build frontend files.

Lines 11-14 list runtime dependencies:

1. `react`
2. `react-dom`

Lines 15-21 list development dependencies:

1. React TypeScript types.
2. Vite React plugin.
3. TypeScript.
4. Vite.

## `src/frontend/public/favicon.svg`

Purpose: browser tab icon.

Line 1 contains one full SVG image.

It is long because SVG stores shapes, colors, masks, filters, and blur effects as text.

You normally do not hand-write this file as a beginner. It is usually generated by a design tool or copied from an asset source.

The important frontend connection is in `src/frontend/index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

## `src/frontend/public/icons.svg`

Purpose: reusable SVG symbol definitions.

Line 1 opens the SVG.

Lines 2-5 define `bluesky-icon`.

Lines 6-8 define `discord-icon`.

Lines 9-13 define `documentation-icon`.

Lines 14-16 define `github-icon`.

Lines 17-20 define `social-icon`.

Lines 21-23 define `x-icon`.

Line 24 closes the SVG.

These icons are available as public assets, but the current React UI does not directly reference them.

## How Data Moves Through The App

### Page Load

```text
src/frontend/index.html
  -> main.tsx
    -> App
      -> useEffect
        -> loadInitialData
          -> cmsApi.getAuthors()
          -> cmsApi.getArticles()
          -> setAuthors(...)
          -> setArticles(...)
          -> ArticleList and AuthorList re-render
```

### Search

```text
User types in SearchBar
  -> onSearchTextChange
    -> setSearchText
User clicks Search
  -> handleCommonSearch
    -> cmsApi.searchAuthors
    -> cmsApi.searchArticles
    -> setAuthors
    -> setArticles
```

### Create Author

```text
User clicks Create
  -> openCreateMode
User checks Author
  -> chooseCreateTarget('author')
User types form
  -> setAuthorForm
User submits form
  -> handleCreateAuthor
    -> cmsApi.createAuthor
    -> loadInitialData
```

### Create Article

```text
User clicks Create
  -> openCreateMode
User checks Article
  -> chooseCreateTarget('article')
User fills headline/content/author
  -> setArticleForm
User submits
  -> handleCreateArticle
    -> cmsApi.createArticleWithExistingAuthor
    -> loadInitialData
```

### Update

```text
User clicks Update button
  -> startUpdateAuthor or startUpdateArticle
    -> copy existing values into form state
User edits form
  -> setAuthorForm or setArticleForm
User submits
  -> handleUpdateAuthor or handleUpdateArticle
    -> cmsApi.updateAuthor or cmsApi.updateArticle
    -> loadInitialData
```

### Delete

```text
User clicks Delete
  -> openDeleteMode
User chooses Authors or Articles
  -> chooseDeleteTarget
User ticks records
  -> toggleAuthorSelection or toggleArticleSelection
User clicks Delete Selected
  -> deleteSelectedAuthors or deleteSelectedArticles
    -> cmsApi.deleteAuthor or cmsApi.deleteArticle
    -> loadInitialData
```

### Click Author To See Articles

```text
User clicks author card
  -> showArticlesByAuthor
    -> cmsApi.getArticlesByAuthorId
    -> setAuthorArticleView
    -> AuthorArticleView appears
```

## How To Build This Yourself Next Time

If you create a new React frontend in the future, use this order:

1. Make `src/frontend/index.html`.
2. Make `main.tsx`.
3. Make `App` return one heading.
4. Add CSS import.
5. Add TypeScript types for backend data.
6. Add API file with a reusable `request` helper.
7. Add `get` methods first.
8. Add state for backend data.
9. Add `useEffect` to load data.
10. Render lists.
11. Extract list components.
12. Add search state and API methods.
13. Add create form state.
14. Add create form UI.
15. Add create submit handlers.
16. Add update state and pre-fill logic.
17. Add update submit handlers.
18. Add delete selected IDs state.
19. Add delete checkboxes.
20. Add delete submit handlers.
21. Add special detail views, like articles by author.
22. Add loading and error messages.
23. Style only after the UI works.
24. Run typecheck.
25. Run build.
26. Manually test in browser.

## Commands To Practice

From the project root:

```bash
pnpm install
pnpm run dev:frontend
pnpm run typecheck:frontend
pnpm run build:frontend
```

To run backend and frontend together:

```bash
pnpm run dev
```

Then open:

```text
http://localhost:5173/
```

## What To Study First

For a beginner, study in this order:

1. `src/frontend/index.html`
2. `main.tsx`
3. `types/index.ts`
4. `api/cms.api.ts`
5. `components/SearchBar.tsx`
6. `components/Toolbar.tsx`
7. `components/CreateAuthorForm.tsx`
8. `components/ArticleList.tsx`
9. `components/AuthorList.tsx`
10. `app.tsx`
11. `style.css`
12. `vite.config.ts`
13. `tsconfig.json`

That order teaches the smallest ideas first and saves the dense `app.tsx` file until you already understand the pieces it connects.
