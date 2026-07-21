import { useEffect, useMemo, useState } from "react";
import Sidebar from "@organisms/Sidebar/Sidebar";
import Header from "@organisms/Header/Header";
import ActionItemFilters from "@molecules/ActionItemFilters/ActionItemFilters";
import ActionItemsList from "@organisms/ActionItemsList/ActionItemsList";
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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (assigneeFilter && !item.assignee?.toLowerCase().includes(assigneeFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [items, statusFilter, assigneeFilter]);

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
        />

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <ActionItemsList
            items={filteredItems}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            meetingTitles={meetingTitles}
          />
        )}
      </main>
    </div>
  );
}

export default ActionItems;