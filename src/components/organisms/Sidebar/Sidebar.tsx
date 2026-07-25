import {
  FiHome,
  FiVideo,
  FiHelpCircle,
  FiCheckSquare,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Button from "@atoms/Button/Button";
import NewMeetingModal from "@organisms/NewMeetingModal/NewMeetingModal";
import "./Sidebar.css";

function Sidebar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <aside className="sidebar">
      <div className="logo">
        <span>AutoMinutes</span>
      </div>

      <Button text="+ New Meeting" onClick={() => setShowModal(true)} />

      <nav className="sidebar-nav">
        <NavLink
          to="/home"
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
          to="/action-items"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiCheckSquare size={22} />
          <span>Action Items</span>
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

      </nav>
      {showModal && <NewMeetingModal onClose={() => setShowModal(false)} />}
    </aside>
  );
}

export default Sidebar;