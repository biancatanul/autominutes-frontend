type ActionItemFiltersProps = {
  status: string;
  onStatusChange: (status: string) => void;
  assignee: string;
  onAssigneeChange: (assignee: string) => void;
};

function ActionItemFilters({ status, onStatusChange, assignee, onAssigneeChange }: ActionItemFiltersProps) {
  return (
    <div className="action-item-filters">
      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="DONE">Done</option>
        <option value="UNKNOWN">Unknown</option>
      </select>
      <input
        placeholder="Filter by assignee"
        value={assignee}
        onChange={(e) => onAssigneeChange(e.target.value)}
      />
    </div>
  );
}

export default ActionItemFilters;