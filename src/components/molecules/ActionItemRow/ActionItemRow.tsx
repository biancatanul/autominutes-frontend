import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import type { ActionItem, ActionItemStatus } from "@/lib/actionItems";
import "./ActionItemRow.css";
import { formatDate } from "@/lib/formatDate";
 
type ActionItemRowProps = {
  item: ActionItem;
  onStatusChange: (id: string, status: ActionItemStatus) => void;
  onDelete: (id: string, description: string) => void;
  meetingTitle?: string;
  showMeetingColumn: boolean;
};
 
function ActionItemRow({
  item,
  onStatusChange,
  onDelete,
  meetingTitle,
  showMeetingColumn,
}: ActionItemRowProps) {
  const isOverdue =
    Boolean(item.deadline) && item.status !== "DONE" && new Date(item.deadline!) < new Date();
 
  return (
    <div className={`action-item-row ${showMeetingColumn ? "with-meeting" : ""}`}>
      <div className="cell cell-description">{item.description}</div>
 
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
          onClick={() => onDelete(item._id, item.description)}
          aria-label={`Delete "${item.description}"`}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}
 
export default ActionItemRow;