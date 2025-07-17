import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  const handleStartSession = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/live-session/start", {
        title,
        video_url: videoUrl, // ✅ field name corrected
      });
      alert("Live session started!");
      setTitle("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
      alert("Failed to start session.");
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentSession?.id) return;
    try {
      await axios.put(
        `http://localhost:5000/api/upcoming-session/${currentSession.id}`,
        currentSession
      );
      alert("Upcoming session updated!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update session.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentSession({
      ...currentSession,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/upcoming-session");
        setCurrentSession(res.data);
      } catch (err) {
        console.error("No session found to edit.");
      }
    };
    fetchSession();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">Admin Panel</h1>

      {/* Live session form */}
      <h2 className="text-xl font-semibold mb-3">Start a Live Session</h2>
      <form onSubmit={handleStartSession} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Session Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">YouTube Embed URL:</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)}
            required
            placeholder="e.g. https://www.youtube.com/embed/stream-id"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Start Session
        </button>
      </form>

      {/* Edit Upcoming Session */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Edit Upcoming Session</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editMode ? "Close Editor" : "Edit Existing Session"}
        </button>

        {editMode && currentSession && (
          <form onSubmit={handleEditSubmit} className="mt-6 space-y-4 bg-gray-100 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">Title:</label>
              <input
                type="text"
                name="title"
                value={currentSession.title}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Speaker:</label>
              <input
                type="text"
                name="speaker"
                value={currentSession.speaker}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scheduled At:</label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={currentSession.scheduled_at?.slice(0, 16) || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
