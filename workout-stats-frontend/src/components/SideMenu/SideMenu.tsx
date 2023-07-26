import React, { MouseEventHandler, useState } from "react";
import "./SideMenu.css"; // CSS styles for the SideMenu component
import { Link } from "react-router-dom";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={toggleMenu}>
        {isOpen ? "Close" : "Menu"}
      </button>
      <div className="menu-content">
        <Link to="/home">Home</Link>
        <Link to="/strength">Strength Workouts</Link>
        <Link to="/exercises">Exercises</Link>
      </div>
    </div>
  );
};

export default SideMenu;
