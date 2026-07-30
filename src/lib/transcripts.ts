import { apiFetch } from "./api";
import { getToken } from "./authStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type TranscriptVersion = {
  _id: string;
  meetingId: string;
  version: number;
  source: "upload" | "paste";
  filename?: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
};

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function uploadTranscriptFile(meetingId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const token = getToken();
  const res = await fetch(`${BASE_URL}/meetings/${meetingId}/transcript`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  return handle<TranscriptVersion & { text: string }>(res);
}

export function getTranscriptVersions(meetingId: string) {
  return apiFetch(`/meetings/${meetingId}/transcript/versions`).then((res) =>
    handle<{ count: number; versions: TranscriptVersion[] }>(res),
  );
}

export async function downloadTranscriptVersion(meetingId: string, version: number) {
  const res = await apiFetch(`/meetings/${meetingId}/transcript/versions/${version}/download`);
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition") ?? "";
  const filename = cd.match(/filename="(.+?)"/)?.[1] ?? `transcript-v${version}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}