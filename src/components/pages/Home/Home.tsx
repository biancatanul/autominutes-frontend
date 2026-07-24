import Sidebar from "../../organisms/Sidebar/Sidebar";
import "./Home.css";
import { useState } from "react";
import MeetingOptions from "@organisms/MeetingOptions/MeetingOptions";
import MeetingForm from "@organisms/MeetingForm/MeetingForm"
import RecentMeetings from "@organisms/RecentMeetings/RecentMeetings";
import Header from "@organisms/Header/Header";

type Meeting = {
  id: number;
  title: string;
  description: string;
  date: string;
};

function Home() {

  const [meetings] = useState<Meeting[]>([]);
  
  return (
    <div className="home">
      <Sidebar />

      <main className="home-content">

        <Header />

        <h2>Recent meetings</h2>

        <br />

        <RecentMeetings meetings = { meetings }/>

      </main>
    </div>
  );
}

export default Home;