import "./Landing.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className = "landing">
      <h1>AutoMinutes</h1>

      <br />

      <p>
        AutoMinutes uses AI to automatically transcribe meetings, generate
        concise summaries, identify key decisions, and extract action
        items—so you can stay focused on the conversation instead of taking
        notes.
      </p>

      <br />

      <div className="get-started">
        <Link to="/login">
          <button>Get Started</button>
        </Link>
      </div>

    </div>
  );
}

export default Landing;