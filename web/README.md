# Bomberman – Browser-Version

Port des Processing-Spiels (`../source`) nach **p5.js** (HTML, CSS, JavaScript).
Der Ordner `web/` ist komplett eigenständig und kann so wie er ist hochgeladen werden.

## Aufbau

| Datei | Entspricht in Processing |
| --- | --- |
| `js/bomberman.js` | `Bomberman.pde` (setup, draw, Tastatur, Spielzustände) |
| `js/animations.js` | `Animations.pde` |
| `js/bomb.js` | `Bomb.pde` |
| `js/hud.js` | `HUD.pde` |
| `js/karte.js` | `Karte.pde` |
| `js/player.js` | `Player.pde` |
| `js/sound.js` | Ersatz für `processing.sound.SoundFile` (Web Audio API) |
| `js/helpers.js` | Java-Ganzzahldivision, Sprite-Ausschnitte, Tastennamen |

p5.js wird über das CDN (cdnjs) geladen.

## Lokal starten

Wegen der Sicherheitsregeln im Browser funktioniert ein Doppelklick auf `index.html` nicht
(Bilder, Schriften und Sounds werden dann blockiert). Stattdessen einen lokalen Server starten:

```bash
python -m http.server 8080 -d web
```

Danach <http://localhost:8080> öffnen.

## Online stellen

**GitHub Pages (eingerichtet):** Der Workflow `.github/workflows/pages.yml` veröffentlicht
bei jedem Push auf `main` den Ordner `web/`. Einmalig im Repo unter
*Settings → Pages → Build and deployment → Source* **„GitHub Actions“** auswählen.
Das Spiel ist danach unter `https://koreleth.github.io/Arcade-Game/` erreichbar.

**itch.io:** Den *Inhalt* von `web/` zippen (die `index.html` muss oben im ZIP liegen),
als neues Projekt mit „Kind of project: HTML“ hochladen und eine Größe von 750×750 einstellen.

**Netlify / Cloudflare Pages:** Den Ordner `web/` per Drag & Drop hochladen.

## Credits

Menümusik: „That's it for today (LOOP)“ von ViRiX Dreamcore, CC-Lizenz.

> Some of the songs and/or sound effects in this project were created by ViRiX Dreamcore (David Mckee).
> [www.virixcore.net](https://www.virixcore.net) for more information

Der Hinweis steht auch im Spiel: auf dem Startbildschirm und auf dem Bildschirm hinter dem Beenden-Button (X).

## Unterschiede zur Processing-Version

- Die Menümusik ist ein lizenzfreier Song (siehe Credits) statt des Originals aus der Processing-Version.

- Beim Laden erscheint „CLICK TO START“, weil Browser Ton erst nach einer Nutzeraktion erlauben.
- Der Beenden-Button (X) zeigt einen Abschiedsbildschirm, denn ein Browser-Tab lässt sich nicht vom Spiel schließen.
- Das Spiel läuft unabhängig von der Bildwiederholrate des Monitors mit festen 60 Spiel-Frames pro Sekunde.
- Bomben-Tasten werden als Tastencode gespeichert, dadurch funktionieren auch Sonderzeichen beim Neubelegen.
- Nach einer Runde werden alle Bomben gelöscht (vorher blieb wegen `remove(i)` in der Schleife jede zweite übrig).
