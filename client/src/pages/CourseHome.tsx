import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Star, Clock, Users } from 'lucide-react';

const CourseHome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', 'Programming', 'Design', 'Business', 'AI & ML', 'Photography'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
console.log("Fetched Courses:", courses);
  return (
    
    <div className="min-h-screen bg-custom-gray-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="h-12" />
        <div className="flex gap-4">
          <img src="/logo2.png" alt="Logo2" className="h-10" />
          <img src="/logo3.png" alt="Logo3" className="h-10" />
        </div>
      </header>

      {/* Search */}
      <section className="p-6 max-w-6xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for courses..."
            className="w-full pl-12 pr-4 py-4 border rounded-xl text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full border font-medium ${
                selectedCategory === cat
                  ? 'bg-custom-blue-dark text-white'
                  : 'bg-white text-custom-gray-text hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow p-5">
              <img
                src={course.image || 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=250&fit=crop'}
                alt={course.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-lg font-bold mb-1 text-custom-blue-dark">{course.title}</h3>
              <p className="text-sm text-custom-gray-text mb-2">by {course.instructor}</p>
              <div className="flex items-center gap-3 text-sm text-custom-gray-text mb-4">
                <div className="flex items-center gap-1">
                  <Star size={14} /> {typeof course.rating === 'number' ? course.rating : 'N/A'}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} /> {typeof course.students === 'number' ? course.students : 'N/A'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} /> {typeof course.duration === 'string' ? course.duration : 'N/A'}
                </div>
              </div>
              <Link to={`/dashboard/courses/modules/${course.id}`}>

                <button className="bg-custom-orange text-white w-full py-2 rounded font-semibold hover:bg-orange-600">
                  Enroll Now
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CourseHome;
