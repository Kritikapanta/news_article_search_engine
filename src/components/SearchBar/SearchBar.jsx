import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleIconClick = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search for anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="search-icon" onClick={handleIconClick}>
            🔍
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;