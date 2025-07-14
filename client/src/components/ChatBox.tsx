import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import io from "socket.io-client";

interface ChatMessage {
  username: string;
  text: string;
}

const socket = io("http://localhost:5000");

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const username = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    socket.on("chat message", (msg: ChatMessage) => {
      console.log("📥 Received on client:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      const msgObj: ChatMessage = { username, text: message };
      console.log("📤 Sending:", msgObj);
      socket.emit("chat message", msgObj);
      setMessage("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold text-blue-900 mb-3">Live Chat</h3>

      <div className="h-64 overflow-y-auto space-y-2 mb-4 border rounded p-3 bg-gray-50">
        {messages.map((msg, index) => (
          <p key={index} className="text-sm">
            <strong className="text-orange-700">{msg.username}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          className="flex-grow px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Type a message..."
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
