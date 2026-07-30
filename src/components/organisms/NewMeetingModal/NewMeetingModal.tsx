import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMeetings } from "@/context/MeetingsContext";
import * as meetingsApi from "@/lib/meetings";
import * as transcriptsApi from "@/lib/transcripts";
import Button from "@atoms/Button/Button";
import DatePicker from "@molecules/DatePicker/DatePicker";
import "./NewMeetingModal.css";

type NewMeetingModalProps = {
  onClose: () => void;
};

const SUPPORTED = /\.(txt|md|csv|vtt|srt|docx)$/i;

function NewMeetingModal({ onClose }: NewMeetingModalProps) {
  const { addMeeting } = useMeetings();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleTranscriptTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
    if (e.target.value) setTranscriptFile(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!SUPPORTED.test(file.name)) {
      setError(`"${file.name}" is unsupported. Please upload a .txt, .md, or .docx file.`);
      e.target.value = "";
      return;
    }

    setError(null);
    setTranscriptFile(file);
    setTranscript("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!date || !time) {
      setError("Date and time is required.");
      return;
    }
    if (!transcriptFile && !transcript.trim()) {
      setError("A transcript is required, upload a file or paste the text.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const meeting = await addMeeting({
        title: title.trim(),
        datetime: new Date(`${date}T${time}`).toISOString(),
      });

      if (transcriptFile) {
        await transcriptsApi.uploadTranscriptFile(meeting._id, transcriptFile);
      } else {
        await meetingsApi.setTranscript(meeting._id, transcript.trim());
      }

      onClose();
      navigate(`/meetings/${meeting._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>New Meeting</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <div className="modal-field-row">
            <label>
              Date
              <DatePicker value={date} onChange={setDate} />
            </label>

            <label>
              Time
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>

          <label>
            Transcript
            <input
              className="transcript-file"
              type="file"
              accept=".txt,.md,.csv,.vtt,.srt,.docx"
              onChange={handleFileChange}
            />
          </label>

          <label>
            Or paste transcript text
            <textarea
              value={transcript}
              onChange={handleTranscriptTextChange}
              placeholder="Paste the meeting transcript here"
            />
          </label>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <Button text="Cancel" type="button" onClick={onClose} />
            <Button
              text={submitting ? "Creating..." : "Create meeting"}
              type="submit"
              disabled={submitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewMeetingModal;