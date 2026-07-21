import { Link } from "react-router-dom";
import type { ActionItem, ActionItemStatus } from "@/lib/actionItems";
import "./ActionItemRow.css";

type ActionItemRowProps = {
  item: ActionItem;
  onStatusChange: (id: string, status: ActionItemStatus) => void;
  onDelete: (id: string, description: string) => void;
  meetingTitle?: string;
};

function ActionItemRow({ item, onStatusChange, onDelete, meetingTitle }: ActionItemRowProps) {
  const isOverdue =
    item.deadline && item.status !== "DONE" && new Date(item.deadline) < new Date();

  return (
    <li className={`action-item status-${item.status}`}>
      <span className="action-item-description">{item.description}</span>
      {item.assignee && <span className="action-item-assignee">{item.assignee}</span>}
      {item.deadline && (
        <span className={`action-item-deadline ${isOverdue ? "overdue" : ""}`}>
          {new Date(item.deadline).toLocaleDateString()}
        </span>
      )}
      {meetingTitle && (
        <Link to={`/meetings/${item.meetingId}`} className="action-item-meeting-link">
          {meetingTitle}
        </Link>
      )}
      <select
        value={item.status}
        onChange={(e) => onStatusChange(item._id, e.target.value as ActionItemStatus)}
      >
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="DONE">Done</option>
        <option value="UNKNOWN">Unknown</option>
      </select>
      <button onClick={() => onDelete(item._id, item.description)}>Delete</button>
    </li>
  );
}

export default ActionItemRow;