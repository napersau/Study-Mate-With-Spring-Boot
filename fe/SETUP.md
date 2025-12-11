# Study Mate - English Learning Platform

Nền tảng học tiếng Anh trực tuyến hiện đại với giao diện người dùng thân thiện.

## 🚀 Công nghệ sử dụng

- **React 19.2.1** - Thư viện UI
- **Tailwind CSS 3.x** - Framework CSS hiện đại
- **React Router** - Điều hướng
- **PostCSS & Autoprefixer** - Xử lý CSS

## 📦 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_API_BASE_URL=http://localhost:8080/api
PORT=3000
```

### 3. Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 📁 Cấu trúc dự án

```
src/
├── components/         # Các component tái sử dụng
│   ├── header/        # Header navigation
│   ├── footer/        # Footer
│   └── ...
├── pages/             # Các trang chính
│   ├── home/          # Trang chủ
│   ├── login/         # Trang đăng nhập
│   ├── register/      # Trang đăng ký
│   └── ...
├── routes/            # Cấu hình routing
├── config/            # Cấu hình ứng dụng
├── service/           # API services
├── layout/            # Layout components
└── hooks/             # Custom hooks
```

## 🎨 Tính năng giao diện

### Trang đăng nhập (`/login`)
- Form đăng nhập hiện đại với validation
- Hiển thị/ẩn mật khẩu
- Tùy chọn ghi nhớ đăng nhập
- Đăng nhập với Google/Facebook
- Link quên mật khẩu

### Trang đăng ký (`/register`)
- Form đăng ký đầy đủ thông tin
- Xác nhận mật khẩu
- Checkbox điều khoản dịch vụ
- Đăng ký với Google/Facebook

### Trang chủ (`/`)
- Hero section với gradient động
- Thống kê nổi bật (học viên, khóa học, ...)
- Danh sách tính năng nổi bật
- Danh sách khóa học với filter theo cấp độ
- Section call-to-action

### Header
- Navigation responsive
- User menu dropdown khi đã đăng nhập
- Mobile menu

### Footer
- Thông tin công ty
- Quick links
- Social media links
- Thông tin liên hệ

## 🎨 Tailwind CSS Classes tùy chỉnh

### Buttons
- `.btn-primary` - Button chính (gradient blue)
- `.btn-secondary` - Button phụ (outlined)

### Form Elements
- `.input-field` - Input field với focus effects

### Cards
- `.card` - Card container với shadow và padding

### Animations
- `.animate-fade-in` - Hiệu ứng fade in
- `.animate-slide-up` - Hiệu ứng slide up

## 🎨 Color Palette

### Primary Colors (Blue)
- primary-500: `#3b82f6`
- primary-600: `#2563eb`
- primary-700: `#1d4ed8`

### Secondary Colors (Green)
- secondary-500: `#22c55e`
- secondary-600: `#16a34a`

## 📝 Scripts

```bash
# Khởi động development server
npm start

# Build production
npm run build

# Chạy tests
npm test

# Eject configuration (không khuyến khích)
npm run eject
```

## 🔧 Cấu hình Tailwind

Tailwind được cấu hình trong `tailwind.config.js` với:
- Custom colors (primary, secondary)
- Custom animations
- Font family (Inter)
- Extended theme

## 🌐 Biến môi trường

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `REACT_APP_BACKEND_URL` | URL backend server | `http://localhost:8080` |
| `REACT_APP_API_BASE_URL` | Base URL cho API | `http://localhost:8080/api` |
| `PORT` | Port chạy frontend | `3000` |

## 📱 Responsive Design

Giao diện được thiết kế responsive cho:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🔐 Xác thực

Hệ thống hỗ trợ:
- Đăng nhập bằng email/password
- Đăng nhập bằng Google OAuth
- Đăng nhập bằng Facebook
- Quên mật khẩu

## 📄 License

© 2025 Study Mate. All rights reserved.
