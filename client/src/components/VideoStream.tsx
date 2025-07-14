import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoStream = () => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sessions/live");
        setVideoUrl(res.data.videoUrl);
      } catch (err) {
        console.error("No live session found");
        setVideoUrl(null);
      }
    };

    fetchSession();
  }, []);

  if (!videoUrl) {
    return <p>🔴 No active live session</p>;
  }

  return (
    <div style={{ margin: "20px 0" }}>
      <h2>🎥 Live Stream</h2>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={videoUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Live Stream"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default VideoStream;
