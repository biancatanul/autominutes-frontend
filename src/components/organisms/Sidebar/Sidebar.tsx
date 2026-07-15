import {
  FiHome,
  FiVideo,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";   // run npm install react-icons 
import "./Sidebar.css";
import { useNavigate } from "react-router-dom"; // run npm install react-router-dom

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="logo">
        <span>Logo</span>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active"
            onClick={() => navigate("/")}>
          <FiHome size={22} />  
          <span>Home</span> 
        </button>

        <button className="nav-item"
            onClick={() => navigate("/meetings")}>
          <FiVideo size={22} />
          <span>Meetings</span>
        </button>

        <button className="nav-item"
            onClick={() => navigate("/how-it-works")}>
          <FiHelpCircle size={22} />
          <span>How it works</span>
        </button>

        <button className="nav-item"
            onClick={() => navigate("/settings")}>
          <FiSettings size={22} />
          <span>Settings</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;