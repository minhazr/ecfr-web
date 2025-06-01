import React from "react";
import "./index.css";
import Dashboard from "./components/Dashboard";

function App() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <Dashboard />
        </div>
    );
}

export default App;