import { FiFilter, FiX } from "react-icons/fi";
import FilterDropdown from "@molecules/FilterDropdown/FilterDropdown";
import Pagination from "@molecules/Pagination/Pagination";

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
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
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
  hasActiveFilters,
  onClearFilters,
  page,
  totalPages,
  onPageChange,
}: ActionItemFiltersProps) {
  return (
    <div className="action-item-filters">
      <FilterDropdown<string>
        icon={<FiFilter size={16} />}
        label="Status"
        value={status}
        onChange={onStatusChange}
        options={[
          { value: "", label: "All statuses" },
          { value: "OPEN", label: "Open" },
          { value: "IN_PROGRESS", label: "In progress" },
          { value: "DONE", label: "Done" },
          { value: "UNKNOWN", label: "Unknown" },
        ]}
      />

      <FilterDropdown<string>
        icon={<FiFilter size={16} />}
        label="Meeting"
        value={meetingId}
        onChange={onMeetingChange}
        options={[
          { value: "", label: "All meetings" },
          ...meetingOptions.map((m) => ({ value: m.id, label: m.title })),
        ]}
      />

      <FilterDropdown<string>
        icon={<FiFilter size={16} />}
        label="Assignee"
        value={assignee}
        onChange={onAssigneeChange}
        options={[
          { value: "", label: "All assignees" },
          ...assigneeOptions.map((a) => ({ value: a, label: a })),
        ]}
      />

      <button
        type="button"
        className="clear-filters-btn"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
      >
        <FiX size={14} />
        Clear filters
      </button>

      {page !== undefined && totalPages !== undefined && onPageChange !== undefined && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="pagination-toolbar"
        />
      )}
    </div>
  );
}

export default ActionItemFilters;