import React, { useState, useEffect } from 'react';
import { createFlashcard, getAllFlashcards, updateFlashcard, deleteFlashcard } from '../../service/flashcardsService';
import { getAllUsers, toggleActiveUser } from '../../service/userService';

const AdminHome = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'flashcards'
  
  // User Management State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Flashcard Management State
  const [flashcards, setFlashcards] = useState([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [flashcardForm, setFlashcardForm] = useState({
    front: '',
    back: '',
    category: ''
  });
  
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch Users
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch Flashcards
  useEffect(() => {
    if (activeTab === 'flashcards') {
      fetchFlashcards();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await getAllUsers();
      if (response.code === 1000) {
        setUsers(response.result || []);
      }
    } catch (error) {
      showNotification('Lỗi khi tải danh sách người dùng', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchFlashcards = async () => {
    setLoadingFlashcards(true);
    try {
      const response = await getAllFlashcards();
      if (response.code === 1000) {
        setFlashcards(response.result || []);
      }
    } catch (error) {
      showNotification('Lỗi khi tải danh sách flashcard', 'error');
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await toggleActiveUser(userId, !currentStatus);
      if (response.code === 1000) {
        showNotification('Cập nhật trạng thái thành công', 'success');
        fetchUsers();
      }
    } catch (error) {
      showNotification('Lỗi khi cập nhật trạng thái người dùng', 'error');
    }
  };

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    try {
      const response = await createFlashcard(flashcardForm);
      if (response.code === 1000) {
        showNotification('Tạo flashcard thành công', 'success');
        setShowFlashcardModal(false);
        resetFlashcardForm();
        fetchFlashcards();
      }
    } catch (error) {
      showNotification('Lỗi khi tạo flashcard', 'error');
    }
  };

  const handleUpdateFlashcard = async (e) => {
    e.preventDefault();
    try {
      const response = await updateFlashcard(editingFlashcard.id, flashcardForm);
      if (response.code === 1000) {
        showNotification('Cập nhật flashcard thành công', 'success');
        setShowFlashcardModal(false);
        setEditingFlashcard(null);
        resetFlashcardForm();
        fetchFlashcards();
      }
    } catch (error) {
      showNotification('Lỗi khi cập nhật flashcard', 'error');
    }
  };

  const handleDeleteFlashcard = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa flashcard này?')) {
      try {
        const response = await deleteFlashcard(id);
        if (response.code === 1000) {
          showNotification('Xóa flashcard thành công', 'success');
          fetchFlashcards();
        }
      } catch (error) {
        showNotification('Lỗi khi xóa flashcard', 'error');
      }
    }
  };

  const openEditModal = (flashcard) => {
    setEditingFlashcard(flashcard);
    setFlashcardForm({
      front: flashcard.front,
      back: flashcard.back,
      category: flashcard.category
    });
    setShowFlashcardModal(true);
  };

  const resetFlashcardForm = () => {
    setFlashcardForm({ front: '', back: '', category: '' });
    setEditingFlashcard(null);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trang Quản Trị
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Quản lý người dùng và flashcards
          </p>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mb-4 p-4 rounded-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          } animate-fade-in`}>
            {notification.message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Quản lý Người dùng</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'flashcards'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Quản lý Flashcards</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Users Table */}
            {loadingUsers ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.fullName || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.phoneNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {user.role || 'USER'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.active ? 'Hoạt động' : 'Bị khóa'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.active)}
                            className={`${
                              user.active 
                                ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                                : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                            }`}
                          >
                            {user.active ? 'Khóa' : 'Mở khóa'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Không tìm thấy người dùng nào
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Flashcard Management Tab */}
        {activeTab === 'flashcards' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Add Button */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Danh sách Flashcards
              </h2>
              <button
                onClick={() => {
                  resetFlashcardForm();
                  setShowFlashcardModal(true);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Thêm Flashcard</span>
              </button>
            </div>

            {/* Flashcards Grid */}
            {loadingFlashcards ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flashcards.map((flashcard) => (
                  <div key={flashcard.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="mb-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {flashcard.category || 'Chưa phân loại'}
                      </span>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Mặt trước:</h3>
                      <p className="text-gray-900 dark:text-white">{flashcard.front}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Mặt sau:</h3>
                      <p className="text-gray-900 dark:text-white">{flashcard.back}</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(flashcard)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteFlashcard(flashcard.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loadingFlashcards && flashcards.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Chưa có flashcard nào. Hãy thêm flashcard mới!
              </div>
            )}
          </div>
        )}

        {/* Flashcard Modal */}
        {showFlashcardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingFlashcard ? 'Chỉnh sửa Flashcard' : 'Thêm Flashcard Mới'}
              </h3>
              <form onSubmit={editingFlashcard ? handleUpdateFlashcard : handleCreateFlashcard}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Danh mục
                  </label>
                  <input
                    type="text"
                    value={flashcardForm.category}
                    onChange={(e) => setFlashcardForm({ ...flashcardForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ví dụ: Từ vựng, Ngữ pháp..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mặt trước *
                  </label>
                  <textarea
                    value={flashcardForm.front}
                    onChange={(e) => setFlashcardForm({ ...flashcardForm, front: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="3"
                    required
                    placeholder="Nhập nội dung mặt trước..."
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mặt sau *
                  </label>
                  <textarea
                    value={flashcardForm.back}
                    onChange={(e) => setFlashcardForm({ ...flashcardForm, back: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="3"
                    required
                    placeholder="Nhập nội dung mặt sau..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFlashcardModal(false);
                      setEditingFlashcard(null);
                      resetFlashcardForm();
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingFlashcard ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
