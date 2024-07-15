import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

function Header() {
  return (
    <header className="header">
      <Link to="/dashboard" className="logo-container">
        <div className="logo"></div>
      </Link>
    </header>
  );
}

export default Header;
