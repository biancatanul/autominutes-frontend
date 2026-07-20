import { apiFetch } from "./api";

export type ProcessingStatus = "idle" | "processing" | "completed" | "failed";

export type Meeting = {
  _id: string;
  title: string;
  datetime: string;
  description?: string;
  transcript?: string;
  processingStatus: ProcessingStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateMeetingInput = {
  title: string;
  datetime: string;
  description?: string;
};

export type UpdateMeetingInput = Partial<CreateMeetingInput>;

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export function getMeetings() {
  return apiFetch("/meetings").then((res) => handle<Meeting[]>(res));
}

export function getMeeting(id: string) {
  return apiFetch(`/meetings/${id}`).then((res) => handle<Meeting>(res));
}

export function createMeeting(input: CreateMeetingInput) {
  return apiFetch("/meetings", {
    method: "POST",
    body: JSON.stringify(input),
  }).then((res) => handle<Meeting>(res));
}

export function updateMeeting(id: string, input: UpdateMeetingInput) {
  return apiFetch(`/meetings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  }).then((res) => handle<Meeting>(res));
}

export function deleteMeeting(id: string) {
  return apiFetch(`/meetings/${id}`, { method: "DELETE" }).then((res) => handle<void>(res));
}