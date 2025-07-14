import { useEffect, useState } from "react";
import axios from "axios";

interface UpcomingSession {
  id?: number;
  title: string;
  speaker?: string;
  scheduled_at: string;
}

export default function NextSessionTimer() {
  const [session, setSession] = useState<UpcomingSession | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  // Auto-refresh session data every 10s
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/upcoming-session");
        setSession(res.data);
      } catch (err) {
        console.error("No upcoming session found.");
        setSession(null);
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 10000);
    return () => clearInterval(interval);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!session?.scheduled_at) return;

    const countdown = setInterval(() => {
      const now = new Date().getTime();
      const sessionTime = new Date(session.scheduled_at).getTime();
      const diff = sessionTime - now;

      if (diff <= 0) {
        setTimeLeft("Starting now!");
        clearInterval(countdown);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [session]);

  if (!session) return null;

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-10 text-center">
      <h3 className="text-xl font-semibold text-blue-900">⏳ Next Live Session</h3>
      <p className="text-lg font-medium mt-2 text-orange-600">{session.title}</p>
      {session.speaker && (
        <p className="text-sm text-gray-600">with {session.speaker}</p>
      )}
      <p className="text-sm text-gray-500 mb-1">
        Scheduled at: {new Date(session.scheduled_at).toLocaleString()}
      </p>
      <p className="text-xl font-bold text-red-600">{timeLeft}</p>
    </div>
  );
}
