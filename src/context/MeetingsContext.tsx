import {createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode,} from "react";
import * as meetingsApi from "@/lib/meetings";
import type { Meeting, CreateMeetingInput, ProcessingStatus } from "@/lib/meetings";

const PAGE_SIZE = 10;
const FETCH_LIMIT = 1000; // pull all meetings so filtering can see the whole set

export type StatusFilter = ProcessingStatus | "all";
export type SortOption = "date-desc" | "date-asc";

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

  search: string;
  setSearch: (v: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
  filteredCount: number;
};

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

export const MeetingsProvider = ({ children }: { children: ReactNode }) => {
  const [allMeetings, setAllMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [search, setSearchState] = useState("");
  const [statusFilter, setStatusFilterState] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("date-desc");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await meetingsApi.getMeetings(1, FETCH_LIMIT);
      setAllMeetings(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meetings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const setSearch = useCallback((v: string) => { setSearchState(v); setPage(1); }, []);
  const setStatusFilter = useCallback((v: StatusFilter) => { setStatusFilterState(v); setPage(1); }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matched = allMeetings.filter((m) => {
      const matchesSearch =
        term === "" ||
        m.title.toLowerCase().includes(term) ||
        (m.description ?? "").toLowerCase().includes(term) ||
        (m.transcript ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || m.processingStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return [...matched].sort((a, b) => {
      const diff = new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
      return sort === "date-asc" ? diff : -diff;
    });
  }, [allMeetings, search, statusFilter, sort]);

  // client-side pagination over the filtered list
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const meetings = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const addMeeting = useCallback(async (input: CreateMeetingInput) => {
    const created = await meetingsApi.createMeeting(input);
    await refresh();
    setPage(1);
    return created;
  }, [refresh]);

  const removeMeeting = useCallback(async (id: string) => {
    await meetingsApi.deleteMeeting(id);
    await refresh();
  }, [refresh]);

  return (
    <MeetingsContext.Provider
      value={{
        meetings, loading, error,
        page: currentPage, totalPages, setPage,
        refresh, addMeeting, removeMeeting,
        search, setSearch, statusFilter, setStatusFilter, sort, setSort,
        filteredCount: filtered.length,
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
};

export function useMeetings() {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error("useMeetings must be used within a MeetingsProvider");
  return ctx;
}