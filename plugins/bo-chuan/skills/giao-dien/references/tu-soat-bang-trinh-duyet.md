# Tự xem giao diện bằng trình duyệt

Agent dùng Playwright để mở trang, chụp ảnh rồi tự xem ảnh. Có `playwright-cli` (github.com/microsoft/playwright-cli) thì dùng được thao tác nhanh: `playwright-cli open <url>`, `snapshot`, `click`, `screenshot`.

Chụp bằng script (Node):
```js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1280, 800]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(process.argv[2]);
    await page.screenshot({ path: `shots/${name}.png`, fullPage: true });
  }
  await browser.close();
})();
```
Chạy: `node chup.js http://localhost:5173/<trang>`.

- Chụp đủ trạng thái chính: có dữ liệu, rỗng, lỗi, đang mở hộp thoại.
- Xem ảnh bằng công cụ đọc ảnh, soát theo mục 8 của skill.
- Lưu ảnh ở `docs/anh-giao-dien/<yyyymmdd>/` để người quản lý xem khi duyệt.

Nguồn tham khảo: microsoft/playwright-cli (Apache 2.0).

## Ghép bản dựng cạnh hình mẫu
Chụp bản dựng đúng khung của hình mẫu (vd hình mẫu là màn đầu trang máy tính thì chụp 1280x800, không chụp toàn trang), rồi ghép:
```bash
ffmpeg -y -i hinh-mau.png -i shots/desktop-dau-trang.png \
  -filter_complex "[0]scale=-1:800[a];[1]scale=-1:800[b];[a][b]hstack" shots/so-hinh-mau.png
```
Không có ffmpeg thì dựng một trang HTML hai cột đặt hai ảnh rồi chụp bằng Playwright. Xem ảnh ghép, ghi từng chỗ lệch rồi sửa.
