import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import MeetingTable from "@organisms/MeetingTable/MeetingTable";
import Button from "@atoms/Button/Button";
import Searchbar from "@organisms/Searchbar/Searchbar";
import NewMeetingModal from "@organisms/NewMeetingModal/NewMeetingModal";
import { FiFilter, FiCalendar } from "react-icons/fi";
import FilterDropdown from "@molecules/FilterDropdown/FilterDropdown";
import {
  useMeetings,
  type StatusFilter,
  type SortOption,
  type ActionItemsFilter,
} from "@/context/MeetingsContext";
import "./Meetings.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { LuArrowUpDown } from "react-icons/lu";

function Meetings() {
  const [showModal, setShowModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    search, setSearch,
    statusFilter, setStatusFilter,
    sort, setSort,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    actionItemsFilter, setActionItemsFilter,
    filteredCount,
  } = useMeetings();

  // hydrate filters from the URL once, on first mount
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const q = searchParams.get("q");
    const status = searchParams.get("status");
    const sortParam = searchParams.get("sort");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const hasItems = searchParams.get("hasActionItems");

    if (q) setSearch(q);
    if (status) setStatusFilter(status as StatusFilter);
    if (sortParam) setSort(sortParam as SortOption);
    if (from) setDateFrom(from);
    if (to) setDateTo(to);
    if (hasItems) setActionItemsFilter(hasItems as ActionItemsFilter);
  }, []);

  // push current filters back to the URL whenever they change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (statusFilter !== "all") params.status = statusFilter;
    if (sort !== "date-desc") params.sort = sort;
    if (dateFrom) params.from = dateFrom;
    if (dateTo) params.to = dateTo;
    if (actionItemsFilter !== "all") params.hasActionItems = actionItemsFilter;
    setSearchParams(params, { replace: true });
  }, [search, statusFilter, sort, dateFrom, dateTo, actionItemsFilter]);

  return (
    <div className="meetings-page">
      <Sidebar />

      <main className="meetings-content">
        <Header title="Meeting archive" />
        <div className="meetings-title-row">
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

          <FilterDropdown<ActionItemsFilter>
              icon={<FiFilter size={16} />}
              label="Action items"
              value={actionItemsFilter}
              onChange={setActionItemsFilter}
              options={[
                { value: "all", label: "Any" },
                { value: "yes", label: "Has action items" },
                { value: "no", label: "No action items" },
              ]}
            />

          <div className="date-range-filter">
              <FiCalendar size={16} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-label="From date"
              />
              <span>–</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-label="To date"
              />
          </div>

          <FilterDropdown<SortOption>
            icon={<LuArrowUpDown size={16} />}
            label="Sort"
            value={sort}
            onChange={setSort}
            options={[
              { value: "date-desc", label: "Newest first" },
              { value: "date-asc",  label: "Oldest first" },
              { value: "title-asc",  label: "Title (A–Z)" },
              { value: "title-desc", label: "Title (Z–A)" },
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