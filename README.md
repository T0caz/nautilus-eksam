# Nautilus – moodul 4

Karl Kundla · eksam 8F3E5A · AI abiga loodud õppeprojekt

Viis avalikku lehetüüpi, eraldi toetusvaade, Node.js backend, SQLite, administraatori CRUD, päriselt andmebaasi salvestavad kontakt- ja registreerimisvormid. Makseid ei võeta. Ekspeditsioonid, kontaktandmed ja statistika on fiktiivsed.

## Kiirkäivitus

Vaja on **Node.js 24 või uuemat** ja terminali. npm-pakette, väliseid andmebaase ega API-võtmeid ei ole tarvis. Paigalda Node.js ametlikust allikast: https://nodejs.org/en/download.

Paki moodul4.zip lahti ja käivita selle kaustas:

```sh
node scripts/setup.mjs
node --env-file=.env scripts/create-admin.mjs
node --env-file=.env src/server.mjs
```

Teine käsk küsib sinu valitud e-posti ja vähemalt 12-märgilist parooli. Parooli sisestus on peidetud. Näidisparooli ega valmis administraatorit arhiivis ei ole.

Ava **http://127.0.0.1:3000**. Haldus asub **http://127.0.0.1:3000/admin**. Peatamiseks vajuta terminalis Ctrl+C. Kui npm on paigaldatud, vastavad käsud on `npm run setup`, `npm run admin` ja `npm start`.

`setup` loob äsja genereeritud juhusliku saladusega privaatse `.env` faili, rakendab migratsiooni ja lisab kuus näidisretke. Olemasolevat `.env` faili ei kirjutata üle. Retkede kustutamine säilib ka serveri taaskäivitamisel. `.env` ja andmebaas jäävad Giti ning ZIPi alt välja.

## Administraatori juhend

1. Ava `/admin` ja logi enda loodud kasutajaga sisse.
2. Vajuta **Lisa ekspeditsioon**. Täida nimi, URL-tunnus, kirjeldus, kategooria, asukoht, piirkond, sügavus, kestus, hind, kuupäev, grupi suurus ja pildid.
3. Pildid sisestatakse tunnustena, näiteks `wreck, hero, station`. Esimene on kaardipilt, ülejäänud galerii. Lubatud tunnused: `hero`, `wreck`, `submarine`, `station`, `jellyfish`, `texture`.
4. Salvesta. Retk ilmub kohe avalikku loendisse, detailvaatesse ja registreerimisvalikusse. HTML-faile pole vaja käsitsi muuta.
5. **Muuda** avab sama vormi olemasolevate väärtustega. **Kustuta** küsib brauseris kinnitust. Registreerimiste ajalooline retkenimi säilib kustutamisel.
6. Juhtimiskeskuse allosas näed kuni 100 viimast kontaktisõnumit ning kuni 100 viimast registreerimist ja annetuslubadust.
7. Väljumiseks vajuta **Logi välja**. Seanss tühistatakse serveris.

Pildifailide üleslaadimise funktsiooni pole; admin valib kaasasolevast pildikogust. Kontaktvorm ei saada vaikimisi e-kirja: sõnum jõuab töötavasse admini postkasti. Registreerimine on päring, mitte kinnitatud broneering. Toetus on annetuslubadus, mitte töödeldud makse.

## Tehnoloogiavaliku põhjendus

Valitud on Node.js 24 standardteek ja sisseehitatud SQLite. Ühe keele kasutamine hoiab projekti õpitavana: JavaScript töötab nii brauseris kui serveris, HTML-vaadete genereerimiseks kasutatakse sama moodulit staatilises ja dünaamilises versioonis. Eraldi raamistikku, npm-sõltuvusi, PHP-d ega andmebaasiserverit pole vaja. See teeb eksamiprojekti lahtipakkimise, käivitamise ja kontrollimise lihtsaks ning vähendab väliste pakettide tarneahelast tulenevat hoolduskoormust.

SQLite sobib väikese uurimiskeskuse sisule, kontaktidele ja registreerimispäringutele. SQL-skeem, välisvõtmed, kontrollpiirangud ja ettevalmistatud päringud teevad andmemudeli nähtavaks. Varundamiseks saab peatatud rakenduse andmebaasi kopeerida või kasutada SQLite varundusvahendeid. Migratsioon ja isikuandmeteta näidisandmete dump on kaasas.

Kompromissid on teadlikud. Standardteegi HTTP-server tähendab, et marsruutimine, vormivalideerimine ja CSRF on siin käsitsi rakendatud; suuremas projektis kasutaksin hooldatud raamistikku ja selle turvamooduleid. `DatabaseSync` on sünkroonne ning sobib väikese koormusega demole; suure koormuse või mitme rakendusinstantsi puhul valiksin PostgreSQL-i ja asünkroonse andmekihi. Admini pildikogu on piiratud, tegelikku makselahendust ega e-posti transporti pole lisatud. Tootmisse viimiseks on vaja HTTPS-pöördproksit, varundust, seiret, tegelikku privaatsusteavet ning andmete säilitamise protsessi. Node 24 sisseehitatud SQLite API versioonistaatust tuleb uuendamisel arvestada.

## Andmemudel

