import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home/Home";
import Meetings from "./components/pages/Meetings/Meetings";
import Settings from "./components/pages/Settings/Settings";
import HowItWorks from "./components/pages/HowItWorks/HowItWorks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;