import React from 'react';
import Header from '../components/Header/Header';
import LandingPage from '../components/LandingPage/LandingPage';
import SearchResults from '../components/SearchResults/SearchResults';
import SearchBar from '../components/SearchBar/SearchBar';
import './HomePage.css';

function HomePage({
  searchQuery,
  searchResults,
  onSearch,
  onClearSearch,
  searchPerformed,
  currentPage = 1,
  totalPages = 1
}) {
  const handleLogoClick = () => {
    if (searchPerformed) {
      onClearSearch();
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onSearch(searchQuery, page);
    }
  };

  return (
    <div className="home-page">
      <Header onLogoClick={handleLogoClick} />

      {searchPerformed ? (
        <div className="results-page">
          <div className="results-container">
            {/* Search bar on results page */}
            <div className="results-search-bar">
              <SearchBar onSearch={onSearch} initialQuery={searchQuery} />
            </div>

            {/* Back to home link */}
            <button
              className="back-to-home"
              onClick={onClearSearch}
              style={{
                margin: '20px 0',
                background: 'none',
                border: 'none',
                color: '#0066FF',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ← Back to Home
            </button>

            {/* Search results */}
            <SearchResults results={searchResults} query={searchQuery} />

            {/* Pagination (ONLY ADDITION) */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  margin: '30px 0'
                }}
              >
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        background: page === currentPage ? '#0066FF' : '#fff',
                        color: page === currentPage ? '#fff' : '#000',
                        cursor: 'pointer',
                        fontWeight: page === currentPage ? 'bold' : 'normal'
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            )}
            {/* Pagination ends */}
          </div>
        </div>
      ) : (
        <LandingPage onSearch={onSearch} />
      )}
    </div>
  );
}

export default HomePage;
