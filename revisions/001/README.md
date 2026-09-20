# blackboard. — Motion Lab

**Jeden tečkovaný blackboard. Čtyři UI panely. Jedna nepřerušená 2D cesta.**

První pracovní motion demo projektu. Panely patří fiktivní aplikaci **Noda**; všechna čísla a údaje jsou ukázková. Kamera skutečně cestuje společným prostorem, nejde o přepínání slidů. Kompozice je renderovaná přes **Hyperframes 0.8.54**. Vizuální základ vychází z podkladů **OpenDesign**, přizpůsobených tomuto projektu.

## Co otevřít

| Soubor | Obsah |
|---|---|
| `blackboard-preview.html` | Samostatné interaktivní studio. Funguje offline, fonty i GSAP jsou vložené v souboru. |
| `exports/blackboard-motion-001.mp4` | 24sekundová ukázka, 1920 × 1080, 30 fps, bez zvuku. Dodává se samostatně vedle zdrojového ZIPu. |
| `index.html` | Stejné studio pro lokální server, s odkazy na MP4 a zdrojový ZIP. |
| `composition/index.html` | Skutečná seekovatelná kompozice pro Hyperframes. Není to nahrávka obrazovky studia. |
| `DESIGN.md` | Vizuální pravidla, rozmístění panelů a časování. |

**Ovládání:** mezerník = přehrát/pozastavit; `1–4` = vybraný panel; `0` = celý prostor; šipky = ±1 s; `R` = od začátku; `E` = prozkoumat; `L` = opakovat; `F` = celá obrazovka. V režimu Prozkoumat funguje tah myší, kolečko, tlačítka zoomu a kliknutí do minimapy. Tlačítka uvnitř Noda panelů jsou součástí animovaného mockupu, ne samostatná aplikace.

Studio přehrává beze zvuku automaticky, kromě prohlížečů s nastaveným `prefers-reduced-motion`. Na telefonu je vhodné pro detail video otevřít na šířku. Celou obrazovku může vložený prohlížeč omezit.

## Spuštění a úpravy

Požadavek: **Node.js 22+**, doporučený Node 24. `ffmpeg` a `ffprobe` jsou součástí připnutých npm závislostí; nejsou nutné globálně.

```bash
npm ci
npm run build
npm run dev
```

Studio běží na portu **3000**, na všech rozhraních (`0.0.0.0`). Nevyžaduje API klíč, přihlášení ani externí CDN. Jiný port: `PORT=3001 npm run dev`.

### Hyperframes

```bash
# Jednou stáhne kompatibilní Chrome Headless Shell.
npm run hf -- browser ensure

# Statická kontrola.
npm run hf -- lint composition

# Kompletní kontrola: runtime, rozvržení, pohyb, kontrast.
npm run check

# Render v plném HD přes skutečný Hyperframes renderer.
npm run render

# Volitelně otevře oficiální lokální Hyperframes Studio.
npm run studio:hyperframes
```

Při prvním spuštění Chrome na minimálním Linuxu mohou být nutné systémové knihovny `libnss3`, `libasound2`, `libatk1.0-0`, `libatk-bridge2.0-0`, `libcups2`, `libxcomposite1`, `libxdamage1`, `libxrandr2`, `libxkbcommon0` a `libgbm1`. Přesné názvy balíčků se liší podle distribuce. `npm run hf -- doctor` vypíše stav prostředí.

Wrapper `scripts/hf.mjs` nastavuje cesty k FFmpeg/FFprobe, vypíná telemetrii a používá `.cache/hyperframes-tmp` pro renderové mezisoubory. Tím se vyhne malému paměťovému `/tmp` v sandboxu. Vlastní umístění lze zadat přes `BLACKBOARD_TMPDIR`.

## Kde se co upravuje

```text
src/
  composition.html     všechny panely na společné ploše
  composition.css      vzhled UI a tečkovaného rastru
  composition.js       jediná pauzovaná GSAP timeline pro Hyperframes
  studio.html/css/js   ovládání, časová osa, minimapa, exportní menu
  preview-bridge.js    ovládání náhledu přes postMessage; není součástí videa
  icons.mjs            malé lokální SVG ikony
scripts/
  build.mjs            zabalí kompozici a oba offline HTML náhledy
  hf.mjs               lokální Hyperframes CLI wrapper
  server.mjs           statický server, včetně streamování MP4
  test.mjs             testy ovládání, seekování a offline náhledu
composition/
  index.html           generovaný Hyperframes vstup
  index.motion.json    deklarace ověřovaného pohybu
  assets/gsap.min.js    lokální GSAP; žádná síť při renderu
```

Upravuj `src/`, potom spusť `npm run build` a obnov prohlížeč. Generované soubory se při buildu přepíšou. Při změně délky filmu změň `data-duration` v kompozici, časování v `composition.js`, UI časové údaje v `studio.html/js` a `index.motion.json`.

### Model kamery

Souřadnice panelů jsou v logickém světě 4400 × 2800 px. Oddělený `#camera-zoom` řídí měřítko, `#world` posun v X/Y. Pozadí sleduje stejné souřadnice pomocí CSS proměnných. Celá renderová animace je jedna pauzovaná timeline v `window.__timelines.blackboard`. Vstupy myši a přehrávací hodiny existují pouze v náhledu, nikoliv v renderové kompozici.

## Co bylo staženo z OpenDesign

V pracovním prostoru jsou dva **sparse git checkouty** v `../vendor/`:

- `open-design` — design system Linear App a Hyperframes/motion šablony z oficiálního `nexu-io/open-design`.
- `hyperframes` — oficiální technické a animační skills z `heygen-com/hyperframes`.

Nejde o nainstalovanou desktopovou aplikaci OpenDesign. Její designové podklady a motion postupy byly použité přímo při tvorbě. Hyperframes CLI je skutečně nainstalovaný v závislostech a je použitý ke kontrole i renderu. Přesné verze a zdroje jsou v `docs/SOURCES.md`; vybrané použité podklady také v `docs/references/`, aby byl zdrojový ZIP přenositelný.

## Ověření

- Hyperframes lint, runtime, layout, motion a contrast: bez chyb a bez varování na ověřovaných vzorcích.
- 300 vzorků ověření deklarovaného pohybu.
- 305 automatických kontrol kontrastu na vzorcích: prošly.
- Automatické testy ovládání, přepínání režimů, zpětného seekování, mobilního rozvržení a offline načtení.
- Reporty: `docs/hyperframes-check.json`, `docs/qa/results.json`.

Testy s běžícím serverem: `npm test`. Žádný cloud upload, veřejné publikování ani analytika. Licence třetích stran jsou v `docs/licenses/`.

## Další iterace

1. Zvolit konkrétní produkt a skutečný obsah UI místo Noda mockupu.
2. Doladit trasu, pauzy, rychlost přeletů a poměr celku k detailu.
3. Přidat kurzor, přechody stavů jednotlivých komponent nebo sound design podle zvolené nálady.
