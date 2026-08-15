#!/bin/sh
# Rebuild the CJK name font.
#
# The site carries one line of Korean and hanja: the name in the home page
# masthead. Shipping a whole CJK family for six characters would cost about
# 15 MB, so this fetches Noto Serif KR from Google, cuts it down to exactly
# the characters given, and writes the result to static/fonts/. Each weight
# lands at roughly 2 KB.
#
# Run this whenever the characters in hugo.toml's nameKo / nameHanja change,
# or when you start writing Korean anywhere else on the site and want those
# glyphs to have a matching face.
#
#   ./scripts/name-font.sh                 # uses the characters below
#   ./scripts/name-font.sh '박세윤朴世阭 안녕'  # or pass your own
#
# Needs curl and fontTools with brotli:  pip install 'fonttools[woff]'

set -eu

CHARS=${1:-박세윤朴世阭}
WEIGHTS="400 500"
OUT=$(CDPATH= cd -- "$(dirname -- "$0")/../static/fonts" && pwd)

# Google refuses the request without a browser user agent, and serves woff1
# to anything it doesn't recognise.
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

ENC=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$CHARS")

for w in $WEIGHTS; do
  url=$(curl -sf -A "$UA" \
    "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@$w&text=$ENC" \
    | sed -n 's/.*src: url(\([^)]*\)).*/\1/p')

  [ -n "$url" ] || { echo "no font URL for weight $w" >&2; exit 1; }

  curl -sf -A "$UA" "$url" -o "$OUT/.tmp-$w.woff2"

  # Google's slice still carries the jamo used to compose hangul. Cut to the
  # rendered glyphs only.
  python3 -m fontTools.subset "$OUT/.tmp-$w.woff2" \
    --text="$CHARS" --flavor=woff2 --layout-features='' \
    --no-hinting --desubroutinize \
    --output-file="$OUT/noto-serif-kr-$w.woff2"

  rm -f "$OUT/.tmp-$w.woff2"
  printf '%s  %s\n' "$(wc -c < "$OUT/noto-serif-kr-$w.woff2")" "noto-serif-kr-$w.woff2"
done

# Fail loudly rather than shipping a font with a hole in it.
python3 - "$OUT" "$CHARS" "$WEIGHTS" <<'EOF'
import sys
from fontTools.ttLib import TTFont
out, chars, weights = sys.argv[1], sys.argv[2], sys.argv[3].split()
bad = False
for w in weights:
    cmap = TTFont(f'{out}/noto-serif-kr-{w}.woff2').getBestCmap()
    missing = [c for c in chars if not c.isspace() and ord(c) not in cmap]
    if missing:
        bad = True
        print(f'weight {w} is missing {"".join(missing)}', file=sys.stderr)
if bad:
    sys.exit(1)
print('all characters present')
EOF
