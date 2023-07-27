import { useState } from "react";
import "./SideMenu.css"; // CSS styles for the SideMenu component
import { Link } from "react-router-dom";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilValue } from "recoil";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useRecoilValue(userState);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getUserDisplayName = () => {
    return user?.name || user?.email;
  };

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={toggleMenu}>
        {isOpen ? "Close" : "Menu"}
      </button>
      <div className="menu-content">
        <Link to="/home" onClick={toggleMenu}>
          Home
        </Link>
        <Link to="/strength" onClick={toggleMenu}>
          Strength Workouts
        </Link>
        <Link to="/exercises" onClick={toggleMenu}>
          Exercises
        </Link>
        <div className="menu-user-line bg-[#d1fae5]">
          {getUserDisplayName()}
        </div>
        <Link to="/upload" onClick={toggleMenu}>
          Upload files
        </Link>
        <Link to="/signout">Sign out</Link>
      </div>
    </div>
  );
};

export default SideMenu;
