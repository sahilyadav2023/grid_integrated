import React from "react";
import NextSessionTimer from "../components/NextSessionTimer";

export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Hello, Abhi!</h2>


      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-100 rounded-lg p-4 text-center shadow">
          <span className="text-2xl">💰</span>
          <p>
            <strong className="text-lg">120</strong>
            <br />
            Coins
          </p>
        </div>
        <div className="bg-green-100 rounded-lg p-4 text-center shadow">
          <span className="text-2xl">✅</span>
          <p>
            <strong className="text-lg">3</strong>
            <br />
            Completed
          </p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center shadow">
          <span className="text-2xl">📄</span>
          <p>
            <strong className="text-lg">2</strong>
            <br />
            Certificates
          </p>
        </div>
      </div>
      {/* ⏱ Upcoming Session Countdown */}
      <NextSessionTimer />

      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-semibold mb-1">Continue Learning</h3>
        <p className="mb-3 text-gray-700">How to Prepare for Interviews</p>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Resume
        </button>
      </div>

      <h3 className="text-xl font-semibold">Recommended for You</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-100 rounded-lg p-4 text-center">Effective Communic.</div>
        <div className="bg-indigo-100 rounded-lg p-4 text-center">Data Analysis Fundamentals</div>
      </div>

      <h3 className="text-xl font-semibold">Recommended for You</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-100 rounded-lg p-4 text-center">Effective Communic.</div>
        <div className="bg-indigo-100 rounded-lg p-4 text-center">Project Management Essentials</div>
      </div>
    </div>
  );
}
