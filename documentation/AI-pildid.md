# Nautilus – AI-piltide promptid

Karl Kundla · 8F3E5A · 25.11.2026

Kõik kuus pilti on AI-genereeritud selle projekti jaoks. Need on fiktiivsed illustratsioonid, mitte tõendid päris vrakkide ega uurimisjaama kohta. AI-meduu­si pilt on toetav illustratsioon, mitte eksami lõpplogo või vektorembleem.

Tööriist: ChatGPT / OpenAI sisseehitatud Image Generation. Tööriist ei avaldanud selle seansi tulemuses täpset mudeli identifikaatorit, seemet ega samplerit; neid pole oletatud. Iga fail loodi eraldi promptiga. Viitepilte ei kasutatud. Parameeter `transparent_background=false`; väljundid on PNG-formaadis ja läbipaistmatu taustaga.

## hero.png

**Otstarve:** Avalehe hero.

**Algfail:** `original/hero.png`. **Veebifailid:** `optimized/hero-{400,800,1600}.webp`.

**Täpne tööriistale saadetud prompt:**

```text
Use case: stylized-concept. Asset type: wide cinematic website hero photograph for Nautilus, a fictional deep sea wreck mapping research station. Ultra-wide underwater view of a small advanced research submersible illuminating the enormous ghostly silhouette of a twentieth century shipwreck resting on the Baltic seabed, depth and mystery, realistic suspended particles and volumetric beams. Composition: main shipwreck and submersible in the right two thirds, dark negative space at left for a website headline, no text in the image. Color palette: near-black deep ocean #0A131A, muted plum purple #743D73 highlights, cold blue water, restrained pale mint instrument lights. Premium editorial expedition photography, scientifically plausible atmosphere, dramatic but calm, no divers, no logos, no lettering, no watermark. Landscape 16:9.
```

**Töötlus:** algne PNG säilitati muutmata; veebivariandid teisendati RGB-sse ja WebP-vormingusse (Pillow, kvaliteet 80, method 6), proportsioonid säilitati. Väiksemad variandid on 400 ja 800 px laiad. Sufiks `1600` tähistab maksimaalset laiust: algsest väiksemat pilti ei suurendatud. Täpsed mõõdud ja baidimahud on allpool. Tausta eemaldamist, retušeerimist, sisumuutmist ega eraldi värvikorrektsiooni ei tehtud. Optimeeritud koopiate eksport ei säilita kõiki PNG metaandmeid; AI päritolu on dokumenteeritud siin ja veebis.

## wreck.png

**Otstarve:** Ekspeditsioon ja galerii 1.

**Algfail:** `original/wreck.png`. **Veebifailid:** `optimized/wreck-{400,800,1600}.webp`.

**Täpne tööriistale saadetud prompt:**

```text
Use case: stylized-concept. Asset type: landscape expedition photo for the fictional Nautilus marine research website. An intact old Baltic wooden sailing shipwreck with a tall broken mast on a silty seabed, photographed by a remotely operated underwater vehicle, tiny visible ROV at a distance, meticulous detail in weathered timber, cool marine haze, a fine subtle plum-purple research light and pale mint highlights, predominantly deep ocean #0A131A, realistic documentary expedition mood. Main subject centered, clear silhouette for an expedition card and gallery, 3:2 landscape. No text, no logo, no watermark, no people. Fictional wreck, do not imitate a particular real wreck.
```

**Töötlus:** algne PNG säilitati muutmata; veebivariandid teisendati RGB-sse ja WebP-vormingusse (Pillow, kvaliteet 80, method 6), proportsioonid säilitati. Väiksemad variandid on 400 ja 800 px laiad. Sufiks `1600` tähistab maksimaalset laiust: algsest väiksemat pilti ei suurendatud. Täpsed mõõdud ja baidimahud on allpool. Tausta eemaldamist, retušeerimist, sisumuutmist ega eraldi värvikorrektsiooni ei tehtud. Optimeeritud koopiate eksport ei säilita kõiki PNG metaandmeid; AI päritolu on dokumenteeritud siin ja veebis.

