-- Nautilus: schema and fictional demo content only. No credentials or personal submissions.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS admins(id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS expeditions(
 id INTEGER PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
 category TEXT NOT NULL CHECK(category IN ('Vrakiuuring','Ajalugu','Tehnoloogia')),
 description TEXT NOT NULL, location TEXT NOT NULL, region TEXT NOT NULL,
 depth INTEGER NOT NULL CHECK(depth BETWEEN 1 AND 11000), duration INTEGER NOT NULL CHECK(duration BETWEEN 1 AND 365),
 price_cents INTEGER NOT NULL CHECK(price_cents BETWEEN 0 AND 100000000), date TEXT NOT NULL,
 capacity INTEGER NOT NULL DEFAULT 8 CHECK(capacity BETWEEN 1 AND 100), images TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS expedition_date_idx ON expeditions(date);
CREATE TABLE IF NOT EXISTS sessions(
 token_hash TEXT PRIMARY KEY, admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
 csrf TEXT NOT NULL, expires_at INTEGER NOT NULL, last_seen INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS contacts(
 id INTEGER PRIMARY KEY, receipt TEXT NOT NULL UNIQUE, name TEXT NOT NULL, email TEXT NOT NULL,
 subject TEXT NOT NULL, message TEXT NOT NULL, consent INTEGER NOT NULL CHECK(consent=1),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS registrations(
 id INTEGER PRIMARY KEY, receipt TEXT NOT NULL UNIQUE,
 expedition_id INTEGER REFERENCES expeditions(id) ON DELETE SET NULL, expedition_name TEXT,
 name TEXT NOT NULL, email TEXT NOT NULL, participants INTEGER NOT NULL CHECK(participants BETWEEN 0 AND 6),
 donation_cents INTEGER NOT NULL CHECK(donation_cents BETWEEN 0 AND 1000000),
 consent INTEGER NOT NULL CHECK(consent=1), status TEXT NOT NULL DEFAULT 'pending' CHECK(status='pending'),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY, count INTEGER NOT NULL, resets_at INTEGER NOT NULL);
INSERT OR IGNORE INTO schema_migrations(version) VALUES(1);

BEGIN;
INSERT INTO expeditions(id,slug,name,category,description,location,region,depth,duration,price_cents,date,capacity,images,created_at,updated_at) VALUES(1,'vaikne-tunnistaja','Vaikne tunnistaja','Vrakiuuring','Uurime ajaloolise purjelaeva vrakki Läänemeres. Osaled ROV-vaatlustes, õpid fotogrammeetriat ja aitad luua täpset 3D-kaarti. Vraki vaatlemine toimub uurimislaevalt; sukeldumiskogemus ei ole vajalik. Kõik leiukohad ja retked on selle õppeprojekti jaoks välja mõeldud.','Tallinna lähiala','Läänemeri',72,3,49000,'2027-06-12',8,'["wreck","hero","station"]','2026-11-25 10:43:03','2026-11-25 10:43:03');
INSERT INTO expeditions(id,slug,name,category,description,location,region,depth,duration,price_cents,date,capacity,images,created_at,updated_at) VALUES(2,'terasest-vari','Terasest vari','Ajalugu','Kaardistame väljamõeldud allveelaeva ja uurime, kuidas merekeskkond teraskonstruktsioone muudab. Retkel ühendame sonariandmed ja ROV-video ühtseks digitaalseks arhiiviks.','Hanko lähiala','Soome laht',95,2,39000,'2027-06-26',10,'["submarine","wreck","hero"]','2026-11-25 10:43:03','2026-11-25 10:43:03');
INSERT INTO expeditions(id,slug,name,category,description,location,region,depth,duration,price_cents,date,capacity,images,created_at,updated_at) VALUES(3,'sugaviku-labor','Sügaviku labor','Tehnoloogia','Tutvu süvamere observatooriumi tööga ja osale uurimisroboti missiooni planeerimisel. Õpime tundma sügavuse mõju meretehnoloogiale ning dokumenteerime merepõhja elukeskkonda.','Visby lähiala','Läänemeri',180,5,89000,'2027-07-10',6,'["station","hero","submarine"]','2026-11-25 10:43:03','2026-11-25 10:43:03');
INSERT INTO expeditions(id,slug,name,category,description,location,region,depth,duration,price_cents,date,capacity,images,created_at,updated_at) VALUES(4,'kadunud-kompass','Kadunud kompass','Vrakiuuring','Rannalähedane uurimisretk alustavale merehuvilisele. Otsime sonaripildilt ajaloolise kaubalaeva jälgi ja koostame esialgse vrakikaardi.','Hiiumaa lähiala','Läänemeri',38,1,19000,'2027-07-24',12,'["wreck","submarine","station"]','2026-11-25 10:43:03','2026-11-25 10:43:03');
INSERT INTO expeditions(id,slug,name,category,description,location,region,depth,duration,price_cents,date,capacity,images,created_at,updated_at) VALUES(5,'pohjala-arhiiv','Põhjala arhiiv','Ajalugu','Merepärandi dokumenteerimine Soome lahes. Analüüsime ekspeditsiooni fotosid ja õpime vrakileidu kirjeldama nii, et andmed oleksid teistele uurijatele kasulikud.','Helsingi lähiala','Soome laht',110,4,69000,'2027-08-07',8,'["submarine","hero","wreck"]','2026-11-25 10:43:03','2026-11-25 10:43:03');
INSERT INTO expeditions(id,slug,name,category,description,location,region,depth,duration,price_cents,date,capacity,images,created_at,updated_at) VALUES(6,'vrakikaardi-tootuba','Vrakikaardi töötuba','Tehnoloogia','Praktiline sissejuhatus merepõhja 3D-kaardistamisse. Võrdleme sonari- ja fotoandmeid ning loome väikese vragifragmendi digitaalse mudeli.','Tallinna lähiala','Soome laht',45,2,29000,'2027-08-21',10,'["station","wreck","submarine"]','2026-11-25 10:43:03','2026-11-25 10:43:03');
INSERT OR REPLACE INTO settings(key,value) VALUES('seeded','1');
COMMIT;
