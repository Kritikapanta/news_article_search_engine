import React from 'react';
import Header from '../components/Header/Header';
import LandingPage from '../components/LandingPage/LandingPage';
import SearchResults from '../components/SearchResults/SearchResults';
import SearchBar from '../components/SearchBar/SearchBar';
import './HomePage.css';

function HomePage({ searchQuery, searchResults, onSearch, onClearSearch, searchPerformed }) {
  const handleLogoClick = () => {
    if (searchPerformed) {
      onClearSearch();
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
          </div>
        </div>
      ) : (
        <LandingPage onSearch={onSearch} />
      )}
    </div>
  );
}

export default HomePage;