## submarine.png

**Otstarve:** Ekspeditsioon ja galerii 2.

**Algfail:** `original/submarine.png`. **Veebifailid:** `optimized/submarine-{400,800,1600}.webp`.

**Täpne tööriistale saadetud prompt:**

```text
Use case: stylized-concept. Asset type: landscape expedition photo for fictional Nautilus marine research website. Side view of an abandoned early twentieth century submarine resting on a dark Baltic seabed, corroded steel hull and small conning tower, observed by the searchlights of an off-camera research vehicle, realistic deep underwater documentary image. Wide clear composition, cold navy water and subtle plum purple light #743D73 with pale mint beams, particulate haze, premium cinematic editorial quality, scientifically plausible proportions. 3:2 landscape. No flags, no real vessel names, no text, no logo, no watermark, no human remains.
```

**Töötlus:** algne PNG säilitati muutmata; veebivariandid teisendati RGB-sse ja WebP-vormingusse (Pillow, kvaliteet 80, method 6), proportsioonid säilitati. Väiksemad variandid on 400 ja 800 px laiad. Sufiks `1600` tähistab maksimaalset laiust: algsest väiksemat pilti ei suurendatud. Täpsed mõõdud ja baidimahud on allpool. Tausta eemaldamist, retušeerimist, sisumuutmist ega eraldi värvikorrektsiooni ei tehtud. Optimeeritud koopiate eksport ei säilita kõiki PNG metaandmeid; AI päritolu on dokumenteeritud siin ja veebis.

## station.png

**Otstarve:** Ekspeditsioon ja galerii 3.

**Algfail:** `original/station.png`. **Veebifailid:** `optimized/station-{400,800,1600}.webp`.

**Täpne tööriistale saadetud prompt:**

```text
Use case: stylized-concept. Asset type: landscape deep-sea research station image for fictional Nautilus expedition gallery. A compact futuristic ocean floor research observatory with spherical pressure chamber, scientific instrument array and a small tethered ROV mapping a nearby fragmented steel wreck, realistic engineered materials, dark deep-sea setting, calm precision and exploration, editorial science photography. Navy-black ocean #0A131A, muted plum #743D73 lighting, soft pale mint window lights, subtle particles. 3:2 landscape, no people, no labels, no letters, no logo, no watermark.
```

**Töötlus:** algne PNG säilitati muutmata; veebivariandid teisendati RGB-sse ja WebP-vormingusse (Pillow, kvaliteet 80, method 6), proportsioonid säilitati. Väiksemad variandid on 400 ja 800 px laiad. Sufiks `1600` tähistab maksimaalset laiust: algsest väiksemat pilti ei suurendatud. Täpsed mõõdud ja baidimahud on allpool. Tausta eemaldamist, retušeerimist, sisumuutmist ega eraldi värvikorrektsiooni ei tehtud. Optimeeritud koopiate eksport ei säilita kõiki PNG metaandmeid; AI päritolu on dokumenteeritud siin ja veebis.

## jellyfish.png

**Otstarve:** AI-meduu­si illustratsioon; ei ole logo ega vektorembleem.

**Algfail:** `original/jellyfish.png`. **Veebifailid:** `optimized/jellyfish-{400,800,1600}.webp`.

**Täpne tööriistale saadetud prompt:**

```text
Use case: stylized-concept. Asset type: supporting jellyfish mascot illustration for Nautilus marine research website, explicitly not a logo or emblem. One elegant translucent moon jellyfish floating in black deep ocean, gently curved bell with luminous plum-purple edge #A56BA3 and long graceful thin pale mint tentacles, realistic biological detail with a subtly approachable character, premium photographic 3D illustration, soft bioluminescence, isolated central subject with generous dark negative space, square composition. No face, no eyes added, no text, no letters, no logo, no watermark. Opaque dark navy background.
```

