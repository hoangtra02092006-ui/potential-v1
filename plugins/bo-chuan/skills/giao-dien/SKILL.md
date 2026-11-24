---
name: giao-dien
description: Làm giao diện web đẹp, hài hoà, trông như người thiết kế UI chuyên nghiệp làm, không trông như AI làm. Dùng sau khi thiết kế lời giải đã duyệt, khi dựng hoặc sửa màn hình, chọn màu, phông chữ, thư viện giao diện, hiệu ứng, hoặc khi người quản lý nói giao diện "trông AI", "phèn", "chưa chỉn chu". Gồm chọn phong cách theo mục đích, viết DESIGN.md, dựng, tự chụp màn hình soát rồi mới đưa duyệt.
---

# Giao diện

Người quản lý ghét nhất giao diện "trông AI": không tự nhiên, nhìn tức mắt, muốn xoá đi làm lại dù nội dung đúng. Mục tiêu là giao diện như người chuyên UI làm: hài hoà, nhất quán, có chủ đích.

## 1. Mục đích của web quyết định phong cách
Xác định web thuộc loại nào trước khi vẽ bất cứ thứ gì:

| Loại | Ví dụ | Phong cách |
|---|---|---|
| **Quản lý, công cụ nội bộ** | quản lý đơn, CRM, báo cáo | Tối giản, dễ dùng, nhưng **chỉn chu, không sơ sài**: căn lề thẳng, khoảng cách đều, bảng dễ đọc, trạng thái rõ. Ít hiệu ứng, nhanh. |
| **Giới thiệu, marketing sản phẩm** | landing page, trang giới thiệu công ty, sản phẩm | Thật chuyên nghiệp và **thu hút người xem**. Có thể đề xuất chuyển động, hiệu ứng tương tác hoặc 3D để hút mắt, nếu hợp với sản phẩm. |
| **Nơi chốn, cửa hàng** | quán cà phê, tiệm bánh, khách sạn nhỏ | Ảnh thật dẫn dắt, màu theo thương hiệu hoặc theo ngành. Không 3D, không hiệu ứng kỹ thuật. |

3D, WebGL, hiệu ứng nặng: hợp với sản phẩm công nghệ, phần mềm, thiết bị, game. Luôn là **đề xuất** để người quản lý chọn, kèm cái giá (thời gian làm, tốc độ tải trang).

## 2. Viết DESIGN.md trước khi dựng
Mỗi dự án có một file `DESIGN.md` ở gốc, agent nào làm giao diện cũng đọc. Mẫu ở `references/mau-design-md.md`. Cách làm:
1. Chọn 1-2 trang tham chiếu hợp loại web (vd quản lý: Linear, Notion, Stripe Dashboard; marketing phần mềm: Stripe, Vercel, Framer; sản phẩm: Apple, Nike). Có sẵn bản phân tích phong cách của nhiều trang thật ở github.com/voltagent/awesome-design-md, đọc bản hợp nhất, **học cách phối, không sao chép thương hiệu**.
2. Viết token: màu (nền, chữ, viền, **một** màu nhấn, màu trạng thái), phông chữ (1-2 họ), cỡ chữ theo thang, khoảng cách theo thang, bo góc, bóng, chuyển động.
3. Viết mục **Nên / Không nên** riêng cho dự án.
4. Đây là quyết định về thẩm mỹ, **người quản lý duyệt**. Trình DESIGN.md kèm một màn hình mẫu đã dựng và ảnh chụp, không trình mỗi bảng màu suông.

Sau khi duyệt: mọi màn hình chỉ dùng token trong DESIGN.md, không đặt màu, cỡ chữ, khoảng cách lẻ.

## 3. Thư viện giao diện: chọn theo dự án
Không cố định thư viện. Chọn cái phủ được nhu cầu mở rộng sau này và dễ sửa theo phạm vi dự án, ghi lý do trong thiết kế. Dù dùng thư viện nào, giao diện đi theo token của DESIGN.md, không để giao diện trông như mẫu mặc định của thư viện.

## 4. Dựng
- **Component nhỏ, một việc.** Tách phần lấy dữ liệu khỏi phần hiển thị. Ghép component (slot, component con) thay vì một component nhận nhiều tuỳ chọn bật tắt. Mỗi biến thể rõ ràng là một component hoặc một giá trị `variant`, không phải tổ hợp nhiều prop true/false. Trạng thái dùng chung đặt ở composable hoặc provide/inject (Vue), React thì context.
- **Đủ trạng thái:** đang tải, rỗng (có hướng dẫn bước tiếp), lỗi (nói rõ lỗi gì, làm gì tiếp), thành công.
- **Đúng trên điện thoại và máy tính** ngay từ đầu, không "làm responsive sau".
- **Dùng được bằng bàn phím:** nút là `<button>`, link là `<a>`, ô nhập có nhãn, nút chỉ có icon có `aria-label`, có viền focus rõ.
- **Nội dung thật:** dùng dữ liệu và câu chữ giống thật (tên, số, độ dài thật) để lộ lỗi tràn chữ, không dùng lorem ipsum.
- **Số liệu** dùng định dạng theo ngôn ngữ (`Intl`), cột số căn phải, chữ số đều độ rộng.

## 5. Chống "giao diện AI"
Đọc `references/chong-giao-dien-ai.md` trước khi dựng và trước khi đưa duyệt. Những dấu hiệu nặng nhất: tím hoặc chàm mặc định, gradient khắp nơi, bo tròn và bóng đổ quá tay, lưới 3-4 thẻ giống hệt nhau ở mọi mục, emoji thay icon, câu chữ sáo rỗng, số liệu bịa.

## 6. Chuyển động
- **Quản lý:** chuyển động nhỏ và nhanh (150-250ms), chỉ để phản hồi thao tác: hover, nhấn nút, mở hộp thoại, đổi trạng thái.
- **Marketing:** phần đầu trang xuất hiện một lần khi tải; một hoặc hai khoảnh khắc ấn tượng có mục đích; hover và nhấn trên mọi thứ bấm được. Không làm mọi thẻ trôi lên khi cuộn, không parallax chữ, không chiếm quyền cuộn trang.
- Mỗi chuyển động có lý do. Không có lý do thì bỏ. Tôn trọng `prefers-reduced-motion`. Không dùng `transition: all`.

## 7. Tự xem và soát trước khi đưa duyệt
Agent phải tự nhìn giao diện, không đưa người quản lý xem bản chưa tự soát. Cách chụp ở `references/tu-soat-bang-trinh-duyet.md`.
1. Chụp mỗi màn hình ở **390px** (điện thoại) và **1280px** (máy tính), đủ các trạng thái chính.
2. Xem ảnh và soát **theo đúng thứ tự người quản lý nhìn**:
   1. **Màu sắc và phông chữ:** hài hoà, nhất quán giữa các màn, đúng DESIGN.md.
   2. **Bố cục:** gọn gàng, có logic, lề thẳng, khoảng cách đều, thứ tự đọc tự nhiên.
   3. **Nội dung:** dễ nắm bắt, không rườm rà, không thiếu, người xem có hứng thú nhìn.
   4. Danh sách chống giao diện AI.
3. Còn lỗi thì sửa và chụp lại. Lỗi lặp ở nhiều màn thì sửa ở token hoặc component chung.
4. Đưa duyệt kèm ảnh chụp và bảng tự soát ngắn.

**Chưa đạt** khi: cẩu thả, khó nhìn, nội dung khó nắm, trình bày rườm rà hoặc thiếu, hoặc người xem không có hứng thú khi nhìn vào. Lỗi cuối là lỗi nặng.
