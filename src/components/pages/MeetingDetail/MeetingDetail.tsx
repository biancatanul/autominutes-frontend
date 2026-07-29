import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { formatDateTime, formatDate, formatTime } from "@/lib/formatDate";
import { FiCalendar, FiClock } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import Spinner from "@atoms/Spinner/Spinner";

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
      setActionItems((prev) => {
        const merged = new Map(prev.map((item) => [item._id, item]));
        for (const item of result.actionItems) {
          merged.set(item._id, item);
        }
        return Array.from(merged.values());
      });
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

  const handleUpdateActionItem = async (itemId: string, updates: Parameters<typeof actionItemsApi.updateActionItem>[1]) => {
    const updated = await actionItemsApi.updateActionItem(itemId, updates);
    setActionItems((prev) => prev.map((item) => (item._id === itemId ? updated : item)));
  };

  const SUPPORTED_TEXT = /\.(txt|md|csv|vtt|srt)$/i;

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setTranscriptError(null);

  try {
    let text: string;

    if (file.name.toLowerCase().endsWith(".docx")) {
      //mammoth to parse .docx
      const mammoth = (await import("mammoth")).default ?? (await import("mammoth"));
      const { value } = await mammoth.extractRawText({
        arrayBuffer: await file.arrayBuffer(),
      });
      text = value;
    } else if (SUPPORTED_TEXT.test(file.name)) {
      text = await file.text();
    } else {
      setTranscriptError(
        `"${file.name}" is unsupported. Please upload a .txt, .md, or .docx file.`,
      );
      e.target.value = "";
      return;
    }

    if (!text.trim()) {
      setTranscriptError(`"${file.name}" appears to be empty.`);
      e.target.value = "";
      return;
    }

    setTranscriptText(text);
    setTranscriptSaved(false);
  } catch (err) {
    console.error(err);
    setTranscriptError(`Couldn't read "${file.name}". Try a different file.`);
  } finally {
    e.target.value = "";
  }
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
        <Header
          title={
            <span className="header-breadcrumb">
              <Link to="/meetings" className="breadcrumb-link">Meetings</Link>
              <FiChevronRight size={18} className="breadcrumb-separator" />
              <span>{meeting?.title ?? "Meeting"}</span>
            </span>
          }
        />
        

        {loading && (
          <div className="loading-row">
            <Spinner size={18} />
            <span>Loading...</span>
          </div>
        )}
        {error && <p className="error">{error}</p>}

        {meeting && (
          <>
            <div className="meeting-detail-top">
              <div className="meeting-detail-top-left">
                <span className={`status-badge status-${meeting.processingStatus}`}>
                  {meeting.processingStatus}
                </span>

                <div className="meeting-detail-meta">
                  <span className="meta-item">
                    <FiCalendar size={18} />
                    {formatDate(meeting.datetime)}
                  </span>
                  <span className="meta-item">
                    <FiClock size={18} />
                    {formatTime(meeting.datetime)}
                  </span>
                </div>

                {meeting.description && <p>{meeting.description}</p>}
              </div>

              <button className="delete-btn" onClick={handleDeleteMeeting}>
                Delete meeting
              </button>
            </div>

            <div className="meeting-detail-layout">
              <div className="meeting-detail-main">
                <section className="detail-section">
                  <h2>Transcript</h2>

                  <input className="transcript-file" type="file" accept=".txt, .md, .csv, .vtt, .srt, .docx" onChange={handleFileUpload} />

                  <textarea
                    className="transcript-input"
                    placeholder="Paste the meeting transcript here, or upload a .txt / .docx file above"
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
                  {processing ? (
                    <span className="btn-loading">
                      <Spinner size={14} color="currentColor" />
                      Processing...
                    </span>
                  ) : aiResult ? (
                    "Reprocess transcript"
                  ) : (
                    "Process transcript"
                  )}
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

                      {aiResult.discussionPoints.length > 0 ? (
                        <>
                          <h3>Discussion Points</h3>
                          <ul>
                            {aiResult.discussionPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          <h3>Discussion Points</h3>
                          <p className="muted">No discussion points were extracted for this run.</p>
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
                      onUpdate={handleUpdateActionItem}
                    />
                  )}
                </section>
              </div>

              <aside className="meeting-detail-sidebar">
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
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default MeetingDetail;