import React, { useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
import axios from "axios";
import { io } from "socket.io-client";

interface Session {
  title: string;
  video_url: string; // 🔄 update to match Supabase field
}

interface ChatMessage {
  user: string;
  text: string;
}

const socket = io("http://localhost:5000");

export default function LiveSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [username] = useState<string>("User" + Math.floor(Math.random() * 1000));

  useEffect(() => {
    const fetchLiveSession = async () => {
      try {
        const res = await axios.get<Session>("http://localhost:5000/api/live-session/live");
        setSession(res.data);
      } catch {
        setError("No active session at the moment.");
      }
    };

    fetchLiveSession();

    socket.on("chatMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("/embed/")) {
      return `${url}?autoplay=1&controls=0&modestbranding=1&rel=0`;
    }
    try {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`;
    } catch {
      return "";
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      const msg: ChatMessage = { user: username, text: input };
      socket.emit("chatMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-6 p-4">
      {session ? (
        <>
          <div className="w-full md:w-2/3">
            <div className="inline-block px-3 py-1 text-sm text-white bg-red-600 rounded-full mb-2">
              LIVE
            </div>
            <h2 className="mb-4 text-xl font-semibold">
              LIVE Q&A WITH{" "}
              <span className="text-orange-800 font-bold">{session.title}</span>
            </h2>
            <div className="w-full overflow-hidden rounded-lg shadow-lg aspect-video">
              <iframe
                className="w-full h-full"
                src={getEmbedUrl(session.video_url)} // 🔄 match field name
                title="Live Video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>

          <div className="w-full md:w-1/3 bg-gray-100 rounded-lg p-4 shadow-md h-full flex flex-col">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">LIVE CHAT</h3>

            <div className="flex-grow space-y-3 overflow-y-auto pr-2 mb-3">
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500"></div>
                  <div>
                    <strong>{msg.user}</strong>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message..."
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                onClick={handleSend}
              >
                ➤
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-red-600 text-lg text-center w-full">{error}</p>
      )}
    </div>
  );
}
