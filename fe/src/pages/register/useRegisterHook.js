import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../service/authenticationService';

const useRegisterHook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.username.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email
      };

      const response = await register(userData);
      
      if (response.code === 1000) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    formData,
    showPassword,
    showConfirmPassword,
    error,
    success,
    loading,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword
  };
};

export default useRegisterHook;
