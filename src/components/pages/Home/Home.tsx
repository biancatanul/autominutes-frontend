import Sidebar from "../../organisms/UserCard/Sidebar";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <Sidebar />

      <main className="home-content">
        <h1>New Meeting</h1>
      </main>
    </div>
  );
}

export default Home;