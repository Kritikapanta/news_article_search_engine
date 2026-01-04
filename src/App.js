import React, { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import { searchNews } from './services/searchService';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Updated handleSearch to support page
  const handleSearch = async (query, page = 1) => {
    if (!query.trim()) return;

    setSearchQuery(query);
    setIsLoading(true);
    setSearchPerformed(true);
    setCurrentPage(page);

    try {
      const data = await searchNews(query, page);
      setSearchResults(data.results || []);
      setTotalPages(data.total_pages || 1);  // set total pages for pagination
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchPerformed(false);
    setCurrentPage(1);
    setTotalPages(1);
  };

  return (
    <div className="App">
      <HomePage 
        searchQuery={searchQuery}
        searchResults={searchResults}
        onSearch={handleSearch}       // passes query and page
        onClearSearch={handleClearSearch}
        searchPerformed={searchPerformed}
        currentPage={currentPage}     // pass to HomePage
        totalPages={totalPages}       // pass to HomePage
      />
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Searching for "{searchQuery}"...</p>
        </div>
      )}
    </div>
  );
}

export default App;
