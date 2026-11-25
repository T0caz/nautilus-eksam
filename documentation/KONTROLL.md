# Kontrollitulemused

25.11.2026 · Karl Kundla · Nautilus · 8F3E5A

| Kontroll | Tulemus |
|---|---|
| Backendi automaattestid | 21 / 21 läbitud |
| W3C Nu HTML checker | 14 HTML-faili, 0 viga, 0 hoiatust |
| Brauseri seadmevaated | 5 lehetüüpi × 3 resolutsiooni; 15 / 15 ilma lehe horisontaalse ülevooluta |
| Lighthouse mobile Performance | 99 |
| Lighthouse mobile Accessibility / Best Practices / SEO | 100 / 100 / 100 |
| Lighthouse desktop Performance / Accessibility / Best Practices / SEO | 100 / 100 / 100 / 100 |
| GitHub Pages | avaldatud ja HTTP-s kontrollitud |

Lighthouse 13.6.0 mõõtis GitHub Actionsi Linuxi keskkonnas kompileeritud avalehte aadressil http://127.0.0.1:4173/. Mõõtmised algasid 25.11.2026 kell 12:44 Tallinna aja järgi. Tegemist ei ole avaliku GitHub Pagesi võrguühenduse kiirustestiga. Skoorid võivad keskkonna ja koormuse järgi muutuda. Lighthouse'i Accessibility 100 ei tõenda täielikku WCAG-vastavust.

Auditeeritud rakenduse commit: d7ee363da26277f4e977f367f9e49bc5489aa382.

CI ja raportite päritolu: https://github.com/T0caz/nautilus-eksam/actions/runs/45597824525

Allalaetud lighthouse-reports.zip SHA-256 vastas GitHubis avaldatud artefakti räsi väärtusele:
`1a3248e801f0d89a71af5fd456f435b8dd8f109a205e0f41ca72bcd539fbca8f`.

HTML- ja JSON-Lighthouse'i raportid on siinsamas. W3C iga lehe JSON ja kokkuvõte asuvad w3c/ kaustas. Kohalikud Node testitulemused on backend-testid.txt failis.

Brauseris kontrolliti 1920×1080, 768×1024 ja 390×844 vaateid: üks H1, Interi fondipere, katkiste laaditud piltide puudumine ning scrollWidth == innerWidth igal lehel. Mobiilimenüü avanes ja Escape sulges selle; galeriinupp vahetas oleku „Pilt 1 / 3” → „Pilt 2 / 3”. Kontakti, registreerimise, autentimise ja CRUDi serverivooge tõendavad automaattestid.

Algne kohalik Lighthouse'i käivitus oli macOS-i Mach-portide piirangu tõttu blokeeritud. Takistus lahendati ametliku Lighthouse'i käivitamisega GitHub Actionsis; ühtegi skoori ei simuleeritud.

Avalik veeb: https://t0caz.github.io/nautilus-eksam/
Kood: https://github.com/T0caz/nautilus-eksam
