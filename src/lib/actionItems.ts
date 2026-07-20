import { apiFetch } from "./api";
import type { ActionItem, ActionItemStatus } from "./processing";

export type { ActionItem, ActionItemStatus };

export type UpdateActionItemInput = {
  description?: string;
  assignee?: string;
  deadline?: string;
  status?: ActionItemStatus;
};

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export function getActionItems(meetingId: string) {
  return apiFetch(`/action-items?meetingId=${meetingId}`).then((res) =>
    handle<ActionItem[]>(res)
  );
}

export function updateActionItem(id: string, input: UpdateActionItemInput) {
  return apiFetch(`/action-items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  }).then((res) => handle<ActionItem>(res));
}

export function deleteActionItem(id: string) {
  return apiFetch(`/action-items/${id}`, { method: "DELETE" }).then((res) => handle<void>(res));
}