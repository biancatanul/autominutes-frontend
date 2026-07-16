import "./Signup.css";
import { Link } from "react-router-dom";


function Signup() {
    return (
        <div className = "signup-page">
            <div className = "signup-form">
                <h1>Sign Up</h1>
                <input
                    type = "email"
                    placeholder = "Email"
                />
                <input
                    type = "password"
                    placeholder = "Password"
                />
                <input
                    type = "password"
                    placeholder = "Confirm Password"
                />
                <button>
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