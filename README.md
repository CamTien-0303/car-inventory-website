# Car Inventory Management — Frontend

Ứng dụng quản lý kho xe được xây dựng bằng **React + Vite**, kết nối trực tiếp đến backend ASP.NET Core đã deploy trên Render.

## Cài đặt

```bash
cd frontend
npm install
```

## Cấu hình môi trường

Tạo file `.env` (hoặc copy từ `.env.example`):

```
VITE_API_BASE_URL=https://carinventorymanagement.onrender.com
```

- **Không** thêm `/api` vào cuối — hệ thống tự append `/api` vào mỗi request.
- Khi dev local với backend local, đổi thành: `VITE_API_BASE_URL=http://localhost:8080`

## Chạy local

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

## Build production

```bash
npm run build
npm run preview   # Preview build output
```

Output build nằm trong thư mục `dist/`.

## Base URL Production

```
https://carinventorymanagement.onrender.com
```

> ⚠️ **Lưu ý**: Render Free Tier sẽ tự sleep sau 15 phút không có traffic.
> Request đầu tiên có thể mất 30–60 giây (cold start). UI sẽ hiện thông báo phù hợp.

## Cấu trúc thư mục

```
src/
├── services/          # API layer (apiClient.js + service files)
├── components/
│   ├── common/        # Reusable UI components (DataTable, Modal, etc.)
│   └── layout/        # Sidebar, Header, MainLayout
├── pages/             # Các trang: Dashboard, Vehicles, Products, etc.
├── utils/             # Normalizers cho dữ liệu backend
├── App.jsx            # React Router config
├── main.jsx           # Entry point
└── index.css          # Design system
```

## API Endpoints được sử dụng

| Module           | Endpoint                     | Methods                |
|------------------|------------------------------|------------------------|
| Vehicle          | `/api/Vehicle`               | GET, POST              |
| Vehicle (detail) | `/api/Vehicle/{vin}`         | GET, PUT, DELETE       |
| Vehicle (move)   | `/api/Vehicle/location`      | PATCH (query params)   |
| Product          | `/api/Product`               | GET, POST              |
| Product (detail) | `/api/Product/{id}`          | GET, PUT, DELETE       |
| Warehouse        | `/api/Warehouse`             | GET, POST              |
| Warehouse        | `/api/Warehouse/{id}`        | GET, PUT, DELETE       |
| Supplier         | `/api/Supplier`              | GET, POST              |
| Supplier         | `/api/Supplier/{id}`         | GET, PUT, DELETE       |
| Staff            | `/api/Staff`                 | GET, POST              |
| Staff            | `/api/Staff/{id}`            | GET, PUT, DELETE       |
| VehicleDocument  | `/api/VehicleDocument`       | GET, POST              |
| VehicleDocument  | `/api/VehicleDocument/{id}`  | GET, PUT, DELETE       |
| Transaction      | `/api/Transaction`           | GET                    |
| Transaction      | `/api/Transaction/{id}`      | GET                    |
| Transaction      | `/api/Transaction/import`    | POST                   |
| Transaction      | `/api/Transaction/export`    | POST                   |
| Report           | `/api/Report/inventory-aging`| GET                    |

## Công nghệ

- **React 19** + **Vite 8**
- **React Router v7** (client-side routing)
- **Lucide React** (icon library)
- **Fetch API** (no axios needed — apiClient.js uses native fetch)
- Không dùng CSS framework — toàn bộ styling bằng vanilla CSS

## Ghi chú kỹ thuật

- Backend trả JSON camelCase (System.Text.Json default)
- Normalizers hỗ trợ cả PascalCase lẫn camelCase để tương thích
- `PATCH /api/Vehicle/location` dùng query params (vin, newLocation, staffId), không phải JSON body
- Transaction import dùng DTO field `importPrice` (không phải `price`)
- Transaction export dùng DTO field `exportPrice` (không phải `price`)
