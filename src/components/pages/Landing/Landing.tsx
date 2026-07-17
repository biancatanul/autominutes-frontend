import "./Landing.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing">
      <h1>AutoMinutes</h1>
      <div className="landing-actions">
        <Link to="/Login" className="landing-button landing-button-secondary">
          Log In
        </Link>
        <Link to="/Signup" className="landing-button landing-button-primary">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Landing;