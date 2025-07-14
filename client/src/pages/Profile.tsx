import React, { useState, ChangeEvent, FormEvent } from "react";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Abhi");
  const [email] = useState("abhi@example.com");
  const [tagline, setTagline] = useState("Frontend Learner");
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white rounded-lg shadow p-6">
        <img
          src={avatar || "/avatar-placeholder.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-gray-600">{email}</p>
          <p className="text-orange-700">{tagline}</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-blue-100 rounded-lg p-4 shadow">
          <p className="text-2xl font-bold text-blue-700">3</p>
          <p>Enrolled Courses</p>
        </div>
        <div className="bg-orange-100 rounded-lg p-4 shadow">
          <p className="text-2xl font-bold text-orange-700">1</p>
          <p>Certificate Earned</p>
        </div>
        <div className="bg-green-100 rounded-lg p-4 shadow">
          <p className="text-2xl font-bold text-green-700">120</p>
          <p>Coins Earned</p>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Upload Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-1"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}
