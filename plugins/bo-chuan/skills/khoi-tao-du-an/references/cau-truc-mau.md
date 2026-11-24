# Cấu trúc mẫu

Chỉ là mẫu; theo kiến trúc đã duyệt trong `docs/thiet-ke/`. Bỏ phần không dùng.

## Web có backend (vd Java Spring Boot + Vue/Nuxt)
```
<du-an>/
├── CLAUDE.md            bản đồ, lệnh, luật cho agent
├── CONSTRAINTS.md       quy ước code và nghiệp vụ
├── DESIGN.md            hệ thống giao diện
├── README.md            chạy trên Windows từ máy trống
├── .env.example         tên biến môi trường, không có giá trị
├── .gitignore  .gitattributes  .editorconfig
├── .github/workflows/ci.yml
├── docs/
│   ├── yeu-cau/         bản yêu cầu đã duyệt, phiếu hỏi khách
│   ├── thiet-ke/        bản thiết kế, hợp đồng API
│   ├── adr/             quyết định khó đảo ngược
│   ├── ke-hoach/        bảng chia việc
│   └── phat-hanh/       gói phát hành theo phiên bản
├── backend/
│   └── src/main/java/<goi>/
│       ├── <chuc-nang>/  controller, service, repository, dto của một chức năng
│       └── shared/       cấu hình, lỗi chung, bảo mật
│   └── src/test/java/...  test theo cùng cấu trúc
│   └── src/main/resources/db/migration/  migration theo thứ tự
└── frontend/
    └── src/
        ├── features/<chuc-nang>/  màn hình, component, composable của một chức năng
        ├── shared/ui/             component dùng chung
        └── api/                   gọi API theo hợp đồng
```

## Web chỉ frontend (landing page, web tĩnh)
```
<du-an>/
├── CLAUDE.md  DESIGN.md  README.md
├── .gitignore  .github/workflows/ci.yml
├── docs/yeu-cau/
├── public/              ảnh, font
└── src/
    ├── sections/        từng khối của trang
    └── shared/
```
