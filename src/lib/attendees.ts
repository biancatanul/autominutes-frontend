import { apiFetch } from "./api";

export type Attendee = {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  meetingId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAttendeeInput = {
  name: string;
  email?: string;
  role?: string;
  meetingId: string;
};

export type UpdateAttendeeInput = Partial<Omit<CreateAttendeeInput, "meetingId">>;

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export function getAttendees(meetingId: string) {
  return apiFetch(`/attendees?meetingId=${meetingId}`).then((res) => handle<Attendee[]>(res));
}

export function createAttendee(input: CreateAttendeeInput) {
  return apiFetch("/attendees", {
    method: "POST",
    body: JSON.stringify(input),
  }).then((res) => handle<Attendee>(res));
}

export function updateAttendee(id: string, input: UpdateAttendeeInput) {
  return apiFetch(`/attendees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  }).then((res) => handle<Attendee>(res));
}

export function deleteAttendee(id: string) {
  return apiFetch(`/attendees/${id}`, { method: "DELETE" }).then((res) => handle<void>(res));
}