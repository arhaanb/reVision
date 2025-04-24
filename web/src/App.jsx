import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import About from "./views/About";

function App() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-orange-100">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default App;
