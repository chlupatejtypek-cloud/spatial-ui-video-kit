# Stažené nástroje a použité podklady

Staženo 20. 9. 2026. Zdroje jsou připnuté pro reprodukovatelnost, ne tvrzení o tom, že se budou automaticky aktualizovat.

## OpenDesign

- Oficiální repozitář: https://github.com/nexu-io/open-design
- Ověření oficiálního zdroje: https://open-design.ai/official/
- Commit sparse checkoutu: `7413c6daa10e9c038752ddd4910fc0c684eca38e`
- Verze v načteném package.json: `0.22.1`
- Stažené složky: `design-systems/linear-app`, `design-templates/hyperframes`, `design-templates/motion-frames` plus soubory v kořeni.
- Použito: systém luminanční hierarchie, lokální fonty, rozložení před animací, diferenciace easingů, zřetelné fáze build/breathe/resolve, přizpůsobení video frame namísto běžné webové stránky.
- Vlastní změny: značka Blackboard / Noda, olivově-grafitové neutrály, limetkový akcent, geometrie společné plochy a vlastní UI panely.
- Licence: Apache-2.0, kopie v `licenses/OpenDesign-LICENSE`.

## Hyperframes

- Oficiální repozitář: https://github.com/heygen-com/hyperframes
- Dokumentace: https://hyperframes.heygen.com/
- Commit sparse checkoutu skills: `c204b3c7579af6eff2226db64aac71292a58950d`
- Instalovaný CLI balíček: `hyperframes@0.8.54` (npm lockfile).
- Stažené skills: složka `skills/` oficiálního projektu.
- Použito: data atributy kompozice, registry timeline, GSAP seek-safe animace, validace a deklarace motion intent; Chrome/FFmpeg render do MP4.
- Náhledové studio v tomto projektu je vlastní frontend, nikoliv přejmenovaná oficiální aplikace Hyperframes nebo OpenDesign.
- Licence: Apache-2.0, kopie v `licenses/Hyperframes-LICENSE`.

## Další lokální závislosti

- GSAP `3.14.2`: seekovatelná animace, odkaz na vlastní licenci a původní copyright v `licenses/GSAP-LICENSE-NOTICE.md`.
- Inter Variable, Fontsource `5.3.0`: hlavní písmo; SIL Open Font License.
- IBM Plex Mono, Fontsource `5.3.0`: popisky a technická metadata; SIL Open Font License.
- FFmpeg static `5.3.0`, FFprobe static `3.1.0`: lokální nástroje pro video pipeline.
- Všechny značky aplikace Noda, texty a ukázkové údaje jsou pracovní obsah vytvořený pro tuto demonstraci. Noda zde neoznačuje skutečný produkt.

Žádné externí obrázky, trackovací skripty, CDN požadavky za běhu ani placené API služby nebyly použity.
