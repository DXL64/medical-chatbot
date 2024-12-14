// 2.50.0
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ChatBot from "./components/ChatBot";
import ImagePrediction from "./components/ImagePrediction.jsx";
import FAQPage from "./pages/FAQPage";
import IssuePage from "./pages/IssuePage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HealthCare from "./components/HealthCare.jsx";

function App() {
  useEffect(() => {}, []);
  const [currentPage, SetCurrentPage] = useState("Home");
  return (
    <BrowserRouter>
      <div className="overflow-hidden">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="chat" element={<ChatBot />} />
          <Route path="healthcare" element={<HealthCare />} />
          <Route path="image-predict" element={<ImagePrediction />} />
          <Route path="issue" element={<IssuePage />} />
          <Route path="faq" element={<FAQPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;