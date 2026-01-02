import React from 'react';
import './SearchResults.css';

function SearchResults({ results, query }) {
  if (!results || results.length === 0) {
    return (
      <div className="no-results">
        <p>No results found for "{query}". Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h2>Search Results for "{query}"</h2>
        <p className="results-count">{results.length} results found</p>
      </div>
      
      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className="result-card">
            <div className="result-source">
              <span className="source-name">{result.source}</span>
              {result.isGov && <span className="gov-badge">(.gov)</span>}
              <span className="result-date">{result.date}</span>
            </div>
            
            <h3 className="result-title">
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </h3>
            
            <div className="result-url">
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.url}
              </a>
            </div>
            
            <p className="result-snippet">{result.snippet}</p>
            
            <div className="result-footer">
              <span className="read-time">{result.readTime}</span>
              {result.sections && result.sections.length > 0 && (
                <div className="result-sections">
                  {result.sections.map((section, i) => (
                    <span key={i} className="section-tag">{section}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;