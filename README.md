# 🎓 QuizHub - Hệ thống Quản lý Kỳ thi Trung tâm Ngoại ngữ - Tin học

## 📖 Giới thiệu

QuizHub là một hệ thống quản lý kỳ thi, được xây dựng nhằm số hóa quy trình quản lý thông tin kỳ thi, học viên và điểm số cho các Trung tâm Ngoại ngữ - Tin học. Hệ thống giúp giảm thiểu sai sót, tiết kiệm thời gian và nâng cao hiệu quả quản lý so với phương pháp thủ công truyền thống.

## 🎯 Mục tiêu

- ✅ Số hóa quy trình quản lý kỳ thi
- ✅ Quản lý kỳ thi, môn thi, học viên và kết quả thi chính xác, minh bạch
- ✅ Hỗ trợ nhập điểm nhanh chóng (thủ công hoặc import Excel)
- ✅ Tra cứu điểm thi trực tuyến
- ✅ Phân quyền người dùng rõ ràng (Admin - Giám thị - Học viên)
- ✅ Thống kê, báo cáo và xuất dữ liệu Excel

## 👥 Đối tượng sử dụng

### 🔑 Admin (Quản trị viên)
- Quản lý toàn bộ hệ thống
- Thêm/sửa/xóa người dùng, môn thi, kỳ thi
- Quản lý học viên/thí sinh
- Quản lý điểm thi (xem, sửa, xóa)
- Thống kê và xuất báo cáo Excel

### 👨‍🏫 Giáo viên
- Xem danh sách học viên
- Nhập điểm thủ công hoặc import từ Excel
- Lưu và cập nhật điểm thi

### 🎓 Học viên / Thí sinh
- Đăng nhập vào hệ thống
- Tra cứu điểm thi
- Xem lịch sử các kỳ thi đã tham gia
- Cập nhật thông tin cá nhân

## ✨ Tính năng chính

### Phiên bản 1.0 (Core Features)
- 🔐 Đăng nhập/Đăng ký với phân quyền
- 📚 Quản lý môn thi và kỳ thi
- 👨‍🎓 Quản lý học viên/thí sinh
- 📊 Nhập điểm (thủ công hoặc import Excel)
- 🔍 Tra cứu điểm thi
- 📈 Thống kê và báo cáo
- 📄 Xuất dữ liệu ra Excel

### Tính năng mở rộng (Roadmap)
- 📝 Thi trắc nghiệm trực tuyến
- 🤖 Chấm điểm tự động
- 📧 Gửi email thông báo kết quả
- 🎖️ Tạo chứng chỉ điện tử
- 📊 Biểu đồ thống kê kết quả (Chart.js)

## 🛠️ Công nghệ sử dụng

### Frontend
- **Framework**: Next.js 16.0.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui (planned)
- **Charts**: Chart.js
- **Fonts**: Geist Sans, Geist Mono

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: RESTful API
- **Authentication**: JWT / Passport.js

### Database
- **Database**: MongoDB
- **Cloud Database**: MongoDB Atlas
- **ODM**: Mongoose

### Tools & Libraries
- **Email**: NodeMailer
- **Environment**: dotenv
- **Version Control**: Git/GitHub
- **Deployment**: Vercel (Frontend) / Render (Backend)
- **Containerization**: Docker (optional)

## 📊 Cơ sở dữ liệu

### Các collection chính (MongoDB)

```
users           - Quản lý người dùng (Admin, Giám thị, Học viên)
subjects        - Quản lý môn thi
exams           - Quản lý kỳ thi
students        - Thông tin học viên/thí sinh
scores          - Điểm số và kết quả
```

### Mối quan hệ
- Một kỳ thi thuộc một môn thi
- Một học viên có thể có nhiều điểm thi
- Mỗi điểm thi liên kết với một kỳ thi và một học viên

## 🏗️ Kiến trúc hệ thống

Hệ thống được xây dựng theo mô hình **3 lớp (3-tier architecture)**:

1. **Presentation Layer** (Giao diện)
   - Next.js với App Router
   - Responsive design với Tailwind CSS

2. **Application Layer** (Xử lý nghiệp vụ)
   - Node.js + Express.js
   - RESTful API
   - Business logic & validation

3. **Data Layer** (Lưu trữ dữ liệu)
   - MySQL/MongoDB
   - ORM (Sequelize/Prisma)

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18.x
- npm/yarn/pnpm
- MongoDB >= 6.0 hoặc MongoDB Atlas account

### Cài đặt

```bash
# Clone repository
git clone https://github.com/your-username/quizhub.git
cd quizhub

# Cài đặt dependencies
npm install
# hoặc
yarn install
# hoặc
pnpm install

# Cấu hình environment variables
cp .env.example .env.local
# Chỉnh sửa file .env.local với thông tin database và cấu hình của bạn

# Chạy database migrations (sẽ cập nhật sau)
npm run migrate

# Chạy development server
npm run dev
```

### Truy cập ứng dụng

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

## 📁 Cấu trúc thư mục

```
quizhub/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (admin)/           # Admin dashboard
│   ├── (teacher)/         # Teacher dashboard
│   ├── (student)/         # Student portal
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── lib/                   # Utility functions
│   ├── db/               # Database connection
│   ├── auth/             # Authentication helpers
│   └── utils/            # Helper functions
├── types/                 # TypeScript types
├── public/               # Static files
├── demoappv1/            # Project documentation
└── README.md             # This file
```

## 🔒 Bảo mật

- ✅ Mã hóa mật khẩu với bcrypt
- ✅ Xác thực JWT (JSON Web Token)
- ✅ Phân quyền dựa trên vai trò (RBAC)
- ✅ Bảo vệ API endpoints
- ✅ Validation dữ liệu đầu vào
- ✅ HTTPS cho production
- ✅ Environment variables cho thông tin nhạy cảm

## 📝 Phạm vi áp dụng

- Các trung tâm Ngoại ngữ - Tin học quy mô vừa và nhỏ
- Các cơ sở đào tạo, trường học có nhu cầu quản lý kỳ thi nội bộ
- Có thể tùy chỉnh cho các loại hình thi cử khác

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork dự án
2. Tạo branch cho tính năng mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request


## 👨‍💻 Tác giả

**Trần Tấn Hưng DA22TTD TVU**

## 📞 Liên hệ

- 📧 Email: tranhunggit@gmail.com
- 🌐 Website: https://quizhub.vercel.app (đang phát triển)
- 📱 GitHub: https://github.com/hungtvu113/DoAnChuyenNganh

## 🙏 Lời cảm ơn

Cảm ơn tất cả những người đã đóng góp cho dự án này!

---

**Phiên bản**: 0.1.0
**Cập nhật lần cuối**: 2025-10-25
**Trạng thái**: 🚧 Đang phát triển
