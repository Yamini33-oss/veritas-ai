import { Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Agents from "./pages/Agents";
import Verify from "./pages/Verify";
import LiveVerification from "./pages/LiveVerification";
import Report from "./pages/Report";
import History from "./pages/History";
import HowItWorksPage from "./pages/HowItWorksPage";

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="chamber-atmosphere" />
      <div className="chamber-grain" />
      <Nav />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/verification/:id" element={<LiveVerification />} />
          <Route path="/report/:id" element={<Report />} />
          <Route path="/history" element={<History />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
