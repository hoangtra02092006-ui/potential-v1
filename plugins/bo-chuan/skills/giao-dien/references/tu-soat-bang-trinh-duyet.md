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
- Xem ảnh bằng công cụ đọc ảnh, soát theo mục 7 của skill.
- Lưu ảnh ở `docs/anh-giao-dien/<yyyymmdd>/` để người quản lý xem khi duyệt.

Nguồn tham khảo: microsoft/playwright-cli (Apache 2.0).
