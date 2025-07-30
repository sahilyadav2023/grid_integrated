import React, { useEffect, useState } from "react";
import axios from "axios";

interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
  googleFormLink?: string;
}

export default function AdminRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [form, setForm] = useState<Partial<Reward>>({});
  const [editId, setEditId] = useState<number | null>(null);

  const fetchRewards = async () => {
    const res = await axios.get("http://localhost:5000/shop");
    setRewards(res.data);
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.cost) {
        alert("Name and cost are required.");
        return;
      }

      if (editId !== null) {
        await axios.put(`http://localhost:5000/shop/edit/${editId}`, form);
        alert("Item updated");
      } else {
        await axios.post("http://localhost:5000/shop/add", form);
        alert("Item added");
      }

      setForm({});
      setEditId(null);
      fetchRewards();
    } catch (err) {
      console.error("Error saving reward", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://localhost:5000/shop/delete/${id}`);
    fetchRewards();
  };

  const handleEdit = (reward: Reward) => {
    setForm(reward);
    setEditId(reward.id);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin: Manage Rewards</h1>

      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {editId !== null ? "Edit Reward" : "Add New Reward"}
        </h2>
        <input
          type="text"
          placeholder="Name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Cost"
          value={form.cost || ""}
          onChange={(e) => setForm({ ...form, cost: parseInt(e.target.value) })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Google Form Link"
          value={form.googleFormLink || ""}
          onChange={(e) => setForm({ ...form, googleFormLink: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          {editId !== null ? "Update" : "Add"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Current Rewards</h2>
      <div className="grid gap-4">
        {rewards.map((r) => (
          <div key={r.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{r.name}</h3>
              <p className="text-gray-600">{r.description}</p>
              <p className="text-orange-600 font-semibold">{r.cost} coins</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(r)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
