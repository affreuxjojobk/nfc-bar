// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import BarInterface from "./BarInterface";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LayoutDashboard } from "lucide-react";
import SalesHistory from "./components/SalesHistory/SalesHistory";

function NavigationButtons() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
      >
        <LayoutDashboard size={20} /> Interface du bar
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App relative min-h-screen bg-gray-100 text-gray-800">
        <header className="bg-red-600 p-4 text-white text-center shadow-md">
          <h1 className="text-2xl font-bold">Gestion du Bar NFC 🍸</h1>
        </header>

        <NavigationButtons />

        <main className="p-6 pt-24">
          <Routes>
            <Route path="/" element={<BarInterface />} />
			<Route path="/ventes" element={<SalesHistory />} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white text-center p-4 mt-6 shadow-inner">
          <p>© 2025 Beautiful Kreyol. Tous droits réservés.</p>
        </footer>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
