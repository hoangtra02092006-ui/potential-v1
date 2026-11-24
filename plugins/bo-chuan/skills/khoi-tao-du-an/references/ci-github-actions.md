# CI bằng GitHub Actions

Chạy mỗi PR vào `main`: lint, test, build. Nhanh và đơn giản; thêm bước khi thật cần.

```yaml
# .github/workflows/ci.yml
name: ci
on:
  pull_request:
    branches: [main]
jobs:
  frontend:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: frontend } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: frontend/package-lock.json }
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
  backend:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: backend } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 21, cache: maven }
      - run: ./mvnw -B verify
```

- Web chỉ frontend: bỏ job backend.
- Bí mật cho test (nếu cần) đặt trong Settings → Secrets của repo, đọc bằng `${{ secrets.TEN }}`; không ghi vào file.
- Bật bảo vệ nhánh `main`: bắt buộc CI xanh trước khi merge (người quản lý bật trong Settings → Branches).
