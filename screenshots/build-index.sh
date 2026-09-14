#!/usr/bin/env bash
# Writes screenshots/manifest.js from the screenshot folders and creates screenshots/index-<device>.html for each
# device value that has no page yet (spec 001 §17.5). Existing pages are left as they are. Run after adding a folder:
#   ./screenshots/build-index.sh
set -eo pipefail
cd "$(dirname "$0")"
shopt -s nullglob

# The part values of spec 001 §17.1 that are not device values. A folder name is read as §17.2 says.
BUILDS=(native-swift ionic-capacitor)
STYLES=(stock matched)
APPEARANCES=(dark)

# Prints the device value of a folder name, or "iphone" when the name has no device part.
device_of() {
  local rest=$1 build v device=()
  [[ $rest =~ ^(.*)-v[0-9]+$ ]] && rest=${BASH_REMATCH[1]}
  for build in "${BUILDS[@]}"; do
    if [[ $rest == "$build" || $rest == "$build"-* ]]; then rest=${rest#"$build"}; break; fi
  done
  IFS=- read -ra values <<< "${rest#-}"
  for v in ${values[@]+"${values[@]}"}; do
    [[ " ${STYLES[*]} ${APPEARANCES[*]} " == *" $v "* ]] || device+=("$v")
  done
  v=$(IFS=-; echo "${device[*]}")
  echo "${v:-iphone}"
}

# Prints "<width>,<height>" from the IHDR chunk of a PNG: bytes 16-19 and 20-23, big-endian.
png_size() {
  od -An -tu1 -j16 -N8 "$1" | awk 'NF { printf "%d,%d", $1*16777216 + $2*65536 + $3*256 + $4, $5*16777216 + $6*65536 + $7*256 + $8 }'
}

# Prints the arguments as a JavaScript list body: "a", "b".
quote_list() { local out="" v; for v in "$@"; do out+="${out:+, }\"$v\""; done; echo "$out"; }

folders=()
for dir in */; do
  dir=${dir%/}
  [[ $dir =~ -v[0-9]+$ ]] && folders+=("$dir")
done

{
  echo "// Written by build-index.sh from the folders in screenshots/; run it again after adding a folder."
  echo "// folder -> screenshot name -> [width px, height px]"
  echo "window.SCREENSHOT_PARTS = { builds: [$(quote_list "${BUILDS[@]}")], styles: [$(quote_list "${STYLES[@]}")], appearances: [$(quote_list "${APPEARANCES[@]}")] };"
  echo "window.SCREENSHOTS = {"
  for dir in "${folders[@]}"; do
    echo "  \"$dir\": {"
    for file in "$dir"/*.png; do
      name=${file##*/}
      echo "    \"${name%.png}\": [$(png_size "$file")],"
    done
    echo "  },"
  done
  echo "};"
} > manifest.js
echo "wrote manifest.js: ${#folders[@]} folders"

for device in $(for dir in "${folders[@]}"; do device_of "$dir"; done | sort -u); do
  page="index-$device.html"
  [[ -e $page ]] && continue
  sed "s/@DEVICE@/$device/g" > "$page" <<'EOF'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Screenshots: @DEVICE@</title>
<link rel="stylesheet" href="viewer.css">
</head>
<body data-device="@DEVICE@">
<header>
<h1>@DEVICE@</h1>
<p>The window setup of the <code>@DEVICE@</code> folders, with the spec 001 section that records it.</p>
</header>
<script src="manifest.js"></script>
<script src="viewer.js"></script>
</body>
</html>
EOF
  echo "created $page: replace its description"
done
