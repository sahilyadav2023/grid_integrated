import React, { useEffect, useState } from "react";
import axios from "axios";

interface Submission {
  id: number;
  mediaUrl: string;
  submittedAt: string;
  userName: string;
  userEmail: string;
  taskTitle: string;
  taskPoints: number;
}

export default function AdminTaskReview() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [declineReasons, setDeclineReasons] = useState<{ [id: number]: string }>({});

  const fetchPendingSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/submissions/pending/all");
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    }
  };

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const handleDecision = async (id: number, decision: "approved" | "rejected") => {
    const reason = declineReasons[id] || "";

    if (decision === "rejected" && !reason.trim()) {
      return alert("Please provide a reason for rejection.");
    }

    try {
      setLoadingId(id);
      await axios.post(`http://localhost:5000/submissions/${id}/decision`, {
        decision,
        reason,
      });
      alert(`✅ Submission ${decision}`);
      fetchPendingSubmissions();
    } catch (err: any) {
      alert("❌ Failed to update: " + err?.response?.data?.error || err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Pending Task Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-600">No pending submissions.</p>
      ) : (
        <div className="space-y-6">
          {submissions.map((s) => (
            <div key={s.id} className="bg-white rounded shadow p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{s.taskTitle}</h2>
                  <p className="text-sm text-gray-500">
                    By {s.userName} ({s.userEmail}) on{" "}
                    {new Date(s.submittedAt).toLocaleDateString()}
                  </p>
                  <p className="text-green-600 font-medium">+{s.taskPoints} pts</p>
                </div>
                <a
                  href={s.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Submission
                </a>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <input
                  type="text"
                  placeholder="Reason for rejection (optional)"
                  value={declineReasons[s.id] || ""}
                  onChange={(e) =>
                    setDeclineReasons({ ...declineReasons, [s.id]: e.target.value })
                  }
                  className="flex-1 border px-3 py-2 rounded"
                />
                <button
                  onClick={() => handleDecision(s.id, "rejected")}
                  disabled={loadingId === s.id}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDecision(s.id, "approved")}
                  disabled={loadingId === s.id}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
