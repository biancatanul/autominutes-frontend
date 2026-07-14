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

        <h1>New Meeting</h1>

        <MeetingOptions />

        <MeetingForm />

        <h2>Recent meetings</h2>

        <RecentMeetings meetings = { meetings }/>

      </main>
    </div>
  );
}

export default Home;