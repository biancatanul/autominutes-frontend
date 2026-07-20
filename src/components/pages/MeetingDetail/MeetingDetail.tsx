import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import * as meetingsApi from "@/lib/meetings";
import type { Meeting } from "@/lib/meetings";
import { useMeetings } from "@/context/MeetingsContext";
import "./MeetingDetail.css";

function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { removeMeeting } = useMeetings();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    meetingsApi
      .getMeeting(id)
      .then(setMeeting)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load meeting."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id || !meeting) return;
    if (!window.confirm(`Delete meeting "${meeting.title}"? This can't be undone.`)) return;
    await removeMeeting(id);
    navigate("/meetings");
  };

  return (
    <div className="meeting-detail-page">
      <Sidebar />
      <main className="meeting-detail-content">
        <Header />

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {meeting && (
          <>
            <div className="meeting-detail-header">
              <h1>{meeting.title}</h1>
              <span className={`status-badge status-${meeting.processingStatus}`}>
                {meeting.processingStatus}
              </span>
            </div>

            <p className="meeting-detail-date">
              {new Date(meeting.datetime).toLocaleString()}
            </p>

            {meeting.description && <p>{meeting.description}</p>}

            <button className="delete-btn" onClick={handleDelete}>
              Delete meeting
            </button>

            {/* Attendees, transcript upload, and AI results sections to do */}
          </>
        )}
      </main>
    </div>
  );
}

export default MeetingDetail;