**Töötlus:** algne PNG säilitati muutmata; veebivariandid teisendati RGB-sse ja WebP-vormingusse (Pillow, kvaliteet 80, method 6), proportsioonid säilitati. Väiksemad variandid on 400 ja 800 px laiad. Sufiks `1600` tähistab maksimaalset laiust: algsest väiksemat pilti ei suurendatud. Täpsed mõõdud ja baidimahud on allpool. Tausta eemaldamist, retušeerimist, sisumuutmist ega eraldi värvikorrektsiooni ei tehtud. Optimeeritud koopiate eksport ei säilita kõiki PNG metaandmeid; AI päritolu on dokumenteeritud siin ja veebis.

## texture.png

**Otstarve:** Taustatekstuur.

**Algfail:** `original/texture.png`. **Veebifailid:** `optimized/texture-{400,800,1600}.webp`.

**Täpne tööriistale saadetud prompt:**

```text
Use case: stylized-concept. Asset type: subtle dark underwater texture for Nautilus website section background. Abstract underwater bathymetric light caustics and drifting fine particles, hints of distant contour-like ripples and soft plum purple glow #743D73 against near-black navy #0A131A, restrained premium scientific atmosphere, no distinct objects, low contrast enough to place readable white text over it, elegant organic detail, landscape 16:9. No text, no logos, no numbers, no watermark.
```

**Töötlus:** algne PNG säilitati muutmata; veebivariandid teisendati RGB-sse ja WebP-vormingusse (Pillow, kvaliteet 80, method 6), proportsioonid säilitati. Väiksemad variandid on 400 ja 800 px laiad. Sufiks `1600` tähistab maksimaalset laiust: algsest väiksemat pilti ei suurendatud. Täpsed mõõdud ja baidimahud on allpool. Tausta eemaldamist, retušeerimist, sisumuutmist ega eraldi värvikorrektsiooni ei tehtud. Optimeeritud koopiate eksport ei säilita kõiki PNG metaandmeid; AI päritolu on dokumenteeritud siin ja veebis.

## Optimeeritud failid

| Fail | Mõõdud | Baite |
|---|---:|---:|
| hero-1600.webp | 1600 × 900 | 70128 |
| hero-400.webp | 400 × 225 | 5318 |
| hero-800.webp | 800 × 450 | 19600 |
| jellyfish-1600.webp | 1254 × 1254 | 82390 |
| jellyfish-400.webp | 400 × 400 | 13534 |
| jellyfish-800.webp | 800 × 800 | 42412 |
| station-1600.webp | 1536 × 1024 | 202204 |
| station-400.webp | 400 × 267 | 18328 |
| station-800.webp | 800 × 533 | 66706 |
| submarine-1600.webp | 1536 × 1024 | 108196 |
| submarine-400.webp | 400 × 267 | 8968 |
| submarine-800.webp | 800 × 533 | 33616 |
| texture-1600.webp | 1600 × 900 | 17292 |
| texture-400.webp | 400 × 225 | 2254 |
| texture-800.webp | 800 × 450 | 6160 |
| wreck-1600.webp | 1536 × 1024 | 117412 |
| wreck-400.webp | 400 × 267 | 9670 |
| wreck-800.webp | 800 × 533 | 35644 |

## Kasutustingimused ja läbipaistvus

OpenAI tingimuste järgi jäävad kasutaja ja OpenAI vahel väljundi õigused kasutajale kohaldatava õiguse lubatud ulatuses. Väljundite kasutamine peab vastama teenuse kehtivatele tingimustele. See ei tõenda väljundi unikaalsust ega anna garantiid eraldi autoriõiguse või kolmandate isikute õiguste puudumise kohta.

Ametlik viide: https://openai.com/policies/terms-of-use/ (kontrollitud 25.11.2026). Veebis on pildid sõnaselgelt AI-illustratsioonideks märgitud ja eraldi materjalide leht selgitab nende päritolu. Kontaktlehe aadressid ja näidisretked on fiktiivsed.

Piltidel ei ole nähtavaid vesimärke, logosid ega tegelike vrakkide identifikaatoreid. Kontrolliti kogu kuue pildi kontaktlehte.
