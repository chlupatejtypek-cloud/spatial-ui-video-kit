# V002 — změny proti V001

- Odstraněny všechny rohové značky, footery a názvy nástrojů.
- Odstraněna čísla a názvy scén, popisky mimo panely, marketingové slogany, značka Noda, navigační lišty a breadcrumbs.
- Původní čtyři plné dashboardy nahrazené jednoduchou, kauzálně navazující UI sekvencí.
- Proměnlivé rozměry: projekt 820×650; vybraná položka 728×88 → diagnostická karta 380×240; Optimize 300×190; Verify 180×180 → graf 1270×660 → výsledek 580×350.
- Předchozí obsah skutečně odchází; na konci zůstává jen výsledek.
- Různý rytmus: úvodní klid, přesun vybrané položky, krátké kroky procesu, delší graf a čitelná závěrečná pauza.
- Jediný aktivní signál namísto souběžných čítačů, tooltipů a zvýraznění.
- Graf bez animované výplně, druhé srovnávací křivky, legend, vedlejších statistik nebo vyskakovacího tooltipu.
- Opraveno zaokrouhlování normalized SVG strokeDashoffset: `autoRound:false` na všech odhalovaných linkách a check znacích.
- Odstraněn i nechtěný drobný koncový bod z nulové délky oblé přerušované čáry před začátkem odhalení; kreslenou křivku uzavírá samostatný skutečně pohybující se bod.
- Koncový bod grafu přebírá výsledná značka na identické obrazové pozici; matematicky ověřená návaznost bez skoku.
- Výstup je MP4, nikoliv nový web nebo editor.

## Kontrola
Hyperframes lint/runtime/layout/motion/contrast prošly bez chyb a varování na zadaných vzorcích. Motion assertions: 300 vzorků. Samostatné testy ověřují nulový frame, lokální zdroje, absence brandingu, zpětné seekování, tip/curve alignment, konstantní kresbu grafu, přesný handoff a proměnlivou geometrii panelů.
