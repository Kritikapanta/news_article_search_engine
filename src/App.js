import React, { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import { searchNews } from './services/searchService';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      const data = await searchNews(query);
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchPerformed(false);
  };

  return (
    <div className="App">
      <HomePage 
        searchQuery={searchQuery}
        searchResults={searchResults}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        searchPerformed={searchPerformed}
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