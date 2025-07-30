import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Submission {
  id: number;
  title: string;
  points: number;
  submittedAt: string;
}

export default function TaskHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.uid) return;
      try {
        const res = await axios.get(`http://localhost:5000/submissions/${user.uid}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to load task submission history", err);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">My Task Submissions</h1>
      {history.length === 0 ? (
        <p className="text-gray-600">No tasks submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((task) => (
            <li
              key={task.id}
              className="bg-white rounded shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-500">
                  Submitted on {new Date(task.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-green-600 font-bold">{task.points} pts</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
