import "./ProfileCard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

function ProfileCard() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

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
         <div className="profile-card" ref={cardRef}>
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