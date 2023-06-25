import React, { useState } from 'react';
import './SideMenu.css'; // CSS styles for the SideMenu component

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`side-menu ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={toggleMenu}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <div className="menu-content">
          <a href="/">Home</a>
        <a href="/summary">Summary</a>
        <a href="/logout">Log out</a>      </div>
    </div>
  );
};

export default SideMenu;