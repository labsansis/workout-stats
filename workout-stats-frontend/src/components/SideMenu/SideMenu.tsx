import { PropsWithChildren, useState } from "react";
import "./SideMenu.css"; // CSS styles for the SideMenu component
import { NavLink } from "react-router-dom";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilValue } from "recoil";
import { FiMenu } from "react-icons/fi";
import { RiCloseFill } from "react-icons/ri";
import { AiOutlineHome } from "react-icons/ai";
import { CgGym } from "react-icons/cg";
import { MdSportsGymnastics } from "react-icons/md";
import { GiMuscleUp } from "react-icons/gi";
import { IconType } from "react-icons";
import { GoUpload } from "react-icons/go";
import { RiLogoutBoxRLine, RiAccountCircleLine } from "react-icons/ri";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useRecoilValue(userState);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getUserDisplayName = () => {
    return user?.name || user?.email;
  };

  const MenuLink = ({
    to,
    icon,
    children,
  }: PropsWithChildren<MenuLinkProps>) => {
    return (
      <NavLink
        to={to}
        onClick={toggleMenu}
        className={({ isActive, isPending }) =>
          isActive || isPending ? "font-bold drop-shadow-md" : ""
        }
      >
        {icon &&
          icon({
            style: {
              display: "inline",
              width: "1.4em",
              height: "1.4em",
              marginRight: "0.2em",
              position: "relative",
              top: "-0.1em",
            },
          })}{" "}
        {children}
      </NavLink>
    );
  };

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button
        className="toggle-button rounded text-slate-200 bg-cyan-800"
        onClick={toggleMenu}
      >
        {isOpen ? <RiCloseFill /> : <FiMenu />}
      </button>
      <div className="menu-content">
        <MenuLink to="/home" icon={AiOutlineHome}>
          Home
        </MenuLink>
        <MenuLink to="/strength" icon={CgGym}>
          Strength Workouts
        </MenuLink>
        <MenuLink to="/exercises" icon={MdSportsGymnastics}>
          Exercises
        </MenuLink>
        <MenuLink to="/volume" icon={GiMuscleUp}>
          Training Volume
        </MenuLink>
        <div className="menu-user-line">{getUserDisplayName()}</div>
        {/* <MenuLink to="/account" icon={RiAccountCircleLine}>
          Account
        </MenuLink> */}
        <MenuLink to="/upload" icon={GoUpload}>
          Upload files
        </MenuLink>
        <MenuLink to="/signout" icon={RiLogoutBoxRLine}>
          Sign out
        </MenuLink>
      </div>
    </div>
  );
};

export default SideMenu;

type MenuLinkProps = {
  to: string;
  icon?: IconType;
};
