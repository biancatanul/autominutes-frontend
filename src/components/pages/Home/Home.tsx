import Sidebar from "../../organisms/Sidebar/Sidebar";
import Searchbar from "../../organisms/Searchbar/Searchbar";
import "./Home.css";
import { useState } from "react";
import MeetingOptions from "@organisms/MeetingOptions/MeetingOptions";
import MeetingForm from "@organisms/MeetingForm/MeetingForm"

function Home() {
  const [search, setSearch] = useState("");
  
  const handleSearch = () => {
    console.log("Searching for:", search);
  };

  return (
    <div className="home">
      <Sidebar />

      <main className="home-content">
        <Searchbar
          value = {search}
          onChange = {setSearch}
          onSearch = {handleSearch}
          placeholder = "Search for a user..."
          />

        <h1>New Meeting</h1>

        <MeetingOptions />

        <MeetingForm />

        <h2>Recent meetings</h2>

      </main>
    </div>
  );
}

export default Home;