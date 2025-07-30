import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Video {
  id: number;
  title: string;
  url: string;
}

interface Module {
  id: number;
  title: string;
  Video: Video[];
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  Module: Module[];
}

const CourseModules = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  useEffect(() => {
    axios.get(`http://localhost:5000/courses/${id}`)
      .then(res => {
        setCourse(res.data);
        const first = res.data?.Module?.[0]?.Video?.[0];
        if (first) setCurrentVideo(first);
      })
      .catch(err => console.error(err));
  }, [id]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      newSet.has(moduleId) ? newSet.delete(moduleId) : newSet.add(moduleId);
      return newSet;
    });
  };

  if (!course) return <div className="p-6 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-custom-gray-light">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4 shadow-md">
        <h2 className="text-xl font-bold text-custom-blue-dark mb-4">Modules</h2>
        {course.Module.map(mod => (
          <div key={mod.id} className="mb-4">
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full text-left font-semibold text-custom-blue-dark hover:text-custom-orange transition-colors"
            >
              {mod.title}
            </button>
            {expandedModules.has(mod.id) && (
              <ul className="mt-2 pl-4 border-l border-gray-300">
                {mod.Video.map(video => (
                  <li key={video.id}>
                    <button
                      className={`block w-full text-left py-1 px-2 rounded hover:bg-custom-orange hover:text-white ${
                        currentVideo?.id === video.id ? 'bg-custom-orange text-white' : 'text-custom-gray-text'
                      }`}
                      onClick={() => setCurrentVideo(video)}
                    >
                      {video.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="w-3/4 p-8">
        <h1 className="text-3xl font-bold mb-2 text-custom-blue-dark">{course.title}</h1>
        <p className="text-lg mb-6 text-custom-gray-text">Instructor: {course.instructor}</p>

        {currentVideo ? (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-custom-orange">{currentVideo.title}</h2>
            <iframe
              src={currentVideo.url.replace('watch?v=', 'embed/')}
              title={currentVideo.title}
              className="w-full h-[400px] rounded shadow"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-gray-500">Select a video to start learning</p>
        )}
      </div>
    </div>
  );
};

export default CourseModules;
