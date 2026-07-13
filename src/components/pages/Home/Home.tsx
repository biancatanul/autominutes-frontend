import Sidebar from "../../organisms/UserCard/Sidebar";
import Searchbar from "../../organisms/UserCard/Searchbar";
import "./Home.css";
import { useState } from "react";

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

      </main>
    </div>
  );
}

export default Home;