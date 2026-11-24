#!/usr/bin/env bash
# Chạy bộ đề của một skill: mỗi tình huống một agent mới (có plugin, không thấy đề), một agent khác chấm.
# Dùng: bash evals/chay-bo-de.sh <ten-skill> <thu-muc-ket-qua> [số câu...]  (bỏ trống = chạy mọi câu)
set -u
SKILL=$1; OUT=$2; shift 2; CHON="$*"
ROOT=$(cd "$(dirname "$0")/.." && pwd)
PLUGIN="$ROOT/plugins/bo-chuan"
mkdir -p "$OUT"
python3 - "$ROOT/evals/$SKILL.md" "$OUT" <<'PY'
import re,sys
t=open(sys.argv[1]).read(); out=sys.argv[2]
for blk in re.split(r'\n## ',t)[1:]:
    n=blk.split('.')[0]
    open(f'{out}/sit{n}.txt','w').write(re.search(r'\*\*Tình huống:\*\* (.*)',blk).group(1))
    open(f'{out}/crit{n}.txt','w').write(blk.split('**Đạt khi:**')[1].strip())
PY
chay() { n=$1; d="$OUT/w$n"; mkdir -p "$d"
  (cd "$d" && timeout 600 claude --plugin-dir "$PLUGIN" -p "Bạn là agent quản lý các dự án web. Người quản lý chuyển cho bạn: $(cat "$OUT/sit$n.txt")
Hãy xử lý bước tiếp theo. Trả lời đầy đủ nội dung bạn tạo ra ngay trong câu trả lời." \
    --allowedTools "Read,Write,Glob,Grep,Skill,WebSearch" < /dev/null > "$OUT/ans$n.txt" 2>&1)
  timeout 300 claude -p "Bạn là người chấm độc lập. Chấm câu trả lời của một agent theo từng tiêu chí, mỗi tiêu chí ĐẠT hoặc TRƯỢT kèm một câu lý do. Dòng cuối: KẾT QUẢ: ĐẠT nếu mọi tiêu chí đạt, ngược lại TRƯỢT.
TÌNH HUỐNG: $(cat "$OUT/sit$n.txt")
TIÊU CHÍ:
$(cat "$OUT/crit$n.txt")
CÂU TRẢ LỜI CỦA AGENT:
$(cat "$OUT/ans$n.txt")" < /dev/null > "$OUT/grade$n.txt" 2>&1; }
for f in "$OUT"/sit*.txt; do n=$(basename "$f" .txt); n=${n#sit}; if [ -z "$CHON" ] || [[ " $CHON " == *" $n "* ]]; then chay "$n" & fi; done; wait
for f in "$OUT"/sit*.txt; do n=$(basename "$f" .txt); n=${n#sit}; echo "Câu $n: $(grep -o 'KẾT QUẢ: *[^ *]*' "$OUT/grade$n.txt" | tail -1)"; done
