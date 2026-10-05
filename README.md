# 🎫 TicketHub — SpringTicketSale

**Nền tảng bán vé sự kiện trực tuyến** xây dựng với Spring MVC (backend) và React (frontend).

---

## 📋 Mục lục

- [Tính năng]
- [Kiến trúc hệ thống]
- [Công nghệ sử dụng]
- [Cài đặt & Chạy dự án]
- [Cấu trúc thư mục]
- [API Endpoints]
- [Luồng hoạt động]

---

## Tính năng

### Người dùng (User)
- Xem danh sách sự kiện, lọc theo danh mục
- Xem chi tiết sự kiện và các loại vé còn lại
- Đăng ký / Đăng nhập bằng tài khoản hoặc Google OAuth
- Đặt mua vé và thanh toán trực tuyến
- Xem lịch sử đơn thanh toán và vé đã mua
- Cập nhật thông tin cá nhân, thay đổi mật khẩu
- Quên mật khẩu / Đặt lại mật khẩu qua email
- Nhắn tin với ban tổ chức (chat thời gian thực)

### Ban tổ chức (Organizer)
- Yêu cầu nâng cấp vai trò lên Organizer
- Tạo, chỉnh sửa, xóa sự kiện
- Quản lý chi tiết từng sự kiện (vé đã bán, doanh thu)
- Xem thống kê doanh thu (theo tháng, quý, năm, tổng quan)
- Chat với người mua vé

### Xác thực & Bảo mật
- JWT-based authentication
- Spring Security bảo vệ các endpoint `/secure/**`
- Hỗ trợ Google OAuth2 Sign-In
- Gửi email quên mật khẩu và xác nhận

---

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                  React 19 + React Router v7                 │
│   React Bootstrap │ Axios │ Firebase (Realtime Chat)        │
│        Google OAuth │ react-cookies (JWT storage)          │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTP/JSON)
                           │ Base URL: /TicketSale/api/
┌──────────────────────────▼──────────────────────────────────┐
│                        BACKEND                              │
│             Spring MVC 6.2 + Spring Security 6.5            │
│       Hibernate ORM 7.1 │ Thymeleaf │ JWT (jjwt 0.11.5)    │
│      Cloudinary (upload ảnh) │ JavaMail (gửi email)        │
│         Google API Client │ Jackson │ Nimbus JOSE           │
└──────────────────────────┬──────────────────────────────────┘
                           │ JPA / Hibernate
┌──────────────────────────▼──────────────────────────────────┐
│                       DATABASE                              │
│                    MySQL (mysql-connector-j 8.4)            │
└─────────────────────────────────────────────────────────────┘
                           
┌─────────────────────────────────────────────────────────────┐
│                   FIREBASE FIRESTORE                        │
│                Real-time Chat giữa user và organizer        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     CLOUDINARY CDN                          │
│              Lưu trữ ảnh sự kiện và avatar người dùng      │
└─────────────────────────────────────────────────────────────┘
```

---

## Công nghệ sử dụng

### Backend (`/TicketSale`)

| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Ngôn ngữ | Java | 17 |
| Web Framework | Spring MVC | 6.2.9 |
| Bảo mật | Spring Security | 6.5.3 |
| ORM | Hibernate | 7.1.0.Final |
| Template Engine | Thymeleaf + Spring Security Extras | 3.5.4 / 3.1.2 |
| Database | MySQL | 8.4.0 (connector) |
| JWT | jjwt | 0.11.5 |
| Upload ảnh | Cloudinary | 1.39.0 |
| Gửi email | Spring Boot Mail Starter | 3.5.4 |
| JSON | Jackson | 2.15.2 |
| Google OAuth | Google API Client | 2.0.0 |
| JWT parsing | Nimbus JOSE | 10.1 |
| Build tool | Maven | WAR packaging |
| App server | Jakarta EE 11 (e.g. Tomcat 11) | — |

### Frontend (`/ticketweb`)

| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| UI Framework | React | 19.1.1 |
| Routing | React Router DOM | 7.8.2 |
| UI Components | React Bootstrap + Bootstrap | 2.10.10 / 5.3.0 |
| HTTP Client | Axios | 1.11.0 |
| Auth token | react-cookies | 0.1.1 |
| Google OAuth | @react-oauth/google | 0.12.2 |
| Realtime Chat | Firebase (Firestore) | 12.2.1 |
| Build tool | Create React App (react-scripts) | 5.0.1 |

---

## Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- Java 17+
- Maven 3.8+
- Node.js 18+ và npm
- MySQL 8+
- Apache Tomcat 11 (hoặc server tương thích Jakarta EE 11)

---

### 1. Clone repository

```bash
git clone https://github.com/HieuLT24/SpringTicketSale.git
cd SpringTicketSale
```

---

### 2. Cấu hình Backend

**a. Tạo database MySQL:**

```sql
CREATE DATABASE ticketsale CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**b. Cấu hình kết nối database, email, Cloudinary, Google OAuth** trong file cấu hình Spring (ví dụ `applicationContext.xml` hoặc `application.properties`):

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ticketsale
spring.datasource.username=your_username
spring.datasource.password=your_password

