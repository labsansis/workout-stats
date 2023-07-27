import React, { MouseEventHandler, useEffect, useState } from "react";
import "./SideMenu.css"; // CSS styles for the SideMenu component
import { Link, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../firebase";
import { signOut } from "firebase/auth";
import useFirebaseAuthentication from "../../common/hooks/useFirebaseAuthentication";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const fbsUser = useFirebaseAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("fbs user");
    console.log(fbsUser);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut(firebaseAuth);
    navigate("/");
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
        <div className="menu-user-line bg-[#d1fae5]">
          {fbsUser?.displayName || fbsUser?.email}
        </div>
        <Link to="/" onClick={handleSignoutClick}>
          Sign out
        </Link>
      </div>
    </div>
  );
};

export default SideMenu;
