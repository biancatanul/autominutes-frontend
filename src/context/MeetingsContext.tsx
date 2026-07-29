import {createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode,} from "react";
import * as meetingsApi from "@/lib/meetings";
import type { Meeting, CreateMeetingInput, ProcessingStatus } from "@/lib/meetings";

const PAGE_SIZE = 10;
const FETCH_LIMIT = 1000; // pull all meetings so filtering can see the whole set

export type StatusFilter = ProcessingStatus | "all";
export type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";
export type ActionItemsFilter = "all" | "yes" | "no";

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
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  actionItemsFilter: ActionItemsFilter;
  setActionItemsFilter: (v: ActionItemsFilter) => void;
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
  const [dateFrom, setDateFromState] = useState("");
  const [dateTo, setDateToState] = useState("");
  const [actionItemsFilter, setActionItemsFilterState] = useState<ActionItemsFilter>("all");

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
  const setDateFrom = useCallback((v: string) => { setDateFromState(v); setPage(1); }, []);
  const setDateTo = useCallback((v: string) => { setDateToState(v); setPage(1); }, []);
  const setActionItemsFilter = useCallback((v: ActionItemsFilter) => { setActionItemsFilterState(v); setPage(1); }, []);
  
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matched = allMeetings.filter((m) => {
      const matchesSearch =
        term === "" ||
        m.title.toLowerCase().includes(term) ||
        (m.description ?? "").toLowerCase().includes(term) ||
        (m.transcript ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || m.processingStatus === statusFilter;

      const meetingTime = new Date(m.datetime).getTime();
      const matchesDateFrom = !dateFrom || meetingTime >= new Date(dateFrom).getTime();
      const matchesDateTo = (() => {
        if (!dateTo) return true;
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        return meetingTime <= end.getTime();
      })();

      const count = m.actionItemCount ?? 0;
      const matchesActionItems =
        actionItemsFilter === "all" ||
        (actionItemsFilter === "yes" && count > 0) ||
        (actionItemsFilter === "no" && count === 0);

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo && matchesActionItems;
    });

    return [...matched].sort((a, b) => {
      switch (sort) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "date-asc":
         return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        case "date-desc":
        default:
          return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
  }
});
  }, [allMeetings, search, statusFilter, sort, dateFrom, dateTo, actionItemsFilter]);

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
        dateFrom, setDateFrom, dateTo, setDateTo,
        actionItemsFilter, setActionItemsFilter,
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