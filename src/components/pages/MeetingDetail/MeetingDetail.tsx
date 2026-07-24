import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import * as meetingsApi from "@/lib/meetings";
import * as attendeesApi from "@/lib/attendees";
import type { Meeting } from "@/lib/meetings";
import type { Attendee } from "@/lib/attendees";
import { useMeetings } from "@/context/MeetingsContext";
import * as processingApi from "@/lib/processing";
import * as actionItemsApi from "@/lib/actionItems";
import type { AiResult } from "@/lib/processing";
import type { ActionItem, ActionItemStatus } from "@/lib/actionItems";
import "./MeetingDetail.css";
import ActionItemsList from "@organisms/ActionItemsList/ActionItemsList";
import { formatDateTime } from "@/lib/formatDate";

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
  const [attendeeRole, setAttendeeRole] = useState("");
  const [attendeeError, setAttendeeError] = useState<string | null>(null);

  const [transcript, setTranscriptText] = useState("");
  const [savingTranscript, setSavingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [transcriptSaved, setTranscriptSaved] = useState(false);

  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [actionItemsLoading, setActionItemsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    meetingsApi
      .getMeeting(id)
      .then((data) => {
        setMeeting(data);
        setTranscriptText(data.transcript ?? "");
      })
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

  useEffect(() => {
    if (!id) return;
    setActionItemsLoading(true);
    actionItemsApi
      .getActionItems(id)
      .then(setActionItems)
      .catch(() => {
        // page still works without a pre-existing list
      })
      .finally(() => setActionItemsLoading(false));

    // results endpoint returns every version ever generated, sorted newest-first
    processingApi
      .getResults(id)
      .then((results) => {
        if (results.length > 0) setAiResult(results[0]);
      })
      .catch(() => {});
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
        role: attendeeRole.trim() || undefined,
        meetingId: id,
      });
      setAttendees((prev) => [...prev, created]);
      setAttendeeName("");
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
  const handleProcess = async () => {
    if (!id || !meeting) return;
    if (!meeting.transcript?.trim()) {
      setProcessingError("Save a transcript before processing.");
      return;
    }

    setProcessing(true);
    setProcessingError(null);
    try {
      const result = await processingApi.processMeeting(id);
      setAiResult(result.aiResult);
      setActionItems(result.actionItems);
      if (result.attendees.length > 0) {
        setAttendees((prev) => [...prev, ...result.attendees]);
    }
      setMeeting((prev) => (prev ? { ...prev, processingStatus: result.status } : prev));
    } catch (err) {
      setProcessingError(err instanceof Error ? err.message : "Processing failed.");
      setMeeting((prev) => (prev ? { ...prev, processingStatus: "failed" } : prev));
    } finally {
      setProcessing(false);
    }
  };

  const handleActionItemStatusChange = async (itemId: string, status: ActionItemStatus) => {
    const updated = await actionItemsApi.updateActionItem(itemId, { status });
    setActionItems((prev) => prev.map((item) => (item._id === itemId ? updated : item)));
  };

  const handleDeleteActionItem = async (itemId: string, description: string) => {
    if (!window.confirm(`Delete action item "${description}"?`)) return;
    await actionItemsApi.deleteActionItem(itemId);
    setActionItems((prev) => prev.filter((item) => item._id !== itemId));
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
              {formatDateTime(meeting.datetime)}
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

            <section className="detail-section">
              <h2>AI Processing</h2>

              <button onClick={handleProcess} disabled={processing || !transcript.trim()}>
                {processing ? "Processing..." : aiResult ? "Reprocess transcript" : "Process transcript"}
              </button>

              {processingError && (
                <p className="error">
                  {processingError}{" "}
                  <button onClick={handleProcess} disabled={processing}>Retry</button>
                </p>
              )}

              {aiResult && (
                <div className="ai-results">
                  <h3>Summary</h3>
                  <p>{aiResult.summary}</p>

                  {aiResult.discussionPoints.length > 0 && (
                    <>
                      <h3>Discussion Points</h3>
                      <ul>
                        {aiResult.discussionPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </section>

            <section className="detail-section">
              <h2>Action Items ({actionItems.length})</h2>

              {actionItemsLoading ? (
                <p>Loading action items...</p>
              ) : actionItems.length === 0 ? (
                <p className="muted">No action items yet. Process the transcript to generate some.</p>
              ) : (
                <ActionItemsList
                  items={actionItems}
                  onStatusChange={handleActionItemStatusChange}
                  onDelete={handleDeleteActionItem}
                />
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default MeetingDetail;