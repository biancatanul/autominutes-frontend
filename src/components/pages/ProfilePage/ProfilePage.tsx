import { useState } from "react";
import {
    FiUser,
    FiMail,
    FiShield,
    FiEdit2,
    FiX,
    FiArrowLeft,
    FiLock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "@organisms/Header/Header";
import Sidebar from "@organisms/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { PROFILE_ICONS, getProfileIcon } from "@/lib/profileIcons";
import "./ProfilePage.css";

function ProfilePage() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [name, setName] = useState(user?.name || "");
    const [selectedIcon, setSelectedIcon] = useState(user?.avatarIcon || "user");
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    if (!user) {
        return (
            <div className="profile-page">
                <p>Loading profile...</p>
            </div>
        );
    }

    const icons = PROFILE_ICONS;

    const resetPasswordModal = () => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError(null);
        setPasswordSuccess(null);
    };

    const handleSave = async () => {
        setProfileError(null);
        setSavingProfile(true);

        try {
            const response = await apiFetch("/auth/me", {
                method: "PATCH",
                body: JSON.stringify({ name, avatarIcon: selectedIcon }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || "Failed to update profile");
            }

            const updated = await response.json();
            updateUser(updated);
            setShowEditModal(false);
        } catch (err) {
            setProfileError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError(null);
        setPasswordSuccess(null);

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        setSavingPassword(true);

        try {
            const response = await apiFetch("/auth/me/password", {
                method: "PATCH",
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || "Failed to change password");
            }

            setPasswordSuccess("Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : "Failed to change password");
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="profile-page">

            <Sidebar />

            <main className="profile-content">

                <Header title="Profile" />

                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                    Back
                </button>

                <div className="profile-container">

                    <div className="profile-header">

                        <div className="profile-avatar">
                            {getProfileIcon(user.avatarIcon) ?? <FiUser />}
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
                                setSelectedIcon(user.avatarIcon || "user");
                                setProfileError(null);
                                setShowEditModal(true);
                            }}
                        >
                            <FiEdit2 />
                            Edit Profile
                        </button>

                        <button
                            className="profile-btn secondary"
                            onClick={() => setShowPasswordModal(true)}
                        >
                            <FiLock />
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

                            {profileError && <p className="modal-error">{profileError}</p>}

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
                                disabled={!name.trim() || savingProfile}
                            >
                                {savingProfile ? "Saving..." : "Save Changes"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* Change Password Modal */}

            {showPasswordModal && (
                <div
                    className="profile-modal-overlay"
                    onClick={resetPasswordModal}
                >
                    <div
                        className="profile-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-header">
                            <div>
                                <h2>Change Password</h2>
                                <p>Enter your current password and a new one</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={resetPasswordModal}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="modal-content">

                            <label>Current Password</label>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />

                            <label>New Password</label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="At least 6 characters"
                            />

                            <label>Confirm New Password</label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                            />

                            {passwordError && <p className="modal-error">{passwordError}</p>}
                            {passwordSuccess && <p className="modal-success">{passwordSuccess}</p>}

                        </div>

                        <div className="modal-actions">

                            <button
                                className="modal-btn cancel"
                                onClick={resetPasswordModal}
                            >
                                Close
                            </button>

                            <button
                                className="modal-btn save"
                                onClick={handleChangePassword}
                                disabled={
                                    !currentPassword ||
                                    newPassword.length < 6 ||
                                    !confirmPassword ||
                                    savingPassword
                                }
                            >
                                {savingPassword ? "Saving..." : "Update Password"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default ProfilePage;