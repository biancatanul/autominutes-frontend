import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import "./Home.css";
import RecentMeetings from "@organisms/RecentMeetings/RecentMeetings";
import Header from "@organisms/Header/Header";
import * as meetingsApi from "@/lib/meetings";
import * as actionItemsApi from "@/lib/actionItems";
import type { Meeting } from "@/lib/meetings";
import type { ActionItem } from "@/lib/actionItems";
import Spinner from "@atoms/Spinner/Spinner";
import { FiVideo, FiCheckSquare, FiCalendar } from "react-icons/fi";
import StatsRow, { type Stat } from "@organisms/StatsRow/StatsRow";

const RECENT_MEETINGS_LIMIT = 5;

function getWeekRange(reference = new Date()) {
  const start = new Date(reference);
  const day = start.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function Home() {
  const navigate = useNavigate();
  const [allMeetings, setAllMeetings] = useState<Meeting[]>([]);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([meetingsApi.getMeetings(1, 1000), actionItemsApi.getAllActionItems()])
      .then(([meetingsResult, actionItemsData]) => {
        const sorted = [...meetingsResult.data].sort(
          (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        setAllMeetings(sorted);
        setTotalMeetings(meetingsResult.total);
        setActionItems(actionItemsData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

   const recentMeetings = useMemo(
    () => allMeetings.slice(0, RECENT_MEETINGS_LIMIT),
    [allMeetings]
  );

  const openActionItemsCount = useMemo(
    () => actionItems.filter((item) => item.status !== "DONE").length,
    [actionItems]
  );

  const meetingsThisWeekCount = useMemo(() => {
    const { start, end } = getWeekRange();
    return allMeetings.filter((m) => {
      const t = new Date(m.datetime).getTime();
      return t >= start.getTime() && t <= end.getTime();
    }).length;
  }, [allMeetings]);

  const stats: Stat[] = [
    { id: "total-meetings", icon: <FiVideo size={20} />, label: "Total meetings", value: totalMeetings },
    { id: "open-action-items", icon: <FiCheckSquare size={20} />, label: "Open action items", value: openActionItemsCount },
    { id: "meetings-this-week", icon: <FiCalendar size={20} />, label: "Meetings this week", value: meetingsThisWeekCount },
  ];

  const handleOpen = (id: string) => {
    navigate(`/meetings/${id}`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete meeting "${title}"? This can't be undone.`)) return;
    await meetingsApi.deleteMeeting(id);
    setAllMeetings((prev) => prev.filter((m) => m._id !== id));
    setTotalMeetings((prev) => prev - 1);
  };

  return (
    <div className="home">
      <Sidebar />

      <main className="home-content">
        <Header title="Home" />

        {loading ? (
          <div className="loading-row">
            <Spinner size={18} />
            <span>Loading...</span>
          </div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <StatsRow stats={stats} />

            <h2>Recent meetings</h2>
            <br />

            <RecentMeetings meetings={recentMeetings} onOpen={handleOpen} onDelete={handleDelete} />
          </>
        )}
      </main>
    </div>
  );
}

export default Home;