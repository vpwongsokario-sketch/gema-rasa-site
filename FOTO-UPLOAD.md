# Foto's klaarmaken voor de website

Foto's rechtstreeks uit de camera zijn vaak 10–15 MB per stuk. Dat maakt het
**uploaden traag** en vult de opslag snel. De website toont ze tóch verkleind,
dus je verliest geen kwaliteit door ze eerst kleiner te maken.

**Doel: langste zijde max 2000 pixels.** Dan is een foto ±300–500 KB in plaats
van 14 MB — tot 30× kleiner, zonder zichtbaar verschil op het scherm.

Kies één van deze manieren. **Geen daarvan vereist iets te installeren of een
terminal** (behalve de laatste, die is voor de techneut).

---

## Manier 1 — In de browser (werkt op elke computer) ⭐ aanrader voor vrijwilligers

1. Ga naar **bulkresizephotos.com** (gratis; je foto's blijven op je eigen
   computer, ze worden niet geüpload naar die site).
2. Sleep al je foto's erin.
3. Kies bij **"Resize by"** → **Longest Side** → vul **2000** in.
4. Kwaliteit op ~80%.
5. Klik **Start Resizing** → je krijgt een zip met de verkleinde foto's.
6. Pak de zip uit en upload díé foto's in de Studio bij **Fotoalbums**.

## Manier 2 — Op een Mac met het Voorvertoning-programma (Preview)

1. Selecteer alle foto's in Finder → open ze samen in **Voorvertoning**.
2. Selecteer links alle foto's (⌘A).
3. Menu **Gereedschap → Pas grootte aan…**
4. Zet de eenheid op **pixels**, "Pas verhouding aan" aangevinkt, en vul bij de
   grootste waarde **2000** in → **OK**.
5. Menu **Archief → Exporteer geselecteerde afbeeldingen…** → kies een nieuwe map.
6. Upload die map in de Studio.

## Manier 3 — Het script (alleen voor wie met de terminal werkt, bv. Virgil)

```bash
cd ~/gema-rasa-site
./scripts/fotos-verkleinen.sh ~/Desktop/naam-van-de-fotomap
```

Je krijgt er een map `naam-van-de-fotomap-web` naast met de verkleinde versies.
De originelen blijven ongemoeid.

---

## Kort samengevat voor in het CMS

- Verklein foto's naar **max 2000px** vóór het uploaden (manier 1 of 2).
- Upload ze dan bij **Fotoalbums** in de Studio; je kunt ze in één keer allemaal
  selecteren.
- Vul een titel, datum en korte omschrijving in en klik **Publish**.
