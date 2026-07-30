import { useState } from "react";
import {
    FiUser,
    FiMail,
    FiShield,
    FiEdit2,
    FiX,
    FiSmile,
    FiStar,
    FiHeart,
    FiZap,
} from "react-icons/fi";

import Header from "@organisms/Header/Header";
import Sidebar from "@organisms/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import "./ProfilePage.css";

function ProfilePage() {
    const { user } = useAuth();

    const [showEditModal, setShowEditModal] = useState(false);

    const [name, setName] = useState(user?.name || "");
    const [selectedIcon, setSelectedIcon] = useState("user");

    if (!user) {
        return (
            <div className="profile-page">
                <p>Loading profile...</p>
            </div>
        );
    }

    const icons = [
        { id: "user", icon: <FiUser /> },
        { id: "smile", icon: <FiSmile /> },
        { id: "star", icon: <FiStar /> },
        { id: "heart", icon: <FiHeart /> },
        { id: "zap", icon: <FiZap /> },
    ];

    const handleSave = () => {
        // We'll connect this to the backend later
        console.log("New name:", name);
        console.log("New icon:", selectedIcon);

        setShowEditModal(false);
    };

    return (
        <div className="profile-page">

            <Sidebar />

            <main className="profile-content">

                <Header title="Profile" />

                <div className="profile-container">

                    <div className="profile-header">

                        <div className="profile-avatar">
                            {icons.find((icon) => icon.id === selectedIcon)?.icon}
                        </div>

                        <div className="profile-details">
                            <h1>{user.name}</h1>
                            <p>AutoMinutes User</p>
                        </div>

                    </div>

                    <div className="profile-info">

                        <div className="info-item">
                            <div className="info-icon">
                                <FiUser />
                            </div>

                            <div>
                                <label>Name</label>
                                <span>{user.name}</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <FiMail />
                            </div>

                            <div>
                                <label>Email</label>
                                <span>{user.email}</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <FiShield />
                            </div>

                            <div>
                                <label>Account</label>
                                <span>Active</span>
                            </div>
                        </div>

                    </div>

                    <div className="profile-actions">

                        <button
                            className="profile-btn primary"
                            onClick={() => {
                                setName(user.name);
                                setShowEditModal(true);
                            }}
                        >
                            <FiEdit2 />
                            Edit Profile
                        </button>

                        <button className="profile-btn secondary">
                            Change Password
                        </button>

                    </div>

                </div>

            </main>

            {/* Edit Profile Modal */}

            {showEditModal && (
                <div
                    className="profile-modal-overlay"
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        className="profile-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-header">
                            <div>
                                <h2>Edit Profile</h2>
                                <p>Update your profile information</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="modal-content">

                            <label>Display Name</label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />

                            <label>Choose an icon</label>

                            <div className="icon-picker">
                                {icons.map((item) => (
                                    <button
                                        key={item.id}
                                        className={
                                            selectedIcon === item.id
                                                ? "icon-option selected"
                                                : "icon-option"
                                        }
                                        onClick={() =>
                                            setSelectedIcon(item.id)
                                        }
                                    >
                                        {item.icon}
                                    </button>
                                ))}
                            </div>

                        </div>

                        <div className="modal-actions">

                            <button
                                className="modal-btn cancel"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="modal-btn save"
                                onClick={handleSave}
                                disabled={!name.trim()}
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default ProfilePage;