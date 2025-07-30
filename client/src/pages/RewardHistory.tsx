import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Redemption {
  id: number;
  name: string;
  cost: number;
  redeemedAt: string;
}

export default function RewardHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Redemption[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.uid) return;
      try {
        const res = await axios.get(`http://localhost:5000/redemptions/${user.uid}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to load reward history", err);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">My Reward History</h1>
      {history.length === 0 ? (
        <p className="text-gray-600">No rewards claimed yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item) => (
            <li
              key={item.id}
              className="bg-white rounded shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Claimed on {new Date(item.redeemedAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-orange-600 font-bold">{item.cost} Coins</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
