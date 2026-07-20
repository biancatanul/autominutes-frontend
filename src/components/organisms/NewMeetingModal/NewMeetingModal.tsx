import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMeetings } from "@/context/MeetingsContext";
import Button from "@atoms/Button/Button";
import "./NewMeetingModal.css";

type NewMeetingModalProps = {
  onClose: () => void;
};

function NewMeetingModal({ onClose }: NewMeetingModalProps) {
  const { addMeeting } = useMeetings();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!datetime) {
      setError("Date and time is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const meeting = await addMeeting({
        title: title.trim(),
        datetime: new Date(datetime).toISOString(),
        description: description.trim() || undefined,
      });
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

          <label>
            Date and time
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </label>

          <label>
            Description (optional)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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