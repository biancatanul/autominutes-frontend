import {
  FiHome,
  FiVideo,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span>Logo</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiHome size={22} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/meetings"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiVideo size={22} />
          <span>Meetings</span>
        </NavLink>

        <NavLink
          to="/how-it-works"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiHelpCircle size={22} />
          <span>How it works</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiSettings size={22} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;