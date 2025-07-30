import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
}

interface Submission {
  id: number;
  title: string;
  points: number;
  submittedAt: string;
}

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<Submission[]>([]);
  const [mediaUrl, setMediaUrl] = useState<{ [taskId: number]: string }>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/tasks/unsubmitted/${user?.uid}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/submissions/${user?.uid}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load submission history", err);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchTasks();
      fetchHistory();
    }
  }, [user]);

  const handleSubmit = async (taskId: number) => {
    const media = mediaUrl[taskId];
    if (!media) return alert("Please provide a submission link.");

    try {
      setLoadingId(taskId);
      await axios.post("http://localhost:5000/tasks/submit", {
        uid: user!.uid,
        taskId,
        mediaUrl: media,
      });
      alert("✅ Task submitted!");
      fetchTasks();     // refresh list
      fetchHistory();   // refresh history
    } catch (err: any) {
      alert("❌ Submission failed: " + err?.response?.data?.error || err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">📋 Available Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-600">No new tasks to submit. You're all caught up!</p>
      ) : (
        <div className="space-y-6 mb-10">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white shadow rounded p-5">
              <h2 className="font-semibold text-lg">{task.title}</h2>
              <p className="text-gray-700 mb-2">{task.description}</p>
              <p className="text-green-700 font-medium mb-2">+{task.points} pts</p>
              <input
                type="url"
                placeholder="Enter submission link"
                value={mediaUrl[task.id] || ""}
                onChange={(e) =>
                  setMediaUrl({ ...mediaUrl, [task.id]: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mb-3"
              />
              <button
                onClick={() => handleSubmit(task.id)}
                disabled={loadingId === task.id}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingId === task.id ? "Submitting..." : "Submit Task"}
              </button>
            </div>
          ))}
        </div>
      )}

      <h1 className="text-xl font-bold text-gray-800 mb-3">📜 Submitted Tasks</h1>
      {history.length === 0 ? (
        <p className="text-gray-500">No submissions yet.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li key={item.id} className="bg-gray-50 border rounded p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(item.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-green-600 font-medium">+{item.points} pts</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
