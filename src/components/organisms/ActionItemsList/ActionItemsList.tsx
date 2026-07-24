import ActionItemRow from "@molecules/ActionItemRow/ActionItemRow";
import type { ActionItem, ActionItemStatus } from "@/lib/actionItems";
import "./ActionItemsList.css";

export const ACTION_ITEMS_PAGE_SIZE = 10;

type ActionItemsListProps = {
  items: ActionItem[];
  onStatusChange: (id: string, status: ActionItemStatus) => void;
  onDelete: (id: string, description: string) => void;
  meetingTitles?: Map<string, string>;
  // only pass these when the caller wants pagination (the global Action Items page);
  // MeetingDetail's per-meeting list omits them and renders everything at once
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

// OPEN/IN_PROGRESS/UNKNOWN first (things that still need attention), DONE last
const STATUS_WEIGHT: Record<ActionItemStatus, number> = {
  OPEN: 0,
  IN_PROGRESS: 0,
  UNKNOWN: 1,
  DONE: 2,
};

function sortItems(items: ActionItem[]): ActionItem[] {
  return [...items].sort((a, b) => {
    const statusDiff = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
    if (statusDiff !== 0) return statusDiff;

    // within the same group, soonest/overdue deadlines float to the top, no-deadline items sink
    if (a.deadline && b.deadline) return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return 0;
  });
}

function ActionItemsList({
  items,
  onStatusChange,
  onDelete,
  meetingTitles,
  page,
  totalPages,
  onPageChange,
}: ActionItemsListProps) {
  const showMeetingColumn = Boolean(meetingTitles);
  const paginated = page !== undefined && totalPages !== undefined && onPageChange !== undefined;

  if (items.length === 0) {
    return <p className="muted">No action items yet.</p>;
  }

  const sorted = sortItems(items);
  const pageItems = paginated
    ? sorted.slice((page! - 1) * ACTION_ITEMS_PAGE_SIZE, page! * ACTION_ITEMS_PAGE_SIZE)
    : sorted;

  return (
    <div className="action-items-table">
      <div className={`action-items-table-header ${showMeetingColumn ? "with-meeting" : ""}`}>
        <div>Description</div>
        {showMeetingColumn && <div>Meeting</div>}
        <div>Assignee</div>
        <div>Deadline</div>
        <div>Status</div>
        <div></div>
      </div>

      <div className="action-items-table-body">
        {pageItems.map((item) => (
          <ActionItemRow
            key={item._id}
            item={item}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            meetingTitle={meetingTitles?.get(item.meetingId)}
            showMeetingColumn={showMeetingColumn}
          />
        ))}
      </div>

      {paginated && totalPages! > 1 && (
        <div className="pagination">
          <button disabled={page! <= 1} onClick={() => onPageChange!(page! - 1)}>
            Prev
          </button>

          {Array.from({ length: totalPages! }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={p === page ? "active" : ""}
              onClick={() => onPageChange!(p)}
            >
              {p}
            </button>
          ))}

          <button disabled={page! >= totalPages!} onClick={() => onPageChange!(page! + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionItemsList;