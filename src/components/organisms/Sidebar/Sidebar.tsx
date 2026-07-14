import {
  FiHome,
  FiVideo,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";   // run npm install react-icons 
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span>Logo</span>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active">
          <FiHome size={22} />
          <span>Home</span>
        </button>

        <button className="nav-item">
          <FiVideo size={22} />
          <span>Meetings</span>
        </button>

        <button className="nav-item">
          <FiHelpCircle size={22} />
          <span>How it works</span>
        </button>

        <button className="nav-item">
          <FiSettings size={22} />
          <span>Settings</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;