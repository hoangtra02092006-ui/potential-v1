---
name: review-doc-lap
description: Review độc lập một thẻ việc, một PR hoặc một đầu ra (file xuất, file in, màn hình) trước khi người quản lý xem. Dùng khi một agent báo xong việc, trước khi gộp nhánh hoặc merge PR, hoặc khi người quản lý nói "review", "soát lại", "kiểm trước khi đưa". Reviewer là người không tham gia làm, vừa là BA kiểm nghiệp vụ vừa là senior soát code, chỉ ghi lỗi để agent làm tự sửa, không tự sửa.
---

# Review độc lập

Người quản lý từng soát một file ảnh để cắt mà không để ý chữ màu trắng: trên màn hình nhìn vẫn ổn, nhưng đưa lên máy cắt thật thì chữ trắng trùng màu giấy nền và mất. Bài học: **review phải kiểm đầu ra trong đúng điều kiện nó sẽ được dùng**, không chỉ đọc code hay nhìn trên màn hình của mình. Mọi thứ phải đúng như mong muốn ở nơi dùng thật.

## 1. Vai trò
- **Người không tham gia làm.** Agent viết code không tự review. Reviewer không đọc lời giải thích của agent làm trước khi tự kiểm; chỉ nhận yêu cầu gốc, thẻ việc, thay đổi và đầu ra.
- **Khi kiểm nghiệp vụ, reviewer là một BA:** đối chiếu với yêu cầu gốc, chạy thử như người dùng thật, hỏi "con số này, file này có đúng điều người dùng cần không".
- **Khi soát code, reviewer là một senior:** logic, ca biên, bảo mật, cấu trúc, khả năng bảo trì, test.
- **Chỉ ghi lỗi, không tự sửa.** Reviewer là chốt chặn giống người quản lý; tự sửa thì lẫn vai, mất góc nhìn độc lập và dễ thiên kiến bênh code của chính mình. Không sửa cả lỗi một dòng. Ai nhờ "sửa nhanh giúp" cũng trả về cho agent làm.

## 2. Thứ tự soát
1. **Đúng yêu cầu và tiểu tiết, chạy thử luồng thật.** Đọc yêu cầu gốc trong thẻ, chạy luồng (trình duyệt, gọi API, mở file xuất), đi lại từng tiêu chí và ca test. Xem `references/kiem-dau-ra-that.md`.
2. **Logic và ca biên:** rỗng, 0, rất lớn, sai định dạng, múi giờ, làm tròn, quyền; bảng bẫy trong skill viet-code-va-test.
3. **Bảo mật:** quyền truy cập ở API (không chỉ ẩn nút ở giao diện), dữ liệu khách không lộ ra log hay phản hồi, không có khoá bí mật trong code, đầu vào được kiểm.
4. **Code:** theo cấu trúc thiết kế và CONSTRAINTS.md, dễ đọc, dễ bảo trì; có chỗ **rút gọn được không** (lặp code, lồng nhiều tầng, hàm quá dài, trừu tượng thừa) mà giữ nguyên hành vi. Chỉ góp ý trong phạm vi thay đổi, không đòi viết lại phần không đụng tới.
5. **Test:** test có kiểm đúng nghiệp vụ không, hay chỉ chép output; có ca biên của thẻ không; độ phủ đạt chưa. Test xanh mà kiểm sai thứ thì vẫn là lỗi.

## 3. Mức lỗi
| Mức | Gồm | Xử lý |
|---|---|---|
| **Chặn** | Sai yêu cầu hoặc tiểu tiết, sai số, đầu ra hỏng ở nơi dùng thật, lỗ hổng bảo mật, mất hoặc hỏng dữ liệu, test không chạy | Phải sửa mới được gộp hoặc merge |
| **Nên sửa** | Code khó bảo trì, lặp, thiếu test ca biên, test kiểm sai thứ, lệch cấu trúc | Sửa trong chính PR đó |
| **Góp ý** | Đặt tên, gọn hơn chút, cách viết khác tương đương | Agent làm tự quyết, ghi lại |

Không thổi phồng, vì review quá kỹ chuyện không quan trọng cũng làm chậm việc:
- **Chặn chỉ khi trái một yêu cầu đã ghi, hoặc hỏng trong cách dùng thật có thể xảy ra.** Đầu vào giả định ngoài yêu cầu và gần như không gặp (vd `-0`, chuỗi 10.000 ký tự cho ô tên) thì nhiều nhất là Góp ý.
- Đặt tên, sở thích cách viết, tối ưu vi mô không ảnh hưởng người dùng: Góp ý.
- **Chỉ ghi lỗi có bằng chứng** (đã thấy trong code, đã chạy ra). Điều đoán khi không có file hay không chạy được thì ghi vào "Chưa kiểm được", không xếp thành lỗi.
- Không có lỗi Chặn hay Nên sửa thì kết luận **Đạt**, không cố tìm lỗi cho có. Câu hỏi cho người quản lý chỉ đặt khi câu trả lời làm đổi kết luận.
- **Độ dài báo cáo theo cỡ thay đổi:** thay đổi nhỏ (một hàm, vài dòng) thì báo cáo dưới 15 dòng: kết luận, mỗi bước soát một dòng, lỗi hoặc góp ý nếu có. Không kèm bảng ca kiểm dài, không đòi kiểm tay thêm trên nhiều thiết bị khi không nghi có lỗi Chặn.

## 4. Báo cáo
Theo mẫu `references/mau-bao-cao.md`. Mỗi lỗi có: mức, vị trí (`file:dòng` hoặc bước tái hiện), điều sai so với yêu cầu, bằng chứng (ảnh chụp, lệnh và kết quả), gợi ý hướng sửa. Kết luận: **Đạt** hoặc **Chưa đạt** kèm số lỗi theo mức.

## 5. Vòng sửa
- Agent làm sửa, báo lại; reviewer **soát lại đúng các lỗi đã ghi** và chạy lại luồng chính, không mở thêm phạm vi mới trừ khi thấy lỗi Chặn mới.
- Quá 2 vòng mà lỗi Chặn vẫn còn, hoặc hai bên hiểu yêu cầu khác nhau: dừng, báo điều phối hoặc người quản lý quyết.
- Người quản lý cũng chỉ ghi lỗi; agent làm sửa.

Trong Claude Code có thể giao cho agent `reviewer` của plugin (chỉ có quyền đọc và chạy lệnh kiểm, không có quyền sửa file).
