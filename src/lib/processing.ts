import { apiFetch } from "./api";
import type { ProcessingStatus } from "./meetings";
import type { Attendee } from "./attendees";

export type AiResult = {
  _id: string;
  meetingId: string;
  summary: string;
  discussionPoints: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type ActionItemStatus = "OPEN" | "IN_PROGRESS" | "DONE" | "UNKNOWN";

export type ActionItem = {
  _id: string;
  description: string;
  assignee?: string;
  deadline?: string;
  status: ActionItemStatus;
  meetingId: string;
  createdAt: string;
  updatedAt: string;
};

export type ProcessResult = {
  meetingId: string;
  status: ProcessingStatus;
  aiResult: AiResult;
  actionItems: ActionItem[];
  attendees: Attendee[];
};

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export function processMeeting(meetingId: string) {
  return apiFetch(`/meetings/${meetingId}/process`, { method: "POST" }).then((res) =>
    handle<ProcessResult>(res)
  );
}

export function getResults(meetingId: string) {
  return apiFetch(`/meetings/${meetingId}/results`).then((res) => handle<AiResult[]>(res));
}