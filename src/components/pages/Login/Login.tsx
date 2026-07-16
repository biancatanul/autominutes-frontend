import { Link } from "react-router-dom";
import "./Login.css";
import { useState } from "react";


type LoginProps = {
    onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            alert("Login failed");
            return;
        }

        // const user = await response.json();

        // console.log("User logged in:", user);

        onLogin(); 
    };

    return (
        <div className = "login-page">
            <div className = "login-form">
                <h1>Sign In</h1>
                <input
                    type = "email"
                    placeholder = "Email"
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
                
                <Link to = "/forgot-password" className = "forgot-password">
                    Forgot Password?
                </Link>

                <button onClick = {handleLogin}>
                    Sign In
                </button>
                <p>New to our platform? <Link to = "/Signup" className = "signup-link">Join now</Link></p>
            </div>

            
        </div>
    );
}

export default Login;