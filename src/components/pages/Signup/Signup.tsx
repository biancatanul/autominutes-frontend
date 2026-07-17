import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../../../lib/api";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const response = await apiFetch("/auth/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            alert("Signup failed");
            return;
        }

        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);

        navigate("/");
    };

    return (
        <div className = "signup-page">
            <div className = "signup-form">
                <h1>Sign Up</h1>
                <input
                    type = "text"
                    placeholder = "Name"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
                />
                <input
                    type = "email"
                    placeholder = "Email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                />
                <input
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <input
                    type = "password"
                    placeholder = "Confirm Password"
                    value = {confirmPassword}
                    onChange = {(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick = {handleSignup}>
                    Sign Up
                </button>
                <p>
                    Already have an account? <Link to = "/Login" className="form-link">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;