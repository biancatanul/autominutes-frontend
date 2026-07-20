import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import * as meetingsApi from "@/lib/meetings";
import * as attendeesApi from "@/lib/attendees";
import type { Meeting } from "@/lib/meetings";
import type { Attendee } from "@/lib/attendees";
import { useMeetings } from "@/context/MeetingsContext";
import "./MeetingDetail.css";

function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { removeMeeting } = useMeetings();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [attendeesLoading, setAttendeesLoading] = useState(true);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeeRole, setAttendeeRole] = useState("");
  const [attendeeError, setAttendeeError] = useState<string | null>(null);

  const [transcript, setTranscriptText] = useState("");
  const [savingTranscript, setSavingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [transcriptSaved, setTranscriptSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    meetingsApi
      .getMeeting(id)
      .then(setMeeting)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load meeting."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setAttendeesLoading(true);
    attendeesApi
      .getAttendees(id)
      .then(setAttendees)
      .catch(() => setAttendeeError("Failed to load attendees."))
      .finally(() => setAttendeesLoading(false));
  }, [id]);

  const handleDeleteMeeting = async () => {
    if (!id || !meeting) return;
    if (!window.confirm(`Delete meeting "${meeting.title}"? This can't be undone.`)) return;
    await removeMeeting(id);
    navigate("/meetings");
  };

  const handleAddAttendee = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!attendeeName.trim()) {
      setAttendeeError("Name is required.");
      return;
    }

    setAttendeeError(null);
    try {
      const created = await attendeesApi.createAttendee({
        name: attendeeName.trim(),
        email: attendeeEmail.trim() || undefined,
        role: attendeeRole.trim() || undefined,
        meetingId: id,
      });
      setAttendees((prev) => [...prev, created]);
      setAttendeeName("");
      setAttendeeEmail("");
      setAttendeeRole("");
    } catch (err) {
      setAttendeeError(err instanceof Error ? err.message : "Failed to add attendee.");
    }
  };

  const handleRemoveAttendee = async (attendeeId: string, name: string) => {
    if (!window.confirm(`Remove ${name} from this meeting?`)) return;
    await attendeesApi.deleteAttendee(attendeeId);
    setAttendees((prev) => prev.filter((a) => a._id !== attendeeId));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTranscriptText(typeof reader.result === "string" ? reader.result : "");
      setTranscriptSaved(false);
    };
    reader.readAsText(file);
  };

  const handleSaveTranscript = async () => {
    if (!id) return;
    if (!transcript.trim()) {
      setTranscriptError("Transcript can't be empty.");
      return;
    }

    setSavingTranscript(true);
    setTranscriptError(null);
    try {
      const updated = await meetingsApi.setTranscript(id, transcript);
      setMeeting(updated);
      setTranscriptSaved(true);
    } catch (err) {
      setTranscriptError(err instanceof Error ? err.message : "Failed to save transcript.");
    } finally {
      setSavingTranscript(false);
    }
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

            <button className="delete-btn" onClick={handleDeleteMeeting}>
              Delete meeting
            </button>

             <section className="detail-section">
              <h2>Attendees</h2>

              {attendeesLoading ? (
                <p>Loading attendees...</p>
              ) : attendees.length === 0 ? (
                <p className="muted">No attendees added yet.</p>
              ) : (
                <ul className="attendee-list">
                  {attendees.map((a) => (
                    <li key={a._id}>
                      <span className="attendee-name">{a.name}</span>
                      {a.role && <span className="attendee-role">{a.role}</span>}
                      {a.email && <span className="attendee-email">{a.email}</span>}
                      <button onClick={() => handleRemoveAttendee(a._id, a.name)}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}

              <form className="attendee-form" onSubmit={handleAddAttendee}>
                <input
                  placeholder="Name"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                />
                <input
                  placeholder="Email (optional)"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                />
                <input
                  placeholder="Role (optional)"
                  value={attendeeRole}
                  onChange={(e) => setAttendeeRole(e.target.value)}
                />
                <button type="submit">Add attendee</button>
              </form>

              {attendeeError && <p className="error">{attendeeError}</p>}
            </section>

            <section className="detail-section">
              <h2>Transcript</h2>

              <input type="file" accept=".txt" onChange={handleFileUpload} />

              <textarea
                className="transcript-input"
                placeholder="Paste the meeting transcript here, or upload a .txt file above"
                value={transcript}
                onChange={(e) => {
                  setTranscriptText(e.target.value);
                  setTranscriptSaved(false);
                }}
                rows={10}
              />

              <button onClick={handleSaveTranscript} disabled={savingTranscript}>
                {savingTranscript ? "Saving..." : "Save transcript"}
              </button>

              {transcriptSaved && <p className="success">Transcript saved.</p>}
              {transcriptError && <p className="error">{transcriptError}</p>}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default MeetingDetail;