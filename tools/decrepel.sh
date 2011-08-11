#! /bin/sh

if uname -a | grep "Darwin*"; then
  sed() {
    gsed "$@"
  }
fi


sed -r '
  # Gates Projection vs. crepel
  1,3d;$d
' |
nl |
sed -r '
  s/=("[^"]*")/:\1,/g
  s/<([^ ]+)/{ "type": "\1", /
  s:/>:},:

  s/^ *([0-9]+)/"\1":/
' |
sed -r '
  1s/^/{\n/
  $s/$/\n}/
'

