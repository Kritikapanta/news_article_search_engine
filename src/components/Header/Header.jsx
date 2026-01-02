import React from 'react';
import './Header.css';

function Header({ onLogoClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
          <img 
            src="/assets/logo.png" 
            alt="NYAT-POLE Logo" 
            className="logo" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/40x40/3498db/ffffff?text=NP";
            }}
          />
        </div>
        
        <div className="right-section">
          <button className="nav-icon">
            <span className="home-icon">Home</span>
          </button>
          <button className="user-profile">
            <div className="profile-circle">
              <span className="person-icon">👤</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;