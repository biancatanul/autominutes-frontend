import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import {
    FiCalendar,
    FiMic,
    FiCpu,
    FiFileText,
    FiCheckCircle,
} from "react-icons/fi";
import "./HowItWorks.css";

function HowItWorks() {
    return (
        <div className="how-page">
            <Sidebar />

            <main className="how-content">
                <Header title="How AutoMinutes Works" />


                <p className="subtitle">
                    Turn your meetings into organized notes, summaries and action
                    items in just a few clicks.
                </p>

                <div className="steps">

                    <div className="step-card">
                        <FiCalendar className="step-icon" />
                        <h2>1. Create a Meeting</h2>
                        <p>
                            Schedule a meeting by entering its title, date, time
                            and optional description.
                        </p>
                    </div>

                    <div className="step-card">
                        <FiMic className="step-icon" />
                        <h2>2. Upload Transcript</h2>
                        <p>
                            Import a transcript after your meeting.
                            AutoMinutes accepts meeting transcripts for AI
                            processing.
                        </p>
                    </div>

                    <div className="step-card">
                        <FiCpu className="step-icon" />
                        <h2>3. AI Processing</h2>
                        <p>
                            Our AI analyzes the conversation, identifies key
                            discussion points, extracts decisions and recognizes
                            important action items.
                        </p>
                    </div>

                    <div className="step-card">
                        <FiFileText className="step-icon" />
                        <h2>4. Review Summary</h2>
                        <p>
                            View a clean summary containing the meeting overview,
                            transcript and generated notes.
                        </p>
                    </div>

                    <div className="step-card">
                        <FiCheckCircle className="step-icon" />
                        <h2>5. Follow Up</h2>
                        <p>
                            Track action items and share meeting notes with your
                            team to ensure nothing gets missed.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default HowItWorks;