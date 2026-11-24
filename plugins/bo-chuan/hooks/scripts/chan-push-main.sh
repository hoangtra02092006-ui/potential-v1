#!/usr/bin/env bash
# Chặn push thẳng lên nhánh chính. Bash thuần, không cần jq (chạy được với Git Bash trên Windows).
# Exit 2 = chặn, lý do in ra stderr để Claude đọc.
input=$(cat)
cmd=$(printf '%s' "$input" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(\([^"\\]\|\\.\)*\)".*/\1/p' | head -n1)
[ -z "$cmd" ] && exit 0
printf '%s' "$cmd" | grep -Eq '(^|[;&| ])git([[:space:]]+-[^ ]+)*[[:space:]]+push' || exit 0

NHANH_CHINH='main|master'
# 1) Nêu thẳng nhánh chính trong lệnh: git push origin main, HEAD:main, :main
if printf '%s' "$cmd" | grep -Eq "push.*([[:space:]]|:)(${NHANH_CHINH})([[:space:]]|\$|;|&)"; then
  echo "BỊ CHẶN (bộ chuẩn): không push thẳng lên nhánh chính. Tạo nhánh feat/… hoặc fix/… rồi mở PR." >&2
  exit 2
fi
# 2) git push không nêu nhánh khi đang đứng trên nhánh chính
cwd=$(printf '%s' "$input" | sed -n 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)
cur=$(cd "${cwd:-.}" 2>/dev/null && git rev-parse --abbrev-ref HEAD 2>/dev/null)
if printf '%s' "$cur" | grep -Eqx "${NHANH_CHINH}"; then
  if ! printf '%s' "$cmd" | grep -Eq 'push[^;&|]*[[:space:]](origin|upstream)[[:space:]]+[^-[:space:]]'; then
    echo "BỊ CHẶN (bộ chuẩn): đang ở nhánh '$cur', lệnh push sẽ đẩy thẳng lên nhánh chính. Chuyển sang nhánh riêng trước." >&2
    exit 2
  fi
fi
exit 0
