# Prisma — Traspàs complet per a la següent IA

Actualitzat: 13 de novembre de 2026 (secció 0: versió 1.2). Document de continuïtat del projecte local, redactat a partir del codi, dels informes de prova i de la conversa amb l’usuari. Substitueix íntegrament l’antic HANDOFF.md. Aquest és el fitxer de traspàs canònic; no crear còpies divergents amb noms com Handsoff.md o Handoff.md.

## 0e. Traducció i GitHub (13/11/2026) — llegir primer

- **Interfície en català, castellà i anglès** amb `dist/i18n.js`. El text català és la clau: `t('text català', {vars})`. `translatePage(document)` tradueix els nodes de text i els atributs `aria-label`/`title` de la plantilla, sense tocar `<code>`. L'idioma surt de `?lang=`, de `localStorage['prisma-lang']` o del navegador; canviar-lo recarrega la pàgina amb `?lang=`. A Node (proves) l'idioma és sempre català.
- **En afegir o canviar textos:** cal afegir la fila `[ca, es, en]` a `TEXTS`. La prova «Every Catalan string…» falla si un text de la plantilla, un `t('…')` o un nom d'univers no té traducció. Els textos amb la versió («1.5») s'han d'actualitzar a la plantilla i a `i18n.js` alhora.
- **README** en tres fitxers: `README.md` (català), `README.es.md` i `README.en.md`.
- **Repositori públic a GitHub** (compte de l'usuari). No es pugen `.copies/` ni `.openai/`. En aquest document s'han substituït les rutes personals per rutes genèriques.

## 0d. Actualització 1.5 (13/11/2026)

L’usuari: l’Harmonògraf sobre paper no li agrada (vol fons fosc, traços més reactius i zoom cap a dins). El Gira-sol de la 1.4 era massa ràpid («una bogeria»), però vol que hi hagi moviment.
- **Harmonògraf:** composició 5 (traç de llum amb zoom). La memòria es llegeix a `(uv-.5)*(1-zoom)+.5` amb un gir petit, el traç és additiu i el fons és fosc. El mode paper i l’alfa 0 ja no s’usen (la uniforme `paper` queda a 0). L’inici del tros de cada fotograma es corregeix amb `grow` perquè el traç no es trenqui.
- **Gira-sol:** creixement de 4+7·greus+8·cop llavors/s (abans 14+50+60), gir de .025+.05·mitjos+.18·cop, desviació de l’angle d’or de ±0,0009 amb τ = 8 s, i les llavors noves creixen des de zero (smoothstep a 5 d’edat).
- **Verificat:** test 26/26, check, EGL (la tinta de l’Harmonògraf ara es compta com a píxels clars) i browser-check.

## 0c. Actualització 1.4 (13/11/2026)

L’usuari va valorar la 1.3: els fractals han millorat molt, però cal que la música s’hi vegi durant el zoom. El Gira-sol és poc mòbil, el Garbell no el convenç, l’Harmonògraf es mou poc amb el so, i el Paisatge i el Chladni necessiten més definició. Canvis:
- **Shader:** `fractalMusic` (corbes de nivell equalitzadores amb `fwidth` i onada de cop), un Gira-sol nou (`spin.x` de gir, `spin.y` de desviació de l’angle d’or, mida per l’espectre), `quasicrystal` en lloc de `sieve` (índex 9), l’Harmonògraf amb `reach` i gargot de la forma d’ona, Paisatge de 56 línies amb antialiàs i Chladni de 12 capes amb línia nítida i `ihash`.
- **JS (`VisualEngine.listen`):** historial de 512×128 a 24 files per segon amb interpolació als greus, `bandAmp`/`bandPhase`[8], `spin`, i empentes per cop (`kick`) al zoom, al creixement, al gir i a la ploma.
- **Verificat:** `npm test` 26/26, check, EGL i browser-check, i captures a Chrome a 60 FPS. **Pendent:** la valoració de l’usuari.

## 0b. Actualització 1.3 (13/11/2026)

Petició de l’usuari: zoom infinit autosimilar als fractals; refer Fibonacci, Primers i Lissajous perquè siguin del tot diferents; eliminar Vida de Conway (lenta); refer Chladni (era massa fix, sense sensació d’entrar-hi); arreglar les miniatures a partir de Julia (eren degradats CSS només per als 6 primers).
- Ara hi ha 13 modes (índexs 6–12 nous o refets). Vegeu README «Universos (13)», on hi ha les matemàtiques del zoom: Julia exacte via la funció de Poincaré del 2-cicle; Mandelbrot cap al minibrot p3 amb fosa.
- Shader: `composite(mode)` 0 clàssic (0–5), 2 directe, 4 paper (10). L’Harmonògraf escriu alfa 0; alfa > 0,01 vol dir que venim d’un altre mode i cal un full nou. Uniformes noves: `motion` (rellotges integrats a JS: Julia, Mandelbrot, garbell, vol), `growth`, `pen` (t, t anterior, figura) i, a la presentació, `paper` (sense to de llum).
- `VisualEngine` accepta `{size:[w,h]}`, i té `clear()` i `release()`. `app.js:renderThumbnails` les fa servir per a les miniatures.
- Proves: `shader-check.py` llegeix el nombre de modes de `analysis.js`. L’Harmonògraf té una prova pròpia: la tinta s’acumula i el greu en posa més. El llindar d’impacte dels fractals és 0,005, perquè hi reaccionen sobretot amb la velocitat del zoom (a JS), no amb la imatge d’un sol fotograma. Verificat: `npm test` 26/26, `npm run check`, EGL, `browser-check.mjs`, captures a Chrome (60 FPS) i Firefox. **Pendent:** la valoració de l’usuari i comprovar el rendiment del Mandelbrot (fins a 230 iteracions, el doble durant la fosa) en un equip lent.
- L’usuari ja ha instal·lat `So-del-sistema.sh` (servei actiu, entrada «Prisma · so del sistema» funcionant).

## 0. Actualització 1.2 (13/11/2026, matí)

**So del sistema resolt i provat amb música real.** Diagnòstic al portàtil (Linux, PipeWire 1.6, Chrome 157 i Firefox 160 en flatpak): Chrome no llista els monitors de sortida a `enumerateDevices` (només el micròfon intern); Firefox sí («Monitor of …»). `getDisplayMedia` no dona àudio del sistema a Linux en cap dels dos.
- Nou botó **♫ So del sistema** (`AudioEngine.live('system')` → `openSystem`). Busca l’entrada amb `pickSystemInput`: «Prisma…» > «Monitor of/de» (excepte Virtual) > monitor/Stereo Mix/BlackHole. Sense permís previ, obre l’entrada predeterminada per obtenir etiquetes i després la correcta; sense cancel·lació d’eco ni AGC. Si no n’hi ha cap, error `SystemAudioMissing` amb instruccions.
- Nou `So-del-sistema.sh [activa|desactiva|estat]`: servei d’usuari systemd amb `pw-loopback` (`stream.capture.sink=true`, sortida `media.class=Audio/Source`, node `prisma_so_sistema`, «Prisma · so del sistema»). Segueix la sortida predeterminada. La unitat passa `systemd-analyze verify`. **No està instal·lada:** l’entorn de l’agent no va permetre crear el servei; l’ha d’executar l’usuari. Les proves es van fer amb el mateix `pw-loopback` temporal (ja aturat).
- Proves reals de punta a punta (Prisma.html via file://, permís automàtic de prova): Chrome + entrada virtual → mode system, inputRms≈0,02–0,07, bandes actives; Firefox + entrada virtual i Firefox només amb el monitor → funciona; Chrome sense entrada virtual → missatge del guió. El selector real de permisos no s’ha provat a mà.

**Modes 11–13 substituïts** (Vòrtex/Mirall/Corrents → Paisatge espectral, Vida de Conway, Figures de Chladni). Veure README «Modes amb llenguatge propi». Arquitectura: `composite(mode)` (0 clàssic, 1 fractal, 2 directe, 3 autòmat) i `render(mode)` substitueixen `mode>=11`; noves uniformes `history` (R8 256×64, espectre log), `historyHead`, `tone` (centroide suavitzat 1,4 s), `lifeStep`, `seed`; lògica JS a `VisualEngine.listen`. La vinyeta passa a la presentació; els rastres resten 1/255 per arribar a negre (afecta lleugerament els modes clàssics). Corregit també un desbordament horitzontal a escriptori (checkbox `#normalise` absolut sense mida).

Verificat: `npm test` 26/26, `npm run check`, `tools/shader-check.py` (inclou prova de llavor/generacions de l’autòmat), `tools/browser-check.mjs`. **Pendent:** que l’usuari valori si els tres modes nous són prou diferents; revisar també 0, 4 i 5 amb el mateix criteri; mòbil físic. Còpia prèvia: `.copies/so-sistema-i-modes-20261113-092911`.

Les seccions següents descriuen l’estat anterior a la 1.2; on contradiguin la secció 0, mana la secció 0.

## 1. Situació actual i prioritat de producte

Prisma és un visualitzador musical local en català, implementat amb Web Audio i WebGL 2. S’obre amb doble clic sobre `Prisma.html`, sense servidor ni port. Actualment ofereix 14 modes visuals, música local, demo sintètica, micròfon/entrada d’àudio i captura de pestanya quan el navegador la suporta.

**La següent prioritat no és augmentar el nombre de modes: és aconseguir visualitzacions realment diferents i una resposta musical expressiva.** L’usuari considera que les darreres incorporacions són bastant similars i no semblen del tot noves o diferents. Cal assumir aquesta observació com un problema de qualitat obert. No presentar els catorze noms com a prova de catorze experiències diferenciades. Les proves gràfiques existents no mesuren aquesta diferenciació perceptiva.

El projecte ha passat de sis patrons amb força moviment compartit a modes matemàtics i, després, a tres experiments de retroalimentació inspirats en l’estudi local de MilkDrop. Aquesta evolució tècnica és real, però encara no resol satisfactòriament la diversitat visual.

## 2. Context, requisits i preferències de l’usuari

- Carpeta real actual: la carpeta local del projecte (`Projectes/Prisma`). Referències antigues a altres rutes o a `/tmp/prisma-v2` són context històric, no l’estat de treball actual.
- És un projecte independent del simulador nàutic. No modificar altres projectes ni el Site d’una primera versió.
- Conservar el funcionament amb HTML autònom, sense necessitat de servidor, instal·lació o connexió per a visuals, fitxers i demo.
- El so ha de fer evolucionar formes i ritmes; no limitar la resposta a brillantor ni mantenir tot al màxim pels greus.
- L’usuari vol poder escoltar el so que està sonant al portàtil. L’HTML actual no pot capturar automàticament tota la sortida estàndard en qualsevol navegador.
- No aplicar gir, zoom, desplaçament o deformació globals a totes les visualitzacions. En particular, l’usuari demana una forma exterior estable als fractals i canvis del mateix fractal.
- Interès explícit per matemàtiques: fractals, Fibonacci, nombres primers i altres construccions.
- MilkDrop 3 està instal·lat al portàtil i l’usuari ha autoritzat estudiar-lo per orientar Prisma.
- Última valoració explícita: els darrers modes no es diferencien prou. Cal revisar-los abans d’afegir-ne més del mateix estil.

## 3. Arquitectura i fonts que s’han d’editar

| Fitxer | Funció |
| --- | --- |
| `src/index.template.html` | Plantilla de la interfície i ajuda, en català. |
| `dist/analysis.js` | `bandEnergy`, `Pulse`, `ReactiveEnvelope` i catàleg `PRESETS`. |
| `dist/audio.js` | `AudioEngine`: fonts, permisos, graf Web Audio, neteja i mostreig FFT/ona. |
| `dist/visual.js` | `VisualEngine` i shaders GLSL ES 3.00: patrons, transport de memòria i presentació. |
| `dist/app.js` | Controls, preferències, transport, selecció de modes, animació i diagnòstic. |
| `dist/style.css` | Estils de la interfície. |
| `tools/build.mjs` | Insereix CSS/JS/icona al fitxer autònom. |
| `Prisma.html` | Artefacte principal generat que obre l’usuari. |
| `dist/index.html` | Còpia autònoma generada, equivalent a Prisma.html. |
| `tools/open.mjs`, `Obre-Prisma.sh` | Obren l’HTML; no arrenquen servidor. |
| `tests/` | Proves Node d’anàlisi, fonts, integritat i arrencada simulada de l’HTML. |
| `tools/browser-check.mjs` | Prova Chrome via CDP, captures i informe. |
| `tools/shader-check.py` | Compilació/renderitzat EGL/OpenGL ES dels shaders reals. |
| `docs/milkdrop-study.md` | Estudi local de MilkDrop i delimitació del que s’ha analitzat. |

Tot i el nom `dist`, els seus mòduls JS/CSS són fonts editables d’aquest projecte. No editar només Prisma.html: el canvi es perdria amb el build. Després de modificar fonts, executar `npm run build` i validar l’HTML resultant. No hi ha imports, fetch, manifest ni service worker necessaris en runtime. Versió declarada encara 1.1.0; no interpretar-la com un recompte de totes les revisions posteriors.

Preferències a `localStorage`, clau `prisma-settings-v1`; la persistència en file:// pot variar entre navegadors i rutes. No es desen àudio ni noms dels fitxers. La interfície incorpora pantalla completa, controls amagables, pausa visual, captura PNG, llista de música, sis modes originals i vuit incorporacions. El viatge automàtic recorre tots els presets; la transició visual és de quatre segons.

## 4. Historial funcional i problemes tractats

### 4.1 Base autònoma i primera resposta musical

Abans d’aquesta continuació ja s’havia convertit Prisma en un HTML autònom, retirant el servidor, el manifest i el service worker de l’ús normal. També s’havien afegit atac ràpid d’uns 12 ms, FFT amb suavitzat baix, normalització, porta de silenci, sensibilitat, impacte i decaïment. Existien sis modes. Aquesta és la base rebuda, no un treball pendent d’aplicar.

L’antic HANDOFF deia que els canvis només eren en una còpia temporal i que no es podia arrencar Chrome per setsockopt. Aquestes afirmacions van quedar obsoletes: les revisions d’aquesta conversa s’han desat a la carpeta real amb autorització d’escriptura, i Chrome s’ha executat després amb permisos adequats.

### 4.2 Captura de pestanya: ordre d’activació de Web Audio

Problema inicial: l’usuari no aconseguia que el so d’una pestanya fos la font de Prisma.

El codi ja demanava `getDisplayMedia` abans d’un await per preservar el clic, però esperava el retorn del selector abans d’inicialitzar/reprendre l’AudioContext. Es va identificar aquest ordre com una causa possible de motor suspès després d’esperar permisos. No s’ha demostrat que fos l’única causa del problema original.

Correcció aplicada a `AudioEngine.live`:

1. Demanar captura dins del clic, sense esperes anteriors.
2. Iniciar també `init()`/`resume()` abans d’esperar el selector.
3. Gestionar immediatament el rebuig de la promesa d’inicialització per evitar unhandled rejection mentre el selector continua obert.
4. Comprovar el token de generació per impedir que un permís tardà reactivi una font que ja s’ha cancel·lat.
5. Verificar pistes d’àudio presents i actives. Si només arriba vídeo, explicar-ho i alliberar la captura.
6. Silenciar el monitoratge abans de connectar la font al graf. L’entrada continua analitzant-se però no es duplica pels altaveus.
7. Netejar pistes i estat si falla la inicialització o la connexió parcial del graf.

Es van afegir proves d’activació immediata, fallada d’inicialització amb permís posterior i fallada de connexió del graf. Ja hi havia cobertura de permisos denegats, permisos tardans i fonts sense àudio. La UI també incorpora un missatge per a InvalidStateError.

**Confirmació de l’usuari:** posteriorment va indicar que amb Chrome sí que funciona, i amb Firefox no. Aquesta és una comprovació manual seva, separada de les proves automatitzades.

### 4.3 Firefox i sortida d’àudio del sistema

Es va consultar documentació de compatibilitat i el bug de Mozilla: Firefox no implementava la captura d’àudio amb `getDisplayMedia` en el moment de la consulta. Pot compartir vídeo sense donar pista de so. No és un error del shader ni una falta de permís resoluble amb un pedaç de JavaScript.

Referències consultades:

- https://bugzilla.mozilla.org/show_bug.cgi?id=1541425
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
- https://wiki.freedesktop.org/www/Software/PulseAudio/FAQ/

Si es torna a treballar la compatibilitat, comprovar l’estat actual de Mozilla. No donar per implementada una funcionalitat perquè existeixi getDisplayMedia. No desactivar seguretat del navegador.

L’usuari va proposar captar directament la sortida estàndard. Es va explicar la limitació web i es va afegir `Entrada d’àudio`:

- `AudioEngine.live(kind, deviceId)` pot demanar un dispositiu concret amb deviceId exact per a micròfon/entrada.
- Després de concedir permís al micròfon, `refreshInputs()` enumera audioinput i mostra les etiquetes accessibles.
- Canviar l’entrada amb el mode mic actiu reconnecta la font.
- S’escolta devicechange; si no hi ha una font seleccionada, s’usa la predeterminada.
- A Linux, es pot encaminar manualment l’entrada de Firefox al monitor de la sortida amb el mesclador del sistema, per exemple pavucontrol. També es pot seleccionar un monitor si el navegador l’exposa com a entrada.

**Límit important:** no s’ha implementat captura nativa automàtica del sistema, ni creat un dispositiu virtual, ni configurat PipeWire/PulseAudio, ni provat físicament aquest encaminament amb Firefox. El selector no converteix un dispositiu de sortida en una entrada. La disponibilitat depèn del sistema i del navegador.

### 4.4 Greus sostinguts que tapaven el ritme

Problema de l’usuari: amb molt nivell de greus, el visual quedava saturat i es perdia el ritme.

Canvis a ReactiveEnvelope i UI:

- Guany independent per a greus, mitjos i aguts, de 0 a 2; inicialment 1.
- `rhythm`, mostrat com «Destaca els atacs», de 0 a 1; inicialment 0,7.
- Estimació del nivell sostingut de cada banda amb constant temporal de 0,5 s.
- Mescla entre nivell continu i excés sobre el sostingut, amb realç dels transitoris.
- Detecció de pols a partir de la pujada màxima entre bandes consecutives. Els atacs de mitjos/aguts també poden generar pols damunt de greus constants.
- Els guanys afecten el visual i la detecció, no l’àudio reproduït. Un guany zero anul·la l’aportació d’aquella banda.
- Preferències persistides i Restableix actualitzats.

Proves afegides: un baix sostingut s’assenta sense pols permanent, un atac de mitjos encara produeix pols i una banda silenciada no genera resposta.

Valors inicials actuals: sensibilitat 1,8; greus/mitjos/aguts 1; atacs 70%; impacte 1,4; decaïment 180 ms; normalització activa; persistència 72%; velocitat 1; color 0; qualitat automàtica.

**Precisió per a la següent IA:** això és tractament de bandes d’anàlisi, no un equalitzador del so. El detector actual usa pujades entre bandes, no el flux espectral que descriuen alguns textos antics. El paràmetre spectrum i camps previous de ReactiveEnvelope van quedar sense ús efectiu després d’aquest canvi; revisar abans de continuar afegint algoritmes.

### 4.5 Incorporació de matemàtiques: de 6 a 11 modes

Es van afegir cinc modes escrits en GLSL, sense recursos externs:

- Julia i Mandelbrot: iteració complexa z²+c, límit de 64 iteracions i coloració/trampes orbitals.
- Fibonacci: fil·lotaxi amb angle d’or aproximat 2,399963 rad i radi proporcional a √n. Relacionat amb Fibonacci, però no dibuixa literalment els termes de la sèrie.
- Primers: espiral quadrada d’Ulam amb regió de 31×31 enters i test de primalitat al shader.
- Lissajous: sinusoides amb relacions 3:2, 5:4 i 7:6; aproximació discreta de distància a corbes.

Es van ampliar catàleg, comptadors, viatge automàtic, proves i scripts de renderitzat/navegador. El denominador del comptador de l’app és dinàmic; algunes xifres de plantilla i proves encara són literals.

### 4.6 Correcció dels fractals que es movien sencers

L’usuari va demanar que la forma exterior principal dels fractals romangués fixa.

Es van excloure Julia i Mandelbrot de la rotació, escala i distorsió globals. Es va fixar el paràmetre de Julia a (-0,745; 0,186); Mandelbrot conserva el seu pla de paràmetres estable. Es van traslladar els canvis musicals i temporals a la trampa orbital, al color i al detall. La textura anterior tampoc es transporta en aquests modes.

Estat actual: `fixedFrame(mode)` correspon a 6 i 7, i `feedbackUV` retorna coordenades inalterades per a aquests dos casos. No reintroduir el moviment global per fer passar una prova de reactivitat. Tampoc prometre que la geometria del conjunt evoluciona: els paràmetres que defineixen la seva silueta són constants; evoluciona sobretot la representació orbital i cromàtica.

La primera prova espacial exigia el mateix llindar als fractals que als modes mòbils i va fallar. Es va adaptar a 0,02 per a modes 6/7, mantenint 0,08 per a la resta. És un criteri de canvi del patró de color, no una prova que el contorn sigui fix. Encara manca una comprovació automatitzada específica de l’estabilitat del contorn.

### 4.7 Estudi local de MilkDrop i pas de 11 a 14 modes

Instal·lació trobada: `~/Baixades/MilkDrop 3.28` (instal·lació local). Es va llegir la guia `Milkdrop3/docs/milkdrop_preset_authoring.html`, la llicència i una mostra de presets de Geiss, Flexi i MilkDrop2077. Es van comptar 314 .milk i 203 .milk2 a la instal·lació. També existeix material a Baixades/Presets_Milkdrop; no confondre’n el recompte amb el de la instal·lació.

En els 314 .milk: 300 amb expressions per fotograma, 186 per píxel/vèrtex, 299 amb warp shader, 313 amb composició, 256 amb definicions de formes i 209 amb ones. Són presències textuals, no cobertura d’execució. La guia explica lectures ràpides i suavitzades bass_att/mid_att/treb_att, transport del fotograma anterior, decay, ecos i composició.

No s’ha executat ni descompilat MilkDrop, ni fet una comparació simultània. No s’han importat els presets, textures o shaders HLSL a Prisma. No hi ha intèrpret .milk/.milk2. La llicència local inclou condicions pròpies d’ús de MilkDrop 3; revisar-la si es planteja reutilitzar material, en lloc de suposar que tot el contingut té una mateixa llicència.

Implementació original afegida a Prisma:

- `feedbackUV(mode, uv)` amb transport específic segons mode i mescla durant transicions.
- Vòrtex: dos centres de circulació contrària i injecció d’ona/anells.
- Mirall: rosassa de dotze sectors, ecos radials i enquadrament del patró centrat.
- Corrents: camp sinusoidal de transport, espurnes i forma d’ona.
- Per als modes 11–13, suma de llum limitada a 2,2, desaparició regulada per Persistència i halo local de quatre mostres. La resta conserva la composició clàssica per màxim.
- Mirall no rep la transformació global del patró, però sí té transport dels ecos. No equiparar-lo al cas fix dels fractals.

Durant la inspecció de captures, Mirall acumulava massa llum al centre i es perdia el detall. Es va reduir la intensitat/amplada, limitar l’emissió a una zona anular i reforçar la resposta interna als mitjos/greus. Una primera correcció va deixar una resposta espacial massa feble; es va ajustar i la prova final va passar amb el llindar general de 0,08.

**Avaluació pendent de l’usuari:** aquests tres modes continuen sent massa semblants entre ells o a visuals previs. Els canvis tècnics no tanquen aquesta incidència.

## 5. Catàleg exacte i índexs del shader

| Índex (base 0) | Nom | Construcció principal |
| --- | --- | --- |
| 0 | Aurora líquida | Cintes sinusoidals. |
| 1 | Òrbites infinites | Anells i simetries radials. |
| 2 | Matèria viva | Plasma amb deformació iterada de coordenades. |
| 3 | Travessa | Túnel radial/invers del radi. |
| 4 | Pols estel·lar | Partícules procedimentals en capes. |
| 5 | Ressonància | Traç de la forma d’ona. |
| 6 | Jardí de Julia | Conjunt complex amb marc fix. |
| 7 | Mandelbrot | Pla complex amb marc fix. |
| 8 | Llavors de Fibonacci | Fil·lotaxi de l’angle d’or. |
| 9 | Constel·lació de primers | Primers en espiral d’Ulam. |
| 10 | Lissajous harmònic | Corbes sinusoidals amb relacions enteres. |
| 11 | Paisatge espectral | Línies d’espectre en perspectiva (1.2). |
| 12 | Vida de Conway | Autòmat B3/S23, estat a l’alfa (1.2). |
| 13 | Figures de Chladni | Sorra a les línies nodals; el to tria la figura (1.2). |

No canviar l’ordre sense actualitzar les branques del shader i les regles per índex. `mode>=11` actualment activa la composició de flux; afegir qualsevol mode al final heretaria aquest comportament encara que no fos apropiat. És un deute de disseny a resoldre abans de seguir ampliant el catàleg.

## 6. Problemes oberts i deute tècnic

### Diferenciació visual insuficient — principal incidència

Molts modes comparteixen paleta cosinus, brillantor de neó, línies exponencials, resposta global semblant i memòria comuna. Vòrtex/Corrents reutilitzen ones o espurnes, elements que ja existien. Canviar el camp de transport no garanteix una composició recognoscible com a nova. És una explicació tècnica plausible de l’observació de l’usuari, no una mesura perceptiva concloent.

Cal dissenyar una identitat per mode: subjecte principal, distribució espacial, escala, material/color, comportament en silenci, resposta a cop curt i resposta a so sostingut. Reservar el moviment global per als modes que realment el necessiten. No intentar resoldre-ho només afegint més paràmetres sinusoidals, velocitat o brillantor.

### Àudio i compatibilitat

- Pendent provar el monitor de sistema amb Firefox i dispositius reals. El selector no és un sistema automàtic de loopback.
- Missatge d’error de captura sense pista encara genèric: pot recomanar pestanya Chrome/Edge fins i tot en Firefox. L’ajuda sí explica la limitació. Millorar diagnòstic sense bloquejos rígids basats només en user-agent.
- Revisar l’energia FFT: `bandEnergy` fa RMS de valors byte de l’analitzador, que representen una escala de decibels. No són amplituds físiques lineals. No declarar corregit aquest punt: encara no s’ha canviat.
- El detector actual pot continuar sent sensible a gèneres, nivells, freqüència de fotogrames i guanys. Falta una bateria amb música i transitoris reals. No assumir que el problema de greus queda resolt per a tot el material perquè passen les proves sintètiques.
- La banda de greus té pocs bins amb FFT 2048 a 48 kHz; estudiar precisió/latència abans de canviar FFT o freqüències de tall.

### Motor gràfic i rendiment

- Shader únic amb molts modes i decisions per índex; falta configuració explícita per preset.
- Els dos modes d’una transició comparteixen una memòria d’imatge. Pot contaminar temporalment un patró amb rastres del precedent; no s’han implementat dos motors de feedback independents.
- Julia/Mandelbrot fan fins a 64 iteracions; Lissajous, tres capes de 96 punts per fragment; els primers fan divisions al shader. Mesurar rendiment al portàtil real i a qualitat Lleugera. «Automàtica» limita resolució, no és una regulació completa basada en FPS.
- La retenció depèn de dt; la injecció dels nous modes s’afegeix per fotograma. Revisar-ne consistència entre 30/60/120 FPS i estabilitat de llum durant minuts.
- L’halo és una difusió local de quatre mostres, no una piràmide de blur com la de motors més complets.
- Pausar el visual i canviar de mode, perdre/restaurar WebGL o tornar d’una pestanya oculta mereix verificació en les revisions del motor.

### Documentació i proves

- README conserva textos antics que parlen de flux espectral i de Chrome bloquejat per l’aïllament. Aquest HANDOFF corregeix l’estat; sincronitzar README en una tasca posterior. No s’ha modificat l’aplicació ni la resta de documentació en aquesta reescriptura del traspàs.
- Proves i plantilla contenen literals 14. Millorar la coherència amb el catàleg abans de tornar a ampliar-lo.
- El diagnòstic `window.__prisma` expose mode, bandes, preset i frames, però no substitueix una prova visual qualitativa.

## 7. Verificació executada i límits de l’evidència

### Node i sintaxi

S’han executat satisfactòriament `npm test` i `npm run check` durant les revisions d’àudio i visuals. Cobertura: atacs, sensibilitat, normalització, silenci, decaïment, bandes, permisos i neteja, HTML autònom i arrencada amb DOM simulat. El runner informa quatre fitxers de prova; no confondre aquesta xifra amb el nombre total de casos interns.

Els últims ajustos finals de constants de Mirall es van reconstruir i validar amb EGL; la passada Node/sintaxi immediatament anterior corresponia a la revisió prèvia d’aquest mateix ajust gràfic. No s’han tornat a executar proves de l’app només per reescriure aquest document.

### EGL/OpenGL ES

`python3 tools/shader-check.py` compila els shaders reals, renderitza 14 patrons durant 12 fotogrames cadascun, comprova imatges no buides i compara distribucions de luminància amb impacte 0 i 1,4. Genera `docs/preset-1.png` a `preset-14.png` i `docs/shader-check.json`.

Últim informe gràfic consultat: 14 patrons, compilació correcta, distàncies normalitzades aproximades Julia 0,0664, Mandelbrot 0,0445 i Mirall 0,5093. Llindars: 0,02 per fractals, 0,08 per la resta. Les sumes RGB diferents no demostren estils diferents. La comparació és de resposta al mateix temps/àudio, no una comparació perceptiva entre modes. Tampoc és una prova de rendiment prolongat ni d’estabilitat del contorn.

### Chrome

`node tools/browser-check.mjs` ha funcionat amb Chrome 157.0.8103.50 obrint l’HTML via file://, sense override d’autoplay. L’informe existent registra selecció dels índexs 0–13, WebGL, demo, fitxer WAV sintètic, pausa, ajuda, absència de desbordament al viewport mòbil, cap error JS recollit, anàlisi d’una pista real generada amb Web Audio i alliberament de pistes.

La prova de captura substitueix getDisplayMedia per una promesa que retorna una pista sintètica: valida el graf i la UI, **no el selector real ni els seus permisos**. No s’han provat micròfons físics ni un dispositiu mòbil físic. El viewport mòbil és emulat.

**Precisió de revisió:** l’últim informe Chrome es va generar amb els 14 modes abans dels últims petits ajustos de la rosassa. Aquests ajustos sí es van provar amb EGL, build i inspecció de codi, però no es va repetir Chrome després del darrer canvi de constants. No presentar l’informe com a validació exacta d’aquells últims bytes.

`docs/desktop.png` i `docs/mobile.png` són captures de Chrome; `docs/preset-N.png` són renders EGL. L’antic HANDOFF que deia que totes les imatges eren EGL era incorrecte per a l’estat actual.

### Proves manuals i pendents

L’usuari va confirmar la captura d’una pestanya en Chrome. Va observar que no funcionava en Firefox. Va demanar corregir els greus i després els fractals, i ara destaca similitud excessiva en els últims modes. No convertir aquestes observacions en una aprovació global del resultat actual.

Pendents: música real de diversos estils, encaminament de sortida/monitor, permisos reals en altres navegadors, rendiment sostingut, equip mòbil físic i revisió qualitativa de diferenciació amb l’usuari.

## 8. Com continuar: ordre recomanat

1. Obrir l’HTML actual i observar els modes 0–13 amb la mateixa peça musical, atacs, silencis i sons sostinguts. Desactivar viatge automàtic per comparar. Llegir els informes amb les limitacions de revisió anteriors.
2. Fer una matriu de similitud: composició, tipus de forma, moviment, color/material, memòria i relació amb cada banda. Identificar què és variant del mateix llenguatge i què té identitat pròpia. Prioritzar la revisió de 11–13 i la seva semblança amb 0, 4 i 5.
3. Redissenyar un mode de manera profunda abans d’afegir nous noms. Possibles direccions, encara no implementades ni aprovades com a pla tancat: geometria de superfícies/volums, xarxes o autòmats, patrons de reacció-difusió, representació espectral arquitectònica, traços minimalistes amb espai negatiu. Cal triar famílies que canviïn el llenguatge visual, no només les equacions locals.
4. Separar en configuració per mode l’enquadrament, transport, simetria, composició, paleta i resposta musical. Evitar herències accidentals com mode>=11. Conservar explicitament el marc fix de Julia/Mandelbrot.
5. Fer una comparació visual abans/després amb captures i seqüències curtes del mateix àudio. Mostrar un resultat concret a l’usuari perquè valori si és realment nou. No demanar que aprovi una descripció abstracta com si fos un resultat visual.
6. Verificar àudio i rendiment després dels canvis necessaris; evitar que la complexitat de GPU tapi els atacs. Ajustar proves perquè detectin regressions reals, sense rebaixar llindars per amagar una resposta insuficient.
7. Actualitzar README i aquest HANDOFF amb els resultats efectius, mantenint les distincions entre prova sintètica, prova al navegador i comprovació de l’usuari.

Criteri d’acceptació visual proposat: un mode s’ha de reconèixer per la composició i el comportament encara que comparteixi àudio i colors amb un altre. Un canvi de nom, de fase, de color o de velocitat no és suficient. El mode ha de tenir comportament deliberat amb silenci, cop curt, baix sostingut i activitat d’aguts; no tot ha de tremolar o créixer alhora.

## 9. Comandes de treball

Després de canviar fonts:

```bash
npm run build
npm test
npm run check
```

Per verificar gràfics i navegador quan pertoqui:

```bash
python3 tools/shader-check.py
node tools/browser-check.mjs
```

El renderitzador EGL necessita libEGL, libGLESv2 i ImageMagick (`magick`). La prova de navegador utilitza per defecte `/var/lib/flatpak/app/com.google.Chrome/current/active/files/extra/chrome`; es pot substituir amb `PRISMA_CHROME`. Escriu captures/informes a docs i fitxers temporals/perfil a /tmp. La prova headless inclou opcions pròpies d’execució de proves; no traslladar-les al launcher de l’usuari. No confondre-les amb permisos de captura concedits per una persona.

## 10. Còpies, permisos i precaucions de continuïtat

S’han creat còpies prèvies a `.copies/`:

- `prisma-abans-1.1-20261112-215740-289454.zip` — còpia anterior rebuda.
- `tab-audio-20261112-221719` — abans de la correcció d’activació d’àudio.
- `rhythm-20261112-230010` — abans de bandes/atacs i selector d’entrada.
- `math-20261112-234657` — abans dels cinc modes matemàtics.
- `fixed-fractals-20261113-001419` — abans d’estabilitzar els fractals.
- `feedback-20261113-004321` — abans dels tres modes inspirats en tècniques de MilkDrop.
- `handoff-*` — còpia del traspàs anterior abans d’aquesta reescriptura.

Les carpetes són còpies dels fitxers afectats, no necessàriament snapshots complets ni tots els estats intermedis. No restaurar-les cegament damunt de canvis posteriors. Comparar abans els fitxers.

En aquesta sessió l’entorn té filesystem de només lectura per defecte: les escriptures i els processos que generen fitxers s’han executat amb escalada autoritzada. La següent IA ha de llegir les seves restriccions reals, no deduir-les de l’antic treball a /tmp ni esquivar permisos. No incloure credencials ni dades personals en informes o paquets. No enviar missatges externs ni publicar el projecte sense l’autorització corresponent.

Aquest traspàs documenta el treball fet i els límits. **No declara resolta la falta de diferenciació de les visualitzacions recents: és el punt principal per continuar Prisma.**
