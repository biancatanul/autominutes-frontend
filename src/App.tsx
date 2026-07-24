import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home/Home";
import Meetings from "./components/pages/Meetings/Meetings";
import HowItWorks from "./components/pages/HowItWorks/HowItWorks";
import Login from "./components/pages/Login/Login";
import Signup from "./components/pages/Signup/Signup";
import ForgotPassword from "./components/pages/ForgotPassword/ForgotPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "@pages/Landing/Landing";
import MeetingDetail from "@pages/MeetingDetail/MeetingDetail";
import ActionItems from "@pages/ActionItems/ActionItems";

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <Meetings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/:id"
          element={
            <ProtectedRoute>
              <MeetingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/action-items"
          element={
            <ProtectedRoute>
              <ActionItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <ProtectedRoute>
              <HowItWorks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;