import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import * as meetingsApi from "@/lib/meetings";
import type { Meeting, CreateMeetingInput } from "@/lib/meetings";

const PAGE_SIZE = 10;

type MeetingsContextType = {
    meetings: Meeting[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    refresh: () => Promise<void>;
    addMeeting: (input: CreateMeetingInput) => Promise<Meeting>;
    removeMeeting: (id: string) => Promise<void>;
};

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

export const MeetingsProvider = ({ children }: { children: ReactNode }) => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await meetingsApi.getMeetings(page, PAGE_SIZE);
      setMeetings(result.data);
      setTotalPages(Math.max(1, Math.ceil(result.total / result.limit)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meetings");
    } finally {
      setLoading(false);
    }
    }, [page]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addMeeting = useCallback(async (input: CreateMeetingInput) => {
        const created = await meetingsApi.createMeeting(input);
        const result = await meetingsApi.getMeetings(1, PAGE_SIZE);
        setPage(1);
        setMeetings(result.data);
        setTotalPages(Math.max(1, Math.ceil(result.total / result.limit)));
        return created;
    }, []);

    const removeMeeting = useCallback(async (id: string) => {
        await meetingsApi.deleteMeeting(id);
        await refresh();
    }, []);

    return (
        <MeetingsContext.Provider value={{ meetings, loading, error, page, totalPages, setPage, refresh, addMeeting, removeMeeting }}>
        {children}
        </MeetingsContext.Provider>
    );
}

export function useMeetings() {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error("useMeetings must be used within a MeetingsProvider");
  return ctx;
}