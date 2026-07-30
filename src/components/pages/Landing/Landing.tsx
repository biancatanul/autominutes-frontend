import "./Landing.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing">
      <div className="landing-blobs" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <div className="landing-content">
        <span className="eyebrow">AI-powered meeting notes</span>

        <h1>
          Auto<span className="accent">Minutes</span>
        </h1>

        <p>
          AutoMinutes uses AI to automatically transcribe meetings, generate
          concise summaries, identify key decisions, and extract action
          items, so you can stay focused on the conversation instead of
          taking notes.
        </p>

        <div className="get-started">
          <Link to="/login">
            <button>Get started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;