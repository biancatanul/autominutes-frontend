import { Link } from "react-router-dom";
import { FiTrash2, FiChevronDown, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import type { ActionItem, ActionItemStatus } from "@/lib/actionItems";
import type { UpdateActionItemInput } from "@/lib/actionItems";
import "./ActionItemRow.css";
import { formatDate } from "@/lib/formatDate";
import { useState } from "react";
 
type ActionItemRowProps = {
  item: ActionItem;
  onStatusChange: (id: string, status: ActionItemStatus) => void;
  onDelete: (id: string, description: string) => void;
  onUpdate: (id: string, updates: UpdateActionItemInput) => Promise<void>;
  meetingTitle?: string;
  showMeetingColumn: boolean;
};
 
function ActionItemRow({
  item,
  onStatusChange,
  onDelete,
  onUpdate,
  meetingTitle,
  showMeetingColumn,
}: ActionItemRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftDescription, setDraftDescription] = useState(item.description);
  const [draftAssignee, setDraftAssignee] = useState(item.assignee ?? "");
  const [draftDeadline, setDraftDeadline] = useState(item.deadline ? item.deadline.slice(0, 10) : "");
  const [saveError, setSaveError] = useState<string | null>(null);

  const isOverdue =
    Boolean(item.deadline) && item.status !== "DONE" && new Date(item.deadline!) < new Date();
 const hasDetails = Boolean(item.details?.trim());

 const startEditing = () => {
    setDraftDescription(item.description);
    setDraftAssignee(item.assignee ?? "");
    setDraftDeadline(item.deadline ? item.deadline.slice(0, 10) : "");
    setSaveError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    const trimmed = draftDescription.trim();
    if (!trimmed) {
      setSaveError("Description can't be empty.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await onUpdate(item._id, {
        description: trimmed,
        assignee: draftAssignee.trim() || undefined,
        deadline: draftDeadline || undefined,
      });
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="action-item-row-wrapper editing">
        <div className={`action-item-row ${showMeetingColumn ? "with-meeting" : ""}`}>
          <div className="cell cell-description">
            <input
              className="edit-input"
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              placeholder="Description"
              autoFocus
            />
          </div>

          {showMeetingColumn && (
            <div className="cell cell-meeting">
              {meetingTitle ? (
                <Link to={`/meetings/${item.meetingId}`}>{meetingTitle}</Link>
              ) : (
                <span className="muted">—</span>
              )}
            </div>
          )}

          <div className="cell cell-assignee">
            <input
              className="edit-input"
              value={draftAssignee}
              onChange={(e) => setDraftAssignee(e.target.value)}
              placeholder="Unassigned"
            />
          </div>

          <div className="cell cell-deadline">
            <input
              className="edit-input"
              type="date"
              value={draftDeadline}
              onChange={(e) => setDraftDeadline(e.target.value)}
            />
          </div>

          <div className="cell cell-status">
            <select
              className={`status-select status-${item.status}`}
              value={item.status}
              onChange={(e) => onStatusChange(item._id, e.target.value as ActionItemStatus)}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
              <option value="UNKNOWN">Unknown</option>
            </select>
          </div>

          <div className="cell cell-actions">
            <button
              className="action-btn save-btn"
              onClick={handleSave}
              disabled={saving}
              aria-label="Save changes"
            >
              <FiCheck />
            </button>
            <button
              className="action-btn"
              onClick={cancelEditing}
              disabled={saving}
              aria-label="Cancel editing"
            >
              <FiX />
            </button>
          </div>
        </div>

        {saveError && <div className="action-item-details edit-error">{saveError}</div>}
      </div>
    );
  }

  return (
    <div className="action-item-row-wrapper">
      <div className={`action-item-row ${showMeetingColumn ? "with-meeting" : ""}`}>
        <div className="cell cell-description">
          {hasDetails && (
            <button
              className={`expand-btn ${expanded ? "expanded" : ""}`}
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-label={expanded ? "Hide details" : "Show details"}
            >
              <FiChevronDown />
            </button>
          )}
          {item.description}
        </div>

        {showMeetingColumn && (
          <div className="cell cell-meeting">
            {meetingTitle ? (
              <Link to={`/meetings/${item.meetingId}`}>{meetingTitle}</Link>
            ) : (
              <span className="muted">—</span>
            )}
          </div>
        )}
 
      <div className="cell cell-assignee">
        {item.assignee ? item.assignee : <span className="muted">Unassigned</span>}
      </div>
 
      <div className="cell cell-deadline">
        {item.deadline ? (
          <span className={isOverdue ? "deadline-overdue" : ""}>
            {formatDate(item.deadline)}
            {isOverdue && <span className="overdue-badge">Overdue</span>}
          </span>
        ) : (
          <span className="muted">No deadline</span>
        )}
      </div>
 
      <div className="cell cell-status">
        <select
          className={`status-select status-${item.status}`}
          value={item.status}
          onChange={(e) => onStatusChange(item._id, e.target.value as ActionItemStatus)}
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="DONE">Done</option>
          <option value="UNKNOWN">Unknown</option>
        </select>
      </div>
 
      <div className="cell cell-actions">
        <button
          className="action-btn"
          onClick={startEditing}
          aria-label={`Edit "${item.description}"`}
        >
          <FiEdit2 />
        </button>
        <button
          className="action-btn"
          onClick={() => onDelete(item._id, item.description)}
          aria-label={`Delete "${item.description}"`}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>

    {expanded && hasDetails && (
        <div className="action-item-details">{item.details}</div>
      )}
    </div>
  );
}
 
export default ActionItemRow;