#!/usr/bin/env bash
# Chặn lệnh XOÁ HÀNG LOẠT. Luật riêng của dự án đặt trong .claude/settings.json của dự án.
input=$(cat)
cmd=$(printf '%s' "$input" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(\([^"\\]\|\\.\)*\)".*/\1/p' | head -n1)
[ -z "$cmd" ] && exit 0

chan() { echo "BỊ CHẶN (bộ chuẩn): $1. Nếu thật sự cần, người quản lý tự chạy tay." >&2; exit 2; }
m() { printf '%s' "$cmd" | grep -Eiq "$1"; }

m 'rm[[:space:]]+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r|-r[[:space:]]+-f|-f[[:space:]]+-r)[a-z]*[[:space:]]+(/|~|\$HOME|/\*|\.|\*|[a-z]:[\\/]?)([[:space:]]|$)' && chan "xoá đệ quy ở thư mục gốc/nhà/toàn bộ thư mục hiện tại"
m '(remove-item|rd|rmdir)[[:space:]].*(-recurse|/s).*[[:space:]](~|\.|\*|[a-z]:[\\/]?|\$home|\$env:userprofile)([[:space:]]|$)' && chan "xoá đệ quy ổ đĩa/thư mục nhà/thư mục hiện tại (Windows)"
m 'git[[:space:]]+clean[[:space:]]+-[a-z]*f[a-z]*d|git[[:space:]]+clean[[:space:]]+-[a-z]*d[a-z]*f' && chan "git clean xoá hàng loạt file chưa theo dõi"
m '(drop[[:space:]]+(database|schema|table)|truncate[[:space:]]+table)'           && chan "xoá database/schema/bảng"
m '(prisma[[:space:]]+migrate[[:space:]]+reset|db:drop|migrate:fresh|migrate:reset|flush[[:space:]]+--no-input|dropdb[[:space:]])' && chan "reset/xoá database bằng công cụ migration"
m '(mkfs|format[[:space:]]+[a-z]:|dd[[:space:]]+.*of=/dev/)'                         && chan "xoá/format ổ đĩa"
exit 0
