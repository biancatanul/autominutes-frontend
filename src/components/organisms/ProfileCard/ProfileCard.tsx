import "./ProfileCard.css";
import Button from "../../atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

function ProfileCard() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

     if (!user) return null;

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate("/");
    };

    const initials = user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    return (
        <div className="profile-card">
            <button className="profile-card-trigger" onClick={() => setMenuOpen((open) => !open)}>
                <span className="profile-card-avatar">{initials}</span>
                <span>{user.name}</span>
            </button>

            {menuOpen && (
                <div className="profile-menu">
                    <button onClick={() => { setMenuOpen(false); navigate("/profile"); }}>
                        View Profile
                    </button>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileCard;