import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import * as meetingsApi from "@/lib/meetings";
import type { Meeting, CreateMeetingInput } from "@/lib/meetings";

type MeetingsContextType = {
    meetings: Meeting[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    addMeeting: (input: CreateMeetingInput) => Promise<Meeting>;
    removeMeeting: (id: string) => Promise<void>;
};

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

export const MeetingsProvider = ({ children }: { children: ReactNode }) => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await meetingsApi.getMeetings();
      setMeetings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meetings");
    } finally {
      setLoading(false);
    }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addMeeting = useCallback(async (input: CreateMeetingInput) => {
        const created = await meetingsApi.createMeeting(input);
        setMeetings((prev) => [created, ...prev]);
        return created;
    }, []);

    const removeMeeting = useCallback(async (id: string) => {
        await meetingsApi.deleteMeeting(id);
        setMeetings((prev) => prev.filter((m) => m._id !== id));
    }, []);

    return (
        <MeetingsContext.Provider value={{ meetings, loading, error, refresh, addMeeting, removeMeeting }}>
        {children}
        </MeetingsContext.Provider>
    );
}

export function useMeetings() {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error("useMeetings must be used within a MeetingsProvider");
  return ctx;
}