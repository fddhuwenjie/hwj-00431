import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Browse from "@/pages/Browse";
import Quiz from "@/pages/Quiz";
import Tips from "@/pages/Tips";
import Community from "@/pages/Community";
import Admin from "@/pages/Admin";
import Scan from "@/pages/Scan";
import Challenge from "@/pages/Challenge";
import Compare from "@/pages/Compare";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/search" element={<Search />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/compare" element={<Compare />} />
        </Route>
      </Routes>
    </Router>
  );
}
