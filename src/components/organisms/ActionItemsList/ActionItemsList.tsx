import ActionItemRow from "@molecules/ActionItemRow/ActionItemRow";
import type { ActionItem, ActionItemStatus } from "@/lib/actionItems";
import "./ActionItemsList.css";

type ActionItemsListProps = {
  items: ActionItem[];
  onStatusChange: (id: string, status: ActionItemStatus) => void;
  onDelete: (id: string, description: string) => void;
  meetingTitles?: Map<string, string>;
};

const STATUS_ORDER: ActionItemStatus[] = ["OPEN", "IN_PROGRESS", "DONE", "UNKNOWN"];
const STATUS_LABELS: Record<ActionItemStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  UNKNOWN: "Unknown",
};

function ActionItemsList({ items, onStatusChange, onDelete, meetingTitles }: ActionItemsListProps) {
  if (items.length === 0) {
    return <p className="muted">No action items yet.</p>;
  }

  return (
    <div className="action-items-list">
      {STATUS_ORDER.map((status) => {
        const group = items.filter((item) => item.status === status);
        if (group.length === 0) return null;

        return (
          <div key={status} className="action-item-group">
            <h3>{STATUS_LABELS[status]} ({group.length})</h3>
            <ul className="action-item-list">
              {group.map((item) => (
                <ActionItemRow
                  key={item._id}
                  item={item}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  meetingTitle={meetingTitles?.get(item.meetingId)}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default ActionItemsList;