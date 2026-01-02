import React from 'react';
import './LandingPage.css';
import SearchBar from '../SearchBar/SearchBar';

function LandingPage({ onSearch }) {
  return (
    <div className="landing-page">
      {/* Large transparent background image */}
      <div className="hero-background">
        <img 
          src="/assets/big_picture.png" 
          alt="Background" 
          className="background-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=600&fit=crop";
          }}
        />
        <div className="overlay"></div>
      </div>
      
      {/* Search section */}
      <div className="search-container">
        <div className="search-section">
          <SearchBar onSearch={onSearch} />
          
          {/* Small temple image */}
          <div className="small-image-container">
            <img 
              src="/assets/big_picture.png" 
              alt="Temple" 
              className="small-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop";
              }}
            />
          </div>
          
          {/* NYAT-Search text */}
          <div className="nyat-search-text">
            <h1>NYAT-Search</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;