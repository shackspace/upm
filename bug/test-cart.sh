#! /bin/sh
set -euf

main() {
  id="`POST /cart | parse_JSON_string`"
  echo "id = $id"

  ignore="`GET "$id"`"

  ignore="`PUT "$id/part/42" 52`"
  ignore="`GET "$id"`"

  ignore="`PUT "$id/part/23" '"retard"'`"
  ignore="`GET "$id"`"

  ignore="`DELETE "$id/part/42"`"
  ignore="`GET "$id"`"

  ignore="`DELETE "$id/part/23"`"
  ignore="`GET "$id"`"

}


api='http://localhost:31337'
HTTP() {
  echo "[35;1m< $*[m" >&2
  res="`curl -sS -X $1 ${3+-H 'Content-Type: application/json' -d "$3"} \
      "$api$2"`"
  echo "[34;1m> $res[m" >&2
  echo -n "$res"
}
GET() { HTTP GET "$1"; }
PUT() { HTTP PUT "$1" ${2+"$2"}; }
POST() { HTTP POST "$1" ${2+"$2"}; }
DELETE() { HTTP DELETE "$1" ${2+"$2"}; }

parse_JSON_string() {
  sed -rn 's/^"(.*)"/\1/p' | grep .
}

main
