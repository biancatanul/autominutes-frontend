import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import MeetingTable from "@organisms/MeetingTable/MeetingTable";
import Button from "@atoms/Button/Button";
import Searchbar from "@organisms/Searchbar/Searchbar";
import NewMeetingModal from "@organisms/NewMeetingModal/NewMeetingModal";
import { FiFilter, FiCalendar } from "react-icons/fi";
import FilterDropdown from "@molecules/FilterDropdown/FilterDropdown";
import { useMeetings, type StatusFilter, type SortOption } from "@/context/MeetingsContext";
import "./Meetings.css";
import { useState } from "react";

function Meetings() {
  const [showModal, setShowModal] = useState(false);
  const { search, setSearch, statusFilter, setStatusFilter, sort, setSort, filteredCount } =
    useMeetings();

  return (
    <div className="meetings-page">
      <Sidebar />

      <main className="meetings-content">
        <Header />

        <div className="meetings-title-row">
          <h1>Meeting archive</h1>
          <span className="meetings-count">{filteredCount} result(s)</span>
        </div>

        <div className="meetings-toolbar">
  <Searchbar
    value={search}
    onChange={setSearch}
    placeholder="Search..."
  />

  <div className="toolbar-actions">
    <FilterDropdown<StatusFilter>
      icon={<FiFilter size={16} />}
      label="Status"
      value={statusFilter}
      onChange={setStatusFilter}
      options={[
        { value: "all", label: "All statuses" },
        { value: "idle", label: "Idle" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
      ]}
    />

    <FilterDropdown<SortOption>
      icon={<FiCalendar size={16} />}
      label="Date"
      value={sort}
      onChange={setSort}
      options={[
        { value: "date-desc", label: "Newest first" },
        { value: "date-asc",  label: "Oldest first" },
      ]}
    />

    <Button text="+ New Meeting" onClick={() => setShowModal(true)} />
  </div>
</div>

        <MeetingTable />
      </main>

      {showModal && <NewMeetingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default Meetings;