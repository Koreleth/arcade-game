# Bomberman – Browser-Version

Port des Processing-Spiels (`../source`) nach **p5.js** (HTML, CSS, JavaScript).
Der Ordner `web/` ist komplett eigenständig und kann so wie er ist hochgeladen werden.

## Spielmodi

- **LOCAL – 2 PLAYERS:** wie im Original, zu zweit an einer Tastatur.
- **ONLINE (2–4 Spieler):** Einer klickt auf *CREATE ONLINE LOBBY* und bekommt einen
  4-stelligen Code. Die anderen geben den Code bei *JOIN* ein, egal von wo,
  oder öffnen den Einladungslink (*COPY INVITE LINK*, z. B. `…/arcade-game/?join=1234`).
  Sobald mindestens 2 Spieler da sind, kann der Host das Spiel starten.
  Online steuert jeder seinen eigenen Charakter mit **WASD oder den Pfeiltasten**
  und legt Bomben mit **einer der beiden Bomben-Tasten** (Standard: Leertaste / Alt Gr).

Die vier Charaktere: Spieler 1 weiß/blau, Spieler 2 weiß/türkis, Spieler 3 rot/gold, Spieler 4 schwarz/lime.

**Einstellungen** (Lautstärke, Bomben-Tasten) werden nur im eigenen Browser gespeichert
(`localStorage`) und gelten nur für einen selbst.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `js/bomberman.js` | entspricht `Bomberman.pde`: setup, draw, Tastatur, Spielzustände |
| `js/animations.js` | entspricht `Animations.pde` |
| `js/bomb.js` | entspricht `Bomb.pde` |
| `js/hud.js` | entspricht `HUD.pde`, plus kompaktes HUD für 3–4 Spieler |
| `js/karte.js` | entspricht `Karte.pde` |
| `js/player.js` | entspricht `Player.pde` |
| `js/net.js` | Online-Lobby und Multiplayer (neu) |
| `js/sound.js` | Ersatz für `processing.sound.SoundFile` (Web Audio API) |
| `js/helpers.js` | Java-Ganzzahldivision, Sprite-Ausschnitte, Tastennamen, Zufallsgenerator, Einstellungen |

p5.js (cdnjs) und PeerJS (jsDelivr) werden über ein CDN geladen.

### So funktioniert der Online-Modus

- Die Browser verbinden sich **direkt miteinander** (WebRTC über [PeerJS](https://peerjs.com/)).
  Den Lobby-Code vermittelt der kostenlose öffentliche PeerJS-Server, danach läuft alles direkt
  zwischen den Spielern. Ein eigener Server ist nicht nötig, das Spiel bleibt eine statische Webseite.
- **Lockstep:** Der Host sammelt die Tastendrücke aller Spieler und schickt sie 60-mal pro Sekunde
  als nummerierte Frames an alle. Jeder Browser simuliert dasselbe Spiel mit denselben Eingaben.
  Die Items entstehen mit einem gemeinsamen Zufalls-Seed, deshalb ist das Spielfeld überall gleich.
- Verlässt jemand das laufende Spiel, scheidet sein Charakter aus. Verlässt der Host das Spiel,
  ist die Runde für alle beendet.

**Bekannte Grenzen:**

- In manchen Netzwerken (strenge Firmen- oder Uni-Netze, manche Mobilfunknetze) kommt keine direkte
  Verbindung zustande. Dafür bräuchte man einen TURN-Server, der ist nicht eingebaut.
- Der Host sollte seinen Tab im Vordergrund lassen. Im Hintergrund drosseln Browser die Seite,
  und dann läuft das Spiel für alle langsamer.
- Siegesansagen gibt es nur für Spieler 1 und 2 (`p1win.wav`, `p2win.wav`).

## Lokal starten

Wegen der Sicherheitsregeln im Browser funktioniert ein Doppelklick auf `index.html` nicht
(Bilder, Schriften und Sounds werden dann blockiert). Stattdessen einen lokalen Server starten:

```bash
python -m http.server 8080 -d web
```

Danach <http://localhost:8080> öffnen. Den Online-Modus kann man lokal mit zwei Browser-Tabs testen.

## Online stellen

**GitHub Pages (eingerichtet):** Der Workflow `.github/workflows/pages.yml` veröffentlicht
bei jedem Push auf `main` den Ordner `web/`. Einmalig im Repo unter
*Settings → Pages → Build and deployment → Source* **„GitHub Actions“** auswählen
und danach unter *Actions* den Workflow einmal neu starten („Re-run all jobs“).
Das Spiel ist dann unter `https://koreleth.github.io/arcade-game/` erreichbar.

**itch.io:** Den *Inhalt* von `web/` zippen (die `index.html` muss oben im ZIP liegen),
als neues Projekt mit „Kind of project: HTML“ hochladen und eine Größe von 750×750 einstellen.

**Netlify / Cloudflare Pages:** Den Ordner `web/` per Drag & Drop hochladen.

## Credits

Menümusik: „That's it for today (LOOP)“ von ViRiX Dreamcore, CC-Lizenz.

> Some of the songs and/or sound effects in this project were created by ViRiX Dreamcore (David Mckee).
> [www.virixcore.net](https://www.virixcore.net) for more information

Der Hinweis steht auch im Spiel: auf dem Startbildschirm und auf dem Bildschirm hinter dem Beenden-Button (X).

## Unterschiede zur Processing-Version

- Online-Modus für 2–4 Spieler mit Lobby-Code und zwei neuen Charakterfarben.
- Die Menümusik ist ein lizenzfreier Song (siehe Credits) statt des Originals aus der Processing-Version.
- Beim Laden erscheint „CLICK TO START“, weil Browser Ton erst nach einer Nutzeraktion erlauben.
- Der Beenden-Button (X) zeigt einen Abschiedsbildschirm, denn ein Browser-Tab lässt sich nicht vom Spiel schließen.
- Das Spiel läuft unabhängig von der Bildwiederholrate des Monitors mit festen 60 Spiel-Frames pro Sekunde.
- Bomben-Tasten werden als Tastencode gespeichert, dadurch funktionieren auch Sonderzeichen beim Neubelegen.
- Nach einer Runde werden alle Bomben gelöscht (vorher blieb wegen `remove(i)` in der Schleife jede zweite übrig).
- Der Schutz nach dem Respawn dauert für alle Spieler 5 Sekunden (vorher Spieler 1: 5 s, Spieler 2: 4 s).
- Die Runde endet, sobald nur noch ein Spieler Leben hat, und erst nach dessen Todesanimation.
  Sterben die letzten beiden kurz nacheinander, ergibt das jetzt ein Unentschieden.
