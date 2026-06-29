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
import { useCmsApp } from './hooks/useCmsApp';

export function App() {
  const cms = useCmsApp();

  return (
    <main className="page">
      <header className="hero">
        <h1>CMS Engine</h1>

        <SearchBar
          searchText={cms.searchText}
          onSearchTextChange={cms.setSearchText}
          onSearch={cms.handleCommonSearch}
          onClear={async () => {
            cms.setSearchText('');
            await cms.loadInitialData();
          }}
        />
      </header>

      <Toolbar
        mode={cms.mode}
        onCreate={cms.openCreateMode}
        onDelete={cms.openDeleteMode}
        onRefresh={() => window.location.reload()}
      />

      {cms.message && <p className="message">{cms.message}</p>}
      {cms.isLoading && <p className="message">Loading...</p>}

      {cms.mode === 'create' && (
        <CreatePanel
          showCreateAuthor={cms.showCreateAuthor}
          showCreateArticle={cms.showCreateArticle}
          onChooseTarget={cms.chooseCreateTarget}
        />
      )}

      {cms.mode === 'create' && cms.showCreateAuthor && (
        <CreateAuthorForm
          authorForm={cms.authorForm}
          onAuthorFormChange={cms.setAuthorForm}
          onSubmit={cms.handleCreateAuthor}
        />
      )}

      {cms.mode === 'create' && cms.showCreateArticle && (
        <CreateArticleForm
          authors={cms.authors}
          articleForm={cms.articleForm}
          onArticleFormChange={cms.setArticleForm}
          onSubmit={cms.handleCreateArticle}
        />
      )}

      {cms.mode === 'update-author' && cms.editingAuthorId && (
        <UpdateAuthorForm
          authorForm={cms.authorForm}
          onAuthorFormChange={cms.setAuthorForm}
          onSubmit={cms.handleUpdateAuthor}
        />
      )}

      {cms.mode === 'update-article' && cms.editingArticleId && (
        <UpdateArticleForm
          articleForm={cms.articleForm}
          onArticleFormChange={cms.setArticleForm}
          onSubmit={cms.handleUpdateArticle}
        />
      )}

      {cms.mode === 'delete' && (
        <DeletePanel
          showDeleteAuthors={cms.showDeleteAuthors}
          showDeleteArticles={cms.showDeleteArticles}
          selectedAuthorCount={cms.selectedAuthorIds.length}
          selectedArticleCount={cms.selectedArticleIds.length}
          onChooseTarget={cms.chooseDeleteTarget}
          onDeleteAuthors={cms.deleteSelectedAuthors}
          onDeleteArticles={cms.deleteSelectedArticles}
        />
      )}

      {cms.authorArticleView && (
        <AuthorArticleView
          author={cms.authorArticleView.author}
          articles={cms.authorArticleView.articles}
        />
      )}

      <section className="content-grid">
        <ArticleList
          articles={cms.articles}
          mode={cms.mode}
          showDeleteArticles={cms.showDeleteArticles}
          selectedArticleIds={cms.selectedArticleIds}
          onToggleArticleSelection={cms.toggleArticleSelection}
          onStartUpdateArticle={cms.startUpdateArticle}
        />

        <AuthorList
          authors={cms.authors}
          mode={cms.mode}
          showDeleteAuthors={cms.showDeleteAuthors}
          selectedAuthorIds={cms.selectedAuthorIds}
          onToggleAuthorSelection={cms.toggleAuthorSelection}
          onStartUpdateAuthor={cms.startUpdateAuthor}
          onShowArticlesByAuthor={cms.showArticlesByAuthor}
        />
      </section>
    </main>
  );
}
