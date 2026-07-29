import {
  FiHome,
  FiVideo,
  FiHelpCircle,
  FiCheckSquare,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@atoms/Button/Button";
import NewMeetingModal from "@organisms/NewMeetingModal/NewMeetingModal";
import "./Sidebar.css";

function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <button
        type="button"
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <FiMenu size={22} />
      </button>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobile} aria-hidden="true" />
      )}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <button
          type="button"
          className="sidebar-close"
          onClick={closeMobile}
          aria-label="Close menu"
        >
          <FiX size={20} />
        </button>

        <div className="logo">
          <span>AutoMinutes</span>
        </div>

        <Button
          text="+ New Meeting"
          onClick={() => {
            setShowModal(true);
            closeMobile();
          }}
        />

        <nav className="sidebar-nav">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={closeMobile}
          >
            <FiHome size={22} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/meetings"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={closeMobile}
          >
            <FiVideo size={22} />
            <span>Meetings</span>
          </NavLink>

          <NavLink
            to="/action-items"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={closeMobile}
          >
            <FiCheckSquare size={22} />
            <span>Action Items</span>
          </NavLink>

          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={closeMobile}
          >
            <FiHelpCircle size={22} />
            <span>How it works</span>
          </NavLink>

        </nav>
      </aside>
      {showModal && <NewMeetingModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Sidebar;