import React, { MouseEventHandler, useState } from "react";
import "./SideMenu.css"; // CSS styles for the SideMenu component

const SideMenu = ({ switchPage }: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (pageId: string) => {
    return (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      switchPage(pageId);
    };
  };

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={toggleMenu}>
        {isOpen ? "Close" : "Menu"}
      </button>
      <div className="menu-content">
        <a href="#" onClick={handleClick("home")}>
          Home
        </a>
        <a href="#" onClick={handleClick("strength")}>
          Strength Workouts
        </a>
        <a href="#" onClick={handleClick("exercises")}>
          Exercises
        </a>
      </div>
    </div>
  );
};

type SideMenuProps = {
  switchPage: (pageId: string) => void;
};

export default SideMenu;
