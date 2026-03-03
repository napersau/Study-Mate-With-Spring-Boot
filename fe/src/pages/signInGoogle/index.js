import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithGoogle } from '../../service/authenticationService';
import { useAuth } from '../../context/AuthContext';

const SignInGoogle = () => {
  const navigate = useNavigate();
  const { updateUserInfo } = useAuth();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const response = await loginWithGoogle();

        if (response.code === 1000) {
          updateUserInfo();
          setStatus('success');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setStatus('error');
          setErrorMessage(response.message || 'Đăng nhập Google thất bại');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.'
        );
      }
    };

    handleGoogleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="card bg-white dark:bg-gray-800 shadow-xl p-8 animate-slide-up">
            <div className="flex flex-col items-center space-y-4">
              {/* Spinner */}
              <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Đang xác thực với Google...
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="card bg-white dark:bg-gray-800 shadow-xl p-8 animate-slide-up">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Đăng nhập thành công!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đang chuyển hướng về trang chủ...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="card bg-white dark:bg-gray-800 shadow-xl p-8 animate-slide-up">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Đăng nhập thất bại
              </h2>
              <p className="text-red-500 dark:text-red-400 text-sm">{errorMessage}</p>
              <Link
                to="/login"
                className="mt-2 inline-flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInGoogle;
