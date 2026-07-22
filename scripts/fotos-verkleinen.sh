#!/bin/bash
#
# Maakt foto's klaar om te uploaden naar het CMS.
#
# Waarom: de site toont foto's altijd verkleind, maar het CMS bewaart wél het
# origineel. Een foto van 5 MB uit de camera wordt zo ongeveer 400 KB — tien keer
# kleiner, zonder zichtbaar verschil op het scherm.
#
# Gebruik:
#   ./scripts/fotos-verkleinen.sh ~/Desktop/fotos-cara-jawa
#
# Je originelen blijven ongemoeid. De verkleinde versies komen in een nieuwe map
# "<mapnaam>-web" ernaast. Die map upload je in de Studio.
#
# Gebruikt sips, dat standaard op elke Mac staat — je hoeft niets te installeren.
#
# Het script maakt een foto nooit groter: is een foto al klein genoeg, dan wordt
# het origineel gewoon overgenomen.

set -euo pipefail

MAP="${1:-}"
MAX_ZIJDE=2000   # langste zijde in pixels
KWALITEIT=80

if [ -z "$MAP" ]; then
  echo "Geef de map met foto's op, bijvoorbeeld:"
  echo "  ./scripts/fotos-verkleinen.sh ~/Desktop/fotos-cara-jawa"
  exit 1
fi
[ -d "$MAP" ] || { echo "Map niet gevonden: $MAP"; exit 1; }

MAP="${MAP%/}"
DOEL="${MAP}-web"
mkdir -p "$DOEL"

echo "Foto's klaarmaken (max ${MAX_ZIJDE}px)…"
echo "  van : $MAP"
echo "  naar: $DOEL"
echo ""

aantal=0; verkleind=0; voor_totaal=0; na_totaal=0

while IFS= read -r -d '' bestand; do
  naam="$(basename "$bestand")"
  ext="$(echo "${naam##*.}" | tr '[:upper:]' '[:lower:]')"
  kaal="${naam%.*}"
  voor=$(stat -f%z "$bestand")

  # Huidige afmetingen opvragen
  breedte=$(sips -g pixelWidth  "$bestand" 2>/dev/null | awk '/pixelWidth/{print $2}')
  hoogte=$( sips -g pixelHeight "$bestand" 2>/dev/null | awk '/pixelHeight/{print $2}')
  langste=$(( breedte > hoogte ? breedte : hoogte ))

  if [ "$ext" = "heic" ]; then
    # HEIC moet hoe dan ook omgezet worden; browsers tonen het niet
    doelbestand="$DOEL/${kaal}.jpg"
    sips -s format jpeg -s formatOptions "$KWALITEIT" "$bestand" --out "$doelbestand" >/dev/null 2>&1
    [ "$langste" -gt "$MAX_ZIJDE" ] && sips -Z "$MAX_ZIJDE" "$doelbestand" >/dev/null 2>&1
    verkleind=$((verkleind + 1))
  elif [ "$langste" -gt "$MAX_ZIJDE" ]; then
    # Alleen verkleinen wanneer de foto daadwerkelijk te groot is
    doelbestand="$DOEL/${kaal}.jpg"
    sips -Z "$MAX_ZIJDE" -s format jpeg -s formatOptions "$KWALITEIT" "$bestand" --out "$doelbestand" >/dev/null 2>&1
    verkleind=$((verkleind + 1))
  else
    # Al klein genoeg: origineel overnemen
    doelbestand="$DOEL/$naam"
    cp "$bestand" "$doelbestand"
  fi

  na=$(stat -f%z "$doelbestand")

  # Veiligheidsnet: is het resultaat groter geworden, houd dan het origineel
  if [ "$na" -gt "$voor" ] && [ "$ext" != "heic" ]; then
    rm -f "$doelbestand"
    cp "$bestand" "$DOEL/$naam"
    na=$voor
  fi

  voor_totaal=$((voor_totaal + voor)); na_totaal=$((na_totaal + na)); aantal=$((aantal + 1))
  printf "  %-40s %6s KB -> %6s KB  (%sx%s)\n" "${naam:0:40}" "$((voor/1024))" "$((na/1024))" "$breedte" "$hoogte"
done < <(find "$MAP" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.heic' \) -print0)

[ "$aantal" -gt 0 ] || { echo "Geen foto's gevonden in $MAP"; exit 1; }

echo ""
echo "Klaar: $aantal foto's ($verkleind verkleind)"
printf "  was : %s MB\n" "$(echo "scale=1; $voor_totaal/1048576" | bc)"
printf "  nu  : %s MB\n" "$(echo "scale=1; $na_totaal/1048576" | bc)"
echo ""
echo "Upload nu de map $DOEL in de Studio bij Fotoalbums."
