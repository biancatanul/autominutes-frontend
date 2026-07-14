import {
  FiVideo,
  FiMic,
  FiUploadCloud,
} from "react-icons/fi";

import "./MeetingOptions.css";

export default function MeetingOptions() {
  return (
    <div className="meeting-options">
      <button className="option-btn">
        <FiVideo size={22} />
        <span>Online Meeting</span>
      </button>

      <button className="option-btn">
        <FiMic size={22} />
        <span>In-person Meeting</span>
      </button>

      <button className="option-btn">
        <FiUploadCloud size={22} />
        <span>Upload Meeting</span>
      </button>
    </div>
  );
}