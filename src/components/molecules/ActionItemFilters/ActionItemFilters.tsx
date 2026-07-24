type MeetingOption = {
  id: string;
  title: string;
};

type ActionItemFiltersProps = {
  status: string;
  onStatusChange: (status: string) => void;
  assignee: string;
  onAssigneeChange: (assignee: string) => void;
  meetingId: string;
  onMeetingChange: (meetingId: string) => void;
  assigneeOptions: string[];
  meetingOptions: MeetingOption[];
};

function ActionItemFilters({
  status,
  onStatusChange,
  assignee,
  onAssigneeChange,
  meetingId,
  onMeetingChange,
  assigneeOptions,
  meetingOptions,
}: ActionItemFiltersProps) {
  return (
    <div className="action-item-filters">
      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="DONE">Done</option>
        <option value="UNKNOWN">Unknown</option>
      </select>

      <select value={meetingId} onChange={(e) => onMeetingChange(e.target.value)}>
        <option value="">All meetings</option>
        {meetingOptions.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </select>

      <select value={assignee} onChange={(e) => onAssigneeChange(e.target.value)}>
        <option value="">All assignees</option>
        {assigneeOptions.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ActionItemFilters;