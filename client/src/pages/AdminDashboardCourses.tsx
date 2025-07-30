import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboardCourses = () => {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  const [courseForm, setCourseForm] = useState({
    title: '',
    instructor: '',
    category: '',
    image: '',
    rating: 4.5,
    students: 0,
    duration: '',
    description: ''
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    course_id: ''
  });

  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    module_id: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/courses').then(res => setCourses(res.data));
  }, []);

  const fetchModules = (courseId: string) => {
    axios.get(`http://localhost:5000/modules/${courseId}`).then(res => setModules(res.data));
  };

  const handleAddCourse = async () => {
    await axios.post('http://localhost:5000/courses', courseForm);
    alert('Course added!');
    setCourseForm({ title: '', instructor: '', category: '', image: '', rating: 4.5, students: 0, duration: '', description: '' });
    const res = await axios.get('http://localhost:5000/courses');
    setCourses(res.data);
  };

  const handleAddModule = async () => {
    await axios.post('http://localhost:5000/modules', moduleForm);
    alert('Module added!');
    setModuleForm({ title: '', course_id: '' });
  };

  const handleAddVideo = async () => {
    await axios.post('http://localhost:5000/videos', videoForm);
    alert('Video added!');
    setVideoForm({ title: '', url: '', module_id: '' });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-custom-blue-dark mb-6">Admin Dashboard</h1>

      {/* Add Course */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-custom-orange">Add Course</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(courseForm).map(([key, val]) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              value={val}
              onChange={(e) => setCourseForm(prev => ({ ...prev, [key]: e.target.value }))}
              className="border p-2 rounded"
            />
          ))}
        </div>
        <button onClick={handleAddCourse} className="mt-4 bg-custom-blue-dark text-white px-4 py-2 rounded">Add Course</button>
      </div>

      {/* Add Module */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-custom-orange">Add Module</h2>
        <select
          value={moduleForm.course_id}
          onChange={(e) => {
            setModuleForm(prev => ({ ...prev, course_id: e.target.value }));
            fetchModules(e.target.value);
          }}
          className="mb-2 p-2 border rounded w-full"
        >
          <option value="">Select Course</option>
          {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <input
          type="text"
          placeholder="Module Title"
          value={moduleForm.title}
          onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
          className="mb-2 p-2 border rounded w-full"
        />
        <button onClick={handleAddModule} className="bg-custom-blue-dark text-white px-4 py-2 rounded">Add Module</button>
      </div>

      {/* Add Video */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-custom-orange">Add Video</h2>
        <select
          value={videoForm.module_id}
          onChange={(e) => setVideoForm(prev => ({ ...prev, module_id: e.target.value }))}
          className="mb-2 p-2 border rounded w-full"
        >
          <option value="">Select Module</option>
          {modules.map((m: any) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <input
          type="text"
          placeholder="Video Title"
          value={videoForm.title}
          onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="YouTube Embed URL"
          value={videoForm.url}
          onChange={(e) => setVideoForm(prev => ({ ...prev, url: e.target.value }))}
          className="mb-2 p-2 border rounded w-full"
        />
        <button onClick={handleAddVideo} className="bg-custom-blue-dark text-white px-4 py-2 rounded">Add Video</button>
      </div>
    </div>
  );
};

export default AdminDashboardCourses;
