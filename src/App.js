import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { CollectionDetailPage } from "./pages/CollectionDetailPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/collection/:collectionId" element={<CollectionDetailPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
