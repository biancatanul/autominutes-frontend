import { useEffect, useMemo, useState } from "react";
import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import ActionItemFilters from "@molecules/ActionItemFilters/ActionItemFilters";
import ActionItemsList, { ACTION_ITEMS_PAGE_SIZE } from "@organisms/ActionItemsList/ActionItemsList";
import * as actionItemsApi from "@/lib/actionItems";
import * as meetingsApi from "@/lib/meetings";
import type { ActionItem, ActionItemStatus } from "@/lib/actionItems";
import "./ActionItems.css";

function ActionItems() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [meetingTitles, setMeetingTitles] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [meetingFilter, setMeetingFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([actionItemsApi.getAllActionItems(), meetingsApi.getMeetings(1, 1000)])
      .then(([actionItemsData, meetingsResult]) => {
        setItems(actionItemsData);
        setMeetingTitles(new Map(meetingsResult.data.map((m) => [m._id, m.title])));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load action items."))
      .finally(() => setLoading(false));
  }, []);

  // built from the full, unfiltered item set so the dropdowns don't shrink as filters are applied
  const assigneeOptions = useMemo(() => {
    const names = items.map((item) => item.assignee).filter((name): name is string => Boolean(name));
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const meetingOptions = useMemo(() => {
    const idsInUse = new Set(items.map((item) => item.meetingId));
    return [...idsInUse]
      .map((id) => ({ id, title: meetingTitles.get(id) ?? "Untitled meeting" }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [items, meetingTitles]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (assigneeFilter && item.assignee !== assigneeFilter) return false;
      if (meetingFilter && item.meetingId !== meetingFilter) return false;
      return true;
    });
  }, [items, statusFilter, assigneeFilter, meetingFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ACTION_ITEMS_PAGE_SIZE));

  // changing a filter should always land back on page 1, not wherever you happened to be
  useEffect(() => {
    setPage(1);
  }, [statusFilter, assigneeFilter, meetingFilter]);

  // if the filtered set shrinks (e.g. an item is deleted) and the current page no longer exists, back up to the last valid one
  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleStatusChange = async (id: string, status: ActionItemStatus) => {
    const updated = await actionItemsApi.updateActionItem(id, { status });
    setItems((prev) => prev.map((item) => (item._id === id ? updated : item)));
  };

  const handleDelete = async (id: string, description: string) => {
    if (!window.confirm(`Delete action item "${description}"?`)) return;
    await actionItemsApi.deleteActionItem(id);
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="action-items-page">
      <Sidebar />
      <main className="action-items-content">
        <Header />
        <h1>Action Items</h1>

        <ActionItemFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          assignee={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          meetingId={meetingFilter}
          onMeetingChange={setMeetingFilter}
          assigneeOptions={assigneeOptions}
          meetingOptions={meetingOptions}
        />

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <ActionItemsList
            items={filteredItems}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            meetingTitles={meetingTitles}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </main>
    </div>
  );
}

export default ActionItems;