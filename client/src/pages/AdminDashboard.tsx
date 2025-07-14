import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-1">👨‍🎓 Total Users</h2>
          <p className="text-2xl font-bold text-blue-700">1240</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-1">📚 Active Courses</h2>
          <p className="text-2xl font-bold text-blue-700">18</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-1">🎖️ Certificates Issued</h2>
          <p className="text-2xl font-bold text-blue-700">503</p>
        </div>

        <Link to="/admin/rewards">
          <div className="bg-orange-100 hover:bg-orange-200 p-5 rounded-lg shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-1">🎁 Reward System</h3>
            <p className="text-gray-700 text-sm">Manage shop items and assign coin costs.</p>
          </div>
        </Link>

        <Link to="/admin">
          <div className="bg-blue-100 hover:bg-blue-200 p-5 rounded-lg shadow cursor-pointer">
            <h2 className="text-lg font-semibold mb-1">🎥 Start Live Session</h2>
            <p className="text-blue-800 font-bold text-sm">Go to Admin Panel</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
