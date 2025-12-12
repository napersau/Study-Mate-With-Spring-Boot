import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../service/authenticationService';
import { useAuth } from '../../context/AuthContext';

const useLoginHook = () => {
  const navigate = useNavigate();
  const { updateUserInfo } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      
      if (response.code === 1000) {
        updateUserInfo();
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    formData,
    showPassword,
    error,
    success,
    loading,
    handleChange,
    handleSubmit,
    togglePassword
  };
};

export default useLoginHook;
