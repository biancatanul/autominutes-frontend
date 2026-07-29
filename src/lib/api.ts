import { getToken } from "./authStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  return response;
}