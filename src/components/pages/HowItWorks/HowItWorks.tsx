import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import {
    FiCalendar,
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
                            Schedule a meeting by entering its title, date and
                            time, then attach a transcript by uploading a file
                            or pasting the text directly.
                        </p>
                    </div>

                    <div className="step-card">
                        <FiCpu className="step-icon" />
                        <h2>2. Process with AI</h2>
                        <p>
                            Trigger AI processing right from the meeting page
                            and track its status from idle to processing to
                            completed, with the option to retry if it fails.
                        </p>
                    </div>

                    <div className="step-card">
                        <FiFileText className="step-icon" />
                        <h2>3. Review the Results</h2>
                        <p>
                            View a clean summary containing the meeting overview,
                            key discussion points, decisions and generated
                            action items.
                        </p>
                    </div>

                    <div className="step-card">
                        <FiCheckCircle className="step-icon" />
                        <h2>4. Follow Up</h2>
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