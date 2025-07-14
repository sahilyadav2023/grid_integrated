/// <reference types="react" />
import * as React from "react"; // 👈 force JSX namespace availability
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import LiveSession from "./pages/LiveSession";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import DashboardHome from "./pages/DashboardHome";
import AdminDashboard from "./pages/AdminDashboard";
import Rewards from "./pages/Rewards";
import { JSX } from "react";

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="live" element={<LiveSession />} />
        <Route path="profile" element={<Profile />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
};

export default App;
