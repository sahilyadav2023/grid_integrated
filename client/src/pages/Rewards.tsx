import React, { useEffect, useState } from "react";
import axios from "axios";

interface Reward {
  id: number;
  name: string;
  cost: number;
}

export default function Rewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/shop");
        setRewards(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRewards();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Available Rewards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-2">{reward.name}</h2>
            <p className="text-orange-600 font-bold">{reward.cost} Coins</p>
          </div>
        ))}
      </div>
    </div>
  );
}