# Cloudinary
cloudinary.cloud_name=your_cloud_name
cloudinary.api_key=your_api_key
cloudinary.api_secret=your_api_secret

# Mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# Google OAuth
google.client.id=your_google_client_id
```

**c. Build và deploy backend:**

```bash
cd TicketSale
mvn clean package
# Deploy file target/TicketSale-1.0-SNAPSHOT.war lên Tomcat
# Hoặc copy vào thư mục webapps của Tomcat
```

Backend sẽ chạy tại: `http://localhost:8080/TicketSale/`

---

### 3. Cấu hình Firebase (cho tính năng Chat)

Tạo project trên [Firebase Console](https://console.firebase.google.com/), bật **Firestore Database**, sau đó cập nhật `ticketweb/src/configs/Firebase.js` với config của bạn:

```js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

### 4. Chạy Frontend

```bash
cd ticketweb
npm install
npm start
```

Frontend chạy tại: `http://localhost:3000`

> **Lưu ý:** Backend phải đang chạy ở `http://localhost:8080/TicketSale/` để frontend kết nối API.

---

## Cấu trúc thư mục

```
SpringTicketSale/
├── TicketSale/                         # Backend (Spring MVC)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/pdh/
│   │   │   │   ├── config/             # Cấu hình Spring, Security, Hibernate
│   │   │   │   ├── controller/         # REST Controllers (Events, Users, Payment...)
│   │   │   │   ├── entity/             # JPA Entities (Event, Ticket, User, Payment...)
│   │   │   │   ├── dao/                # Data Access Objects
│   │   │   │   ├── service/            # Business logic
│   │   │   │   └── util/              # JWT, Mail, Cloudinary utilities
│   │   │   ├── resources/             # Application properties
│   │   │   └── webapp/
│   │   │       └── WEB-INF/           # web.xml
│   └── pom.xml
│
├── ticketweb/                          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                  # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── chat/                  # ChatList, ChatWindow (Firebase)
│   │   │   ├── layout/                # Header, Footer
│   │   │   ├── Home.js                # Trang chủ - danh sách sự kiện
│   │   │   ├── EventDetail.js         # Chi tiết sự kiện + đặt vé
│   │   │   ├── UserProfile.js         # Trang cá nhân
│   │   │   ├── PaymentsPage.js        # Lịch sử đơn hàng
│   │   │   ├── MyTicketsPage.js       # Vé của tôi
│   │   │   ├── PaymentResult.js       # Kết quả thanh toán
│   │   │   ├── MyEvents.js            # Quản lý sự kiện (Organizer)
│   │   │   ├── EventDetailForOrganizer.js  # Chi tiết sự kiện cho Organizer
│   │   │   └── RevenueStatistics.js   # Thống kê doanh thu
│   │   ├── configs/
│   │   │   ├── Apis.js                # Axios instances + API endpoints
│   │   │   ├── Firebase.js            # Firebase config (Firestore)
│   │   │   └── MyContexts.js          # React Context (user state)
│   │   ├── reducers/
│   │   │   └── MyUserReducer.js       # Reducer quản lý auth state
│   │   ├── services/
│   │   │   └── chatService.js         # Firestore chat utilities
│   │   └── App.js                     # Root component + routing
│   └── package.json
│
└── .gitignore
```

---

## API Endpoints

Tất cả API có prefix: `http://localhost:8080/TicketSale/api/`

### Public (không cần xác thực)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `events` | Lấy danh sách sự kiện |
| `GET` | `events/{eventId}` | Chi tiết một sự kiện |
| `GET` | `categories` | Danh sách danh mục |
| `GET` | `categories/{cateId}` | Sự kiện theo danh mục |
| `GET` | `{eventId}/tickets` | Vé còn lại của sự kiện |
| `POST` | `login` | Đăng nhập (trả về JWT) |
| `POST` | `register` | Đăng ký tài khoản |
| `POST` | `login/google` | Đăng nhập bằng Google |
| `GET` | `public/google-client-id` | Lấy Google Client ID |
| `POST` | `forgot-password` | Yêu cầu reset mật khẩu |
| `POST` | `reset-password` | Đặt lại mật khẩu |

### Secured (`/secure/**` — cần JWT Bearer Token)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `secure/profile` | Lấy thông tin cá nhân |
| `PUT` | `secure/profile` | Cập nhật thông tin cá nhân |
| `PUT` | `secure/password` | Đổi mật khẩu |
| `POST` | `secure/payment/process` | Xử lý thanh toán |
| `GET` | `secure/payment/{paymentId}` | Chi tiết đơn thanh toán |
| `GET` | `secure/payment/my` | Lịch sử thanh toán |
| `GET` | `secure/payment/my/tickets` | Vé đã mua |
| `POST` | `secure/organizer-request` | Yêu cầu nâng cấp Organizer |
| `GET` | `secure/organizer-request-status` | Trạng thái yêu cầu |
| `GET` | `secure/myEvents` | Danh sách sự kiện của Organizer |
| `POST` | `secure/myEvents` | Tạo sự kiện mới |
| `PUT` | `secure/myEvents/{eventId}` | Cập nhật sự kiện |
| `DELETE` | `secure/myEvents/{eventId}` | Xóa sự kiện |
| `GET` | `secure/events/{eventId}/sold-tickets` | Vé đã bán của sự kiện |
| `GET` | `secure/events/{eventId}/revenue` | Doanh thu của sự kiện |
| `GET` | `secure/revenue/events` | Thống kê doanh thu theo sự kiện |
| `GET` | `secure/revenue/monthly` | Doanh thu theo tháng |
| `GET` | `secure/revenue/quarterly` | Doanh thu theo quý |
| `GET` | `secure/revenue/yearly` | Doanh thu theo năm |
| `GET` | `secure/revenue/overall` | Tổng quan doanh thu |

---

## Luồng hoạt động

### Luồng mua vé

```
Người dùng → Xem trang chủ → Chọn sự kiện
    → Xem chi tiết & chọn vé
    → Đăng nhập (nếu chưa) → Thanh toán
    → Xem kết quả thanh toán → Vé lưu vào "Vé của tôi"
```

### Luồng đăng nhập

```
POST /api/login (username + password)
    → Server xác thực → Trả về JWT
    → Frontend lưu JWT vào cookie ('token')
    → Mỗi request secured dùng Authorization: Bearer <token>
```

### Luồng chat (Firebase Firestore)

```
User A xem EventDetail → Click "Nhắn tin với ban tổ chức"
    → ensureChatDocument(userA, organizerB) → Tạo/lấy chat document trên Firestore
    → ChatWindow subscribe realtime onSnapshot
    → Tin nhắn gửi/nhận real-time
```

---

## Phân quyền

| Vai trò | Quyền hạn |
|---|---|
| **GUEST** | Xem sự kiện, đăng ký, đăng nhập |
| **USER** | Mua vé, xem lịch sử, cập nhật profile, chat, yêu cầu nâng cấp Organizer |
| **ORGANIZER** | Tất cả quyền của USER + Tạo/quản lý sự kiện + Xem thống kê doanh thu |

---

## Tác giả

**HieuLT24** — [GitHub](https://github.com/HieuLT24)
