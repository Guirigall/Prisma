# Estudi local de MilkDrop 3.28

Font inspeccionada: `~/Baixades/MilkDrop 3.28` (instal·lació local), en lectura. No s’ha modificat ni executat MilkDrop. No s’ha descompilat el binari.

La instal·lació conté 314 fitxers .milk i 203 .milk2. S’han comptat les característiques dels 314 .milk i llegit exemples de Geiss, Flexi i MilkDrop2077, a més de `Milkdrop3/docs/milkdrop_preset_authoring.html`.

Dels .milk, 300 contenen expressions per fotograma, 186 expressions per píxel/vèrtex, 299 shader de warp, 313 shader de composició, 256 definicions de formes i 209 definicions d’ones. 239 fan servir bass_att, 186 mid_att i 184 treb_att: lectures temporals suavitzades, segons la guia local. Aquestes xifres indiquen presència textual, no execució de les expressions.

El model documentat de MilkDrop combina deformació de la textura anterior, desaparició gradual, injecció d’ones i formes, i composició final amb ecos, color i desenfocament. La resposta és específica de cada preset. Les lectures ràpides i suavitzades permeten separar els atacs de l’evolució lenta. Els exemples llegits combinen els greus, mitjos i aguts amb diferents pesos i llindars adaptatius.

Prisma ja tenia memòria de dos fotogrames, però emprava pràcticament el mateix moviment i una composició per màxim en tots els modes. S’hi han afegit tres patrons originals amb transport específic de la memòria, suma de llum limitada, difusió local i injecció de forma d’ona. Vòrtex usa dos centres de circulació oposada; Mirall, una rosassa de dotze sectors; Corrents, un camp sinusoidal de velocitats amb espurnes. Els fractals mantenen coordenades i memòria fixes.

No s’han importat presets, textures ni shaders HLSL. La instal·lació inclou condicions d’ús pròpies; aquesta adaptació aplica les tècniques generals amb codi GLSL escrit per Prisma. No és un intèrpret .milk/.milk2 ni una rèplica exacta de MilkDrop 3.

Validació prevista: proves Node, compilació i renderitzat EGL de tots els patrons, comparació de resposta musical i comprovació de l’HTML en Chrome. Els informes separats indiquen els resultats efectivament executats. No s’ha fet una comparació visual simultània amb MilkDrop en execució.
