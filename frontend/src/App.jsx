import React, { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";
import ProtectedRoute from "./routes/ProtectedRoute";

// Minimal hash-based router to avoid adding react-router dependency
const routes = {
  "#/": () => <Login />,
  "#/login": () => <Login />,
  "#/register": () => <Register />,
  "#/todos": () => (
    <ProtectedRoute>
      <Todos />
    </ProtectedRoute>
  ),
};

const App = () => {
  const [route, setRoute] = useState(window.location.hash || "#/");

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const Page = routes[route] || routes["#/"];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Page />
      </div>
    </AuthProvider>
  );
};

export default App;
