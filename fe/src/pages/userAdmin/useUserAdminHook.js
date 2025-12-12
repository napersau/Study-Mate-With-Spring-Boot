import { useState, useEffect } from 'react';
import { getAllUsers, toggleActiveUser } from '../../service/userService';

const useUserAdminHook = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      if (response.code === 1000) {
        setUsers(response.result || []);
      }
    } catch (error) {
      showNotification('Lỗi khi tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
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

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    notification,
    handleToggleUserStatus
  };
};

export default useUserAdminHook;
