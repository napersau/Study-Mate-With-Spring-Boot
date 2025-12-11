/**
 * Decode JWT token và lấy payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload hoặc null nếu token không hợp lệ
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    // JWT có format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode base64 payload (phần thứ 2)
    const payload = parts[1];
    
    // Thay thế các ký tự đặc biệt của base64url về base64 chuẩn
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Kiểm tra xem token đã hết hạn chưa
 * @param {string} token - JWT token
 * @returns {boolean} true nếu token còn hiệu lực
 */
export const isTokenValid = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return false;
  }

  // exp là timestamp tính bằng giây, cần nhân 1000 để so sánh với Date.now()
  const expirationTime = payload.exp * 1000;
  return Date.now() < expirationTime;
};

/**
 * Lấy thông tin user từ token
 * @param {string} token - JWT token
 * @returns {object|null} User info {username, role, issuer, exp} hoặc null
 */
export const getUserFromToken = (token) => {
  const payload = decodeToken(token);
  if (!payload) {
    return null;
  }

  return {
    username: payload.sub || payload.subject, // subject chứa username
    role: payload.scope, // scope chứa role
    issuer: payload.iss, // issuer
    expirationTime: payload.exp ? new Date(payload.exp * 1000) : null,
    jwtId: payload.jti
  };
};
