import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  uid: string;
  name: string;
  email: string;
  points: number;
  tokens: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/leaderboard");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Leaderboard</h1>
      <div className="bg-white rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Rank</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="p-3 border-b">{index + 1}</td>
                <td className="p-3 border-b">{user.name || "Unnamed"}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b font-semibold text-orange-600">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