- `expeditions`: kõik nõutud ekspeditsiooniandmed, lisaks URL-tunnus, kategooria, piirkond ja grupi suurus.
- `admins`: e-post ja scrypt-parooliräsi.
- `sessions`: juhusliku seansitunnuse SHA-256 räsi, CSRF-tunnus, administraator ja aegumised.
- `contacts`: kontaktivormi andmed ja juhuslik kviitungitunnus.
- `registrations`: retke viide ja nimi, kontakt, osalejate arv, annetuslubadus sentides.
- `rate_limits`: ajutised HMAC-tunnusega päringuloendurid; IP-d avatekstis ei salvestata.
- `schema_migrations`, `settings`: migratsiooni ja algandmete lisamise olek.

Migratsioon: `migrations/001_initial.sql`. Näidisandmed: `src/seed.mjs`. Dump: `database/demo.sql`. Dump ei sisalda administraatoreid, seansse ega kasutajate sõnumeid.

## Turvalisuse rakendus

- Paroolid: juhuslik 16-baidine sool, scrypt `N=131072, r=8, p=1`, 64-baidine võti, võrdlus `timingSafeEqual` abil.
- Andmepäringud: seotud parameetrid; järjestuse SQL pärineb kinnisest lubatud valikust.
- Server kontrollib kõigi olekut muutvate vormide välju ja CSRF-tunnust, ka sisselogimisel ning väljalogimisel. Kui Origin-päis on olemas, peab see kattuma `APP_ORIGIN` väärtusega.
- Seansitunnus roteeritakse sisselogimisel. Küpsis on `HttpOnly`, `SameSite=Lax`, tootmises `Secure`. Absoluutne kestus 8 tundi, tegevusetuse piir 30 minutit.
- Kõik kasutajasisendid väljastatakse HTML-põgenemisega. Pildi- ja URL-tunnused on lubatud väärtuste loendiga piiratud. Päringu keha piir on 64 KiB.
- Sisselogimisel 5 katset 15 minuti jooksul IP kohta; avalikel vormidel 10, kõigil POST-päringutel 100. IP tunnus on HMAC, mitte avatekst.
- CSP, klikikaaperduse tõke, `nosniff`, piiratud brauseriõigused ja tootmises HSTS.
- Saladus luuakse `.env` faili. Andmebaas ja `.env` pole arhiivis ega Gitis. Vaikimisi kuulatav aadress on ainult `127.0.0.1`.

## REST-liides

| Meetod | Aadress | Tulemus |
|---|---|---|
| GET | `/api/expeditions` | Retked; valikulised `q`, `region`, `category`, `depth`, `duration`, `sort` |
| GET | `/api/expeditions/1` | Üks retk |
| GET | `/api/csrf` | Seansiküpsis ja JSON-i `csrf` |
| POST | `/api/contact` | Sõnum, vastus 201 ja `receipt` |
| POST | `/api/registrations` | Päring/annetuslubadus, vastus 201 ja `paymentTaken: false` |
| GET | `/health` | Andmebaasi ühenduse kontroll |

POST toetab JSON-i ja URL-kodeeritud vormi. Saada sama seansiküpsis ning `_csrf` väli või `X-CSRF-Token` päis. Valideerimisviga annab 422, puuduv/vale CSRF 403. Admini CRUD kasutab serveris renderdatud vorme; avalikku muutmis-API-t pole.

## Kontrollimine ja ehitus

```sh
node --test test/*.test.mjs
node scripts/build.mjs
```

Windows PowerShellis saab testida ka käsuga `node --test test/app.test.mjs`. Testid kasutavad mälus olevat andmebaasi ja fiktiivseid andmeid. Staatiline ehitus läheb `dist/` kausta. `dist`, `node_modules`, `vendor`, `.env` ja `data/*` on `.gitignore` failis. ZIP sisaldab ainult lähtekoodi, assette ja dokumentatsiooni.

Kaasas on GitHub Actionsi CI näidis. Docker: genereeri `.env`, siis `docker compose up --build`; admin loo `docker compose exec nautilus node scripts/create-admin.mjs` abil. Compose on kohalik HTTP-demo; tootmises määra `NODE_ENV=production`, tegelik HTTPS-i `APP_ORIGIN`, kaitstud saladus ja püsiv andmeketas. Dockerit ega CI-t ei käivitatud selles seansis.

## Git ja avaldamine

Arhiivis on `nautilus.git.bundle`, mis sisaldab päris kohalikke commit’e. Taasta ajalugu:

```sh
git clone nautilus.git.bundle nautilus
```

Avalik repositoorium ja backend pole veel avaldatud. `gitlink.txt` märgib selle ausalt. Lisa enda loodud Git-repositooriumi remote, lükka commit’id üles ning asenda lingifail päris URL-iga. Staatilise GitHub Pagesi juhend on moodul3 README-s.

## Allikad

- Node 24 SQLite: https://nodejs.org/download/release/v24.16.0/docs/api/sqlite.html
- Node crypto: https://nodejs.org/api/crypto.html
- OWASP CSRF juhend: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Inter ja OFL: `public/assets/fonts/OFL.txt`, https://github.com/google/fonts/tree/main/ofl/inter

Need viited selgitavad rakenduse valikuid; testide läbimine ei ole sõltumatu turvaaudit.
