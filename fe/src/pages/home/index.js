import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'English for Beginners',
      description: 'Khóa học dành cho người mới bắt đầu học tiếng Anh',
      level: 'beginner',
      students: 1234,
      lessons: 45,
      duration: '3 tháng',
      image: '🎯',
      progress: 0
    },
    {
      id: 2,
      title: 'Business English',
      description: 'Tiếng Anh giao tiếp trong môi trường công sở',
      level: 'intermediate',
      students: 856,
      lessons: 38,
      duration: '2 tháng',
      image: '💼',
      progress: 35
    },
    {
      id: 3,
      title: 'IELTS Preparation',
      description: 'Chuẩn bị cho kỳ thi IELTS đạt điểm cao',
      level: 'advanced',
      students: 2341,
      lessons: 60,
      duration: '4 tháng',
      image: '📚',
      progress: 0
    },
    {
      id: 4,
      title: 'Conversation Practice',
      description: 'Luyện nói tiếng Anh hàng ngày',
      level: 'intermediate',
      students: 987,
      lessons: 30,
      duration: '6 tuần',
      image: '💬',
      progress: 60
    }
  ];

  const features = [
    {
      icon: '🎓',
      title: 'Học mọi lúc, mọi nơi',
      description: 'Truy cập khóa học trên mọi thiết bị'
    },
    {
      icon: '👨‍🏫',
      title: 'Giáo viên chuyên nghiệp',
      description: 'Đội ngũ giảng viên giàu kinh nghiệm'
    },
    {
      icon: '📊',
      title: 'Theo dõi tiến độ',
      description: 'Báo cáo chi tiết quá trình học tập'
    },
    {
      icon: '🏆',
      title: 'Chứng chỉ hoàn thành',
      description: 'Nhận chứng chỉ sau khi hoàn thành khóa học'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Học viên' },
    { value: '50+', label: 'Khóa học' },
    { value: '95%', label: 'Hài lòng' },
    { value: '24/7', label: 'Hỗ trợ' }
  ];

  const filteredCourses = selectedLevel === 'all' 
    ? courses 
    : courses.filter(course => course.level === selectedLevel);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Học tiếng Anh
              <br />
              <span className="text-secondary-300">Cùng Study Mate</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Nền tảng học tiếng Anh trực tuyến hiện đại với phương pháp giảng dạy độc đáo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 text-lg transform hover:scale-105">
                Bắt đầu học ngay
              </Link>
              <button className="btn-secondary bg-transparent border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                Xem khóa học
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-slide-up">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Study Mate?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp trải nghiệm học tập tốt nhất cho bạn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khóa học phổ biến
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Chọn khóa học phù hợp với trình độ của bạn
            </p>

            {/* Level Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setSelectedLevel('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedLevel === 'all'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedLevel('beginner')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedLevel === 'beginner'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cơ bản
              </button>
              <button
                onClick={() => setSelectedLevel('intermediate')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedLevel === 'intermediate'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Trung cấp
              </button>
              <button
                onClick={() => setSelectedLevel('advanced')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedLevel === 'advanced'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Nâng cao
              </button>
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="text-6xl text-center mb-4">{course.image}</div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                    course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {course.level === 'beginner' ? 'Cơ bản' :
                     course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                  </span>
                  <span className="text-gray-500 text-sm">{course.duration}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    {course.students}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                    </svg>
                    {course.lessons} bài
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Tiến độ</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button className="w-full btn-primary">
                  {course.progress > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng bắt đầu hành trình của bạn?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Tham gia cùng hàng ngàn học viên đang cải thiện tiếng Anh mỗi ngày
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Đăng ký miễn phí ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
