import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import DarkModeToggle from "../../atoms/DarkModeToggle/DarkModeToggle";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setIsDark(prev => {
            const newValue = !prev;
            localStorage.setItem("theme", newValue ? "dark" : "light");
            document.body.classList.toggle("dark", newValue);
            return newValue;
        });
    };

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await apiFetch("/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                alert(data?.message || "Signup failed");
                return;
            }

            const data = await response.json();

            login(data.access_token, data.user);
            navigate("/home");

        } catch (error) {
            console.error(error);
            alert("Could not connect to the server.");
        }
    };

    return (
        <div className={`signup-page ${isDark ? "dark-mode" : ""}`}>

            <div className="signup-dark-mode">
                <DarkModeToggle
                    isDark={isDark}
                    onToggle={toggleDarkMode}
                />
            </div>

            <div className="signup-form">

                <h1>Sign Up</h1>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={handleSignup}>
                    Sign Up
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/Login" className="form-link">
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Signup;