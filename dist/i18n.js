// Idiomes de Prisma: català (text de referència), castellà i anglès.
// El text català és la clau: t('Text en català') retorna la traducció de l'idioma actiu.
// L'idioma es tria amb ?lang=ca|es|en, la preferència desada o l'idioma del navegador.
const TEXTS=[
 // Capçalera, portada i escenari
 ['Prisma: transforma la música en llum. Visualitzador musical WebGL amb fitxers locals i micròfon.','Prisma: transforma la música en luz. Visualizador musical WebGL con archivos locales y micrófono.','Prisma: turns music into light. WebGL music visualiser with local files and microphone.'],
 ['Prisma 1.5 — transforma el so en llum','Prisma 1.5 — transforma el sonido en luz','Prisma 1.5 — turns sound into light'],
 ['Prisma, inici','Prisma, inicio','Prisma, home'],
 ['LABORATORI DE LLUM','LABORATORIO DE LUZ','LIGHT LABORATORY'],
 ['HTML AUTÒNOM · 1.5','HTML AUTÓNOMO · 1.5','STANDALONE HTML · 1.5'],
 ['Idioma','Idioma','Language'],
 ['Ajuda','Ayuda','Help'],
 ['Pantalla completa ↗','Pantalla completa ↗','Full screen ↗'],
 ['SO → MOVIMENT → LLUM','SONIDO → MOVIMIENTO → LUZ','SOUND → MOTION → LIGHT'],
 ['Escolta amb els ulls','Escucha con los ojos','Listen with your eyes'],
 ['Un llenç viu que respira amb la teva música.','Un lienzo vivo que respira con tu música.','A living canvas that breathes with your music.'],
 ['Tria un univers i deixa’t portar.','Elige un universo y déjate llevar.','Pick a universe and let it carry you.'],
 ['Visualitzador musical','Visualizador musical','Music visualiser'],
 ['Animació musical abstracta','Animación musical abstracta','Abstract music animation'],
 ['EXPLORACIÓ VISUAL','EXPLORACIÓN VISUAL','VISUAL EXPLORATION'],
 ['Desa una captura PNG','Guarda una captura PNG','Save a PNG snapshot'],
 ['Oculta els controls, tecla H','Oculta los controles, tecla H','Hide the controls, key H'],
 ['Oculta els controls','Oculta los controles','Hide the controls'],
 ['Deixa anar la música aquí','Suelta la música aquí','Drop your music here'],
 ['Reprodueix','Reproduce','Play'],
 ['El teu pròxim viatge comença aquí','Tu próximo viaje empieza aquí','Your next journey starts here'],
 ['Obre un fitxer, escolta el so del sistema o prova la demo','Abre un archivo, escucha el sonido del sistema o prueba la demo','Open a file, listen to the system sound or try the demo'],
 ['Volum de sortida','Volumen de salida','Output volume'],
 ['Posició de reproducció','Posición de reproducción','Playback position'],
 ['＋ Obre música','＋ Abre música','＋ Open music'],
 ['♫ So del sistema','♫ Sonido del sistema','♫ System sound'],
 ['◉ Micròfon','◉ Micrófono','◉ Microphone'],
 ['↗ Àudio d’una pestanya','↗ Audio de una pestaña','↗ Tab audio'],
 ['▷ Demo sonora','▷ Demo sonora','▷ Sound demo'],
 ['Entrada d’àudio','Entrada de audio','Audio input'],
 ['Entrada predeterminada','Entrada predeterminada','Default input'],
 ['«So del sistema» escolta tot el que sona al portàtil. A Linux amb Chrome cal executar una sola vegada','«Sonido del sistema» escucha todo lo que suena en el ordenador. En Linux con Chrome hay que ejecutar una sola vez','“System sound” listens to everything playing on the computer. On Linux with Chrome, run this once:'],
 ['Explora els visuals sense so, o connecta una font d’àudio.','Explora los visuales sin sonido, o conecta una fuente de audio.','Explore the visuals in silence, or connect an audio source.'],
 // Panells
 ['Universos','Universos','Universes'],
 ['13 UNIVERSOS','13 UNIVERSOS','13 UNIVERSES'],
 ['Viatge automàtic','Viaje automático','Auto journey'],
 ['Temps entre universos','Tiempo entre universos','Time between universes'],
 ['Al teu ritme','A tu ritmo','At your pace'],
 ['Restableix','Restablece','Reset'],
 ['Sensibilitat d’àudio','Sensibilidad de audio','Audio sensitivity'],
 ['Greus','Graves','Bass'],
 ['Mitjos','Medios','Mids'],
 ['Aguts','Agudos','Highs'],
 ['Destaca els atacs','Destaca los ataques','Emphasise attacks'],
 ['Impacte rítmic','Impacto rítmico','Rhythmic impact'],
 ['Decaïment','Decaimiento','Release'],
 ['Normalitza el nivell','Normaliza el nivel','Normalise level'],
 ['Persistència','Persistencia','Persistence'],
 ['Velocitat','Velocidad','Speed'],
 ['Color','Color','Colour'],
 ['Qualitat','Calidad','Quality'],
 ['Automàtica','Automática','Automatic'],
 ['Lleugera','Ligera','Light'],
 ['Alta','Alta','High'],
 ['El pols del so','El pulso del sonido','The pulse of sound'],
 ['GREUS','GRAVES','BASS'],
 ['MITJOS','MEDIOS','MIDS'],
 ['AGUTS','AGUDOS','HIGHS'],
 ['Espectre de freqüències','Espectro de frecuencias','Frequency spectrum'],
 ['Esperant una font d’àudio','Esperando una fuente de audio','Waiting for an audio source'],
 ['FET PER PERDRE LA NOCIÓ DEL TEMPS.','HECHO PARA PERDER LA NOCIÓN DEL TIEMPO.','MADE FOR LOSING TRACK OF TIME.'],
 ['Sense compte. Sense pujar fitxers. Només tu i el so.','Sin cuenta. Sin subir archivos. Solo tú y el sonido.','No account. No uploads. Just you and the sound.'],
 // Ajuda
 ['Tanca l’ajuda','Cierra la ayuda','Close help'],
 ['PRISMA / GUIA RÀPIDA','PRISMA / GUÍA RÁPIDA','PRISMA / QUICK GUIDE'],
 ['Dona forma al so.','Dale forma al sonido.','Give shape to sound.'],
 ['Fitxers:','Archivos:','Files:'],
 ['obre o arrossega música. Tot es processa en aquest navegador; no s’envia a cap servidor. Diversos fitxers es reprodueixen en ordre.','abre o arrastra música. Todo se procesa en este navegador; no se envía a ningún servidor. Varios archivos se reproducen en orden.','open or drag in music. Everything is processed in this browser; nothing is sent to any server. Several files play in order.'],
 ['Micròfon:','Micrófono:','Microphone:'],
 ['accepta el permís del navegador. No el reproduïm pels altaveus, per evitar acoblaments. Prem el mateix botó per desconnectar-lo.','acepta el permiso del navegador. No lo reproducimos por los altavoces, para evitar acoples. Pulsa el mismo botón para desconectarlo.','accept the browser permission. It is not played through the speakers, to avoid feedback. Press the same button to disconnect it.'],
 ['So del sistema:','Sonido del sistema:','System sound:'],
 ['escolta tot el que surt pels altaveus (Spotify, YouTube, un reproductor…). Prisma busca una entrada que porti aquesta sortida: «Prisma · so del sistema», un «Monitor of…» (Firefox els mostra) o «Stereo Mix» a Windows. Chrome a Linux amaga els monitors: executa una vegada','escucha todo lo que sale por los altavoces (Spotify, YouTube, un reproductor…). Prisma busca una entrada que lleve esa salida: «Prisma · so del sistema», un «Monitor of…» (Firefox los muestra) o «Stereo Mix» en Windows. Chrome en Linux oculta los monitores: ejecuta una vez','listens to everything coming out of the speakers (Spotify, YouTube, a player…). Prisma looks for an input that carries that output: “Prisma · so del sistema”, a “Monitor of…” (Firefox shows them) or “Stereo Mix” on Windows. Chrome on Linux hides monitors: run once'],
 ['a la carpeta de Prisma i queda creada l’entrada virtual, també després de reiniciar (','en la carpeta de Prisma y queda creada la entrada virtual, también después de reiniciar (','in the Prisma folder and the virtual input is created, and kept after rebooting ('],
 ['la treu). No reproduïm aquesta entrada pels altaveus, i no cal cancel·lació d’eco.','la quita). No reproducimos esta entrada por los altavoces, y no hace falta cancelación de eco.','removes it). This input is not played through the speakers, and no echo cancellation is needed.'],
 ['Entrada d’àudio:','Entrada de audio:','Audio input:'],
 ['el selector mostra les entrades que ofereix el navegador després de donar permís. Pots triar-hi a mà qualsevol entrada.','el selector muestra las entradas que ofrece el navegador tras dar permiso. Puedes elegir a mano cualquier entrada.','the selector lists the inputs the browser offers once permission is granted. You can pick any input by hand.'],
 ['Filtres visuals:','Filtros visuales:','Visual filters:'],
 ['Greus, Mitjos i Aguts ajusten la influència de cada banda sense canviar el so. «Destaca els atacs» redueix el pes del so sostingut per recuperar el moviment dels cops.','Graves, Medios y Agudos ajustan la influencia de cada banda sin cambiar el sonido. «Destaca los ataques» reduce el peso del sonido sostenido para recuperar el movimiento de los golpes.','Bass, Mids and Highs set how much each band drives the visuals without changing the sound. “Emphasise attacks” lowers the weight of sustained sound so the beats move the image again.'],
 ['Pestanya:','Pestaña:','Tab:'],
 ['només per a una pestanya concreta. Firefox no admet l’àudio de pestanyes amb aquesta API; fes servir «So del sistema». Amb Chrome/Edge, tria «Pestanya de Chrome/Edge», selecciona la pestanya que reprodueix música i activa «Comparteix l’àudio». Compartir la finestra sencera del navegador pot aportar només vídeo, sobretot a Linux. Si no arriba cap pista de so, Prisma ho explicarà i alliberarà la captura.','solo para una pestaña concreta. Firefox no admite el audio de pestañas con esta API; usa «Sonido del sistema». Con Chrome/Edge, elige «Pestaña de Chrome/Edge», selecciona la pestaña que reproduce música y activa «Compartir audio». Compartir la ventana entera del navegador puede aportar solo vídeo, sobre todo en Linux. Si no llega ninguna pista de sonido, Prisma lo explicará y liberará la captura.','for one specific tab only. Firefox does not support tab audio with this API; use “System sound”. With Chrome/Edge, choose “Chrome/Edge tab”, select the tab playing music and enable “Share audio”. Sharing the whole browser window may only give video, especially on Linux. If no audio track arrives, Prisma will say so and release the capture.'],
 ['Demo sonora:','Demo sonora:','Sound demo:'],
 ['una peça sintètica generada localment per provar la resposta real als greus i al ritme.','una pieza sintética generada localmente para probar la respuesta real a los graves y al ritmo.','a synthetic piece generated locally to try the real response to bass and rhythm.'],
 ['Dreceres:','Atajos:','Shortcuts:'],
 ['espai, reproducció/pausa; ←/→, univers; F, pantalla completa; H, amaga controls; Esc, recupera controls.','espacio, reproducción/pausa; ←/→, universo; F, pantalla completa; H, oculta controles; Esc, recupera controles.','space, play/pause; ←/→, universe; F, full screen; H, hide controls; Esc, show controls.'],
 ['Prisma està inspirat en els visualitzadors clàssics. Els presets són originals i no carrega fitxers .milk o .milk2. La captura PNG desa només el visual.','Prisma está inspirado en los visualizadores clásicos. Los presets son originales y no carga archivos .milk o .milk2. La captura PNG guarda solo el visual.','Prisma is inspired by classic visualisers. The presets are original and it does not load .milk or .milk2 files. The PNG snapshot saves only the visual.'],
 ['Aquest HTML s’obre directament amb doble clic, sense servidor. El micròfon i la captura depenen dels permisos i del suport del navegador per a fitxers locals. No es pot forçar una captura que el navegador no ofereix. Els visuals poden contenir moviment i canvis de llum; pots pausar-los amb «Pausa visual», aquí mateix.','Este HTML se abre directamente con doble clic, sin servidor. El micrófono y la captura dependen de los permisos y del soporte del navegador para archivos locales. No se puede forzar una captura que el navegador no ofrece. Los visuales pueden contener movimiento y cambios de luz; puedes pausarlos con «Pausa visual», aquí mismo.','This HTML opens directly with a double click, with no server. The microphone and capture depend on browser permissions and support for local files. A capture the browser does not offer cannot be forced. The visuals may contain motion and flashing light; you can pause them with “Pause visuals”, right here.'],
 ['Pausa visual','Pausa visual','Pause visuals'],
 ['Reprèn el visual','Reanuda el visual','Resume visuals'],
 // Missatges de l'aplicació
 ['Fi de la llista. Pots tornar-la a reproduir.','Fin de la lista. Puedes volver a reproducirla.','End of the playlist. You can play it again.'],
 ['Permís denegat o captura cancel·lada. Pots tornar-ho a provar o obrir música.','Permiso denegado o captura cancelada. Puedes volver a intentarlo o abrir música.','Permission denied or capture cancelled. You can try again or open music.'],
 ['No s’ha trobat cap micròfon disponible.','No se ha encontrado ningún micrófono disponible.','No microphone was found.'],
 ['No es pot llegir el dispositiu. Comprova si una altra aplicació l’està utilitzant.','No se puede leer el dispositivo. Comprueba si otra aplicación lo está usando.','The device cannot be read. Check whether another application is using it.'],
 ['L’operació s’ha interromput. Torna-ho a provar.','La operación se ha interrumpido. Vuelve a intentarlo.','The operation was interrupted. Please try again.'],
 ['La captura necessita un clic amb Prisma en primer pla. Torna a prémer Àudio d’una pestanya.','La captura necesita un clic con Prisma en primer plano. Vuelve a pulsar Audio de una pestaña.','Capture needs a click with Prisma in the foreground. Press Tab audio again.'],
 ['Aquest format d’àudio no està admès pel navegador.','Este formato de audio no lo admite el navegador.','This audio format is not supported by the browser.'],
 ['No s’ha pogut obrir la font d’àudio.','No se ha podido abrir la fuente de audio.','The audio source could not be opened.'],
 ['Atura la font d’àudio','Detén la fuente de audio','Stop the audio source'],
 ['Pausa','Pausa','Pause'],
 ['MÚSICA LOCAL','MÚSICA LOCAL','LOCAL MUSIC'],
 ['MICRÒFON EN DIRECTE','MICRÓFONO EN DIRECTO','LIVE MICROPHONE'],
 ['PESTANYA EN DIRECTE','PESTAÑA EN DIRECTO','LIVE TAB'],
 ['SO DEL SISTEMA','SONIDO DEL SISTEMA','SYSTEM SOUND'],
 ['DEMO SONORA','DEMO SONORA','SOUND DEMO'],
 ['Exploració visual','Exploración visual','Visual exploration'],
 ['Cap micròfon ni captura d’àudio actius','Ningún micrófono ni captura de audio activos','No microphone or audio capture active'],
 ['Obrint {name}…','Abriendo {name}…','Opening {name}…'],
 ['Fitxer {n} de {total} · processament local','Archivo {n} de {total} · procesamiento local','File {n} of {total} · processed locally'],
 ['La música és al teu navegador. No s’ha pujat cap fitxer.','La música está en tu navegador. No se ha subido ningún archivo.','The music stays in your browser. No file has been uploaded.'],
 ['Tria un fitxer d’àudio: MP3, WAV, OGG, FLAC o M4A.','Elige un archivo de audio: MP3, WAV, OGG, FLAC o M4A.','Choose an audio file: MP3, WAV, OGG, FLAC or M4A.'],
 ['Accepta el permís del micròfon…','Acepta el permiso del micrófono…','Accept the microphone permission…'],
 ['El món al teu voltant','El mundo a tu alrededor','The world around you'],
 ['Micròfon connectat. Parla o posa música; no reproduïm l’entrada pels altaveus.','Micrófono conectado. Habla o pon música; no reproducimos la entrada por los altavoces.','Microphone connected. Talk or play music; the input is not played through the speakers.'],
 ['Tria una pestanya i marca l’opció de compartir-ne l’àudio…','Elige una pestaña y marca la opción de compartir su audio…','Choose a tab and tick the option to share its audio…'],
 ['Àudio de la pestanya compartida','Audio de la pestaña compartida','Shared tab audio'],
 ['Captura connectada. Atura-la amb el mateix botó o des del navegador.','Captura conectada. Detenla con el mismo botón o desde el navegador.','Capture connected. Stop it with the same button or from the browser.'],
 ['Buscant l’entrada amb el so del sistema… accepta el permís si te’l demana.','Buscando la entrada con el sonido del sistema… acepta el permiso si te lo pide.','Looking for the input carrying the system sound… accept the permission if asked.'],
 ['So del sistema','Sonido del sistema','System sound'],
 ['So del sistema connectat. Tot el que soni al portàtil mou Prisma; no el tornem a reproduir.','Sonido del sistema conectado. Todo lo que suene en el ordenador mueve Prisma; no lo volvemos a reproducir.','System sound connected. Everything playing on the computer moves Prisma; it is not played again.'],
 ['Captura desconnectada. El micròfon i les pistes compartides s’han alliberat.','Captura desconectada. El micrófono y las pistas compartidas se han liberado.','Capture disconnected. The microphone and shared tracks have been released.'],
 ['En directe · sense gravar ni desar àudio','En directo · sin grabar ni guardar audio','Live · nothing is recorded or saved'],
 ['Entrada {n}','Entrada {n}','Input {n}'],
 ['Entrada d’àudio connectada.','Entrada de audio conectada.','Audio input connected.'],
 ['Demo aturada.','Demo detenida.','Demo stopped.'],
 ['Prisma / Circuit nocturn','Prisma / Circuito nocturno','Prisma / Night circuit'],
 ['Demo sintètica original · 108 BPM · bucle','Demo sintética original · 108 BPM · bucle','Original synthetic demo · 108 BPM · loop'],
 ['Demo sintètica original · 108 BPM','Demo sintética original · 108 BPM','Original synthetic demo · 108 BPM'],
 ['Demo generada amb Web Audio: greus, percussió i arpegi.','Demo generada con Web Audio: graves, percusión y arpegio.','Demo generated with Web Audio: bass, percussion and arpeggio.'],
 ['La font ha deixat de compartir àudio.','La fuente ha dejado de compartir audio.','The source stopped sharing audio.'],
 ['No s’ha pogut llegir aquest àudio. Prova un altre fitxer o format.','No se ha podido leer este audio. Prueba otro archivo o formato.','This audio could not be read. Try another file or format.'],
 ['El visual encara no està disponible.','El visual aún no está disponible.','The visual is not available yet.'],
 ['S’ha perdut el context gràfic. Esperant que el navegador el recuperi…','Se ha perdido el contexto gráfico. Esperando a que el navegador lo recupere…','The graphics context was lost. Waiting for the browser to restore it…'],
 ['Context gràfic recuperat.','Contexto gráfico recuperado.','Graphics context restored.'],
 ['Hi ha una pista compartida però no arriba so. Comprova que la pestanya reprodueixi música, que no estigui silenciada i que hagis compartit l’àudio.','Hay una pista compartida pero no llega sonido. Comprueba que la pestaña reproduzca música, que no esté silenciada y que hayas compartido el audio.','A track is shared but no sound arrives. Check that the tab is playing music, is not muted and that you shared its audio.'],
 ['L’entrada del sistema està connectada però ara no sona res al portàtil. Posa música: si continua en silenci, comprova que surti per la sortida predeterminada.','La entrada del sistema está conectada pero ahora no suena nada en el ordenador. Pon música: si sigue en silencio, comprueba que salga por la salida predeterminada.','The system input is connected but nothing is playing on the computer right now. Play some music: if it stays silent, check that it comes out of the default output.'],
 ['El micròfon està connectat però no arriba senyal. Revisa el dispositiu d’entrada i els permisos.','El micrófono está conectado pero no llega señal. Revisa el dispositivo de entrada y los permisos.','The microphone is connected but no signal arrives. Check the input device and the permissions.'],
 ['Senyal d’àudio recuperat.','Señal de audio recuperada.','Audio signal restored.'],
 ['Senyal actiu · detecció de pols adaptativa','Señal activa · detección de pulso adaptativa','Signal active · adaptive beat detection'],
 ['Font connectada · sense senyal audible','Fuente conectada · sin señal audible','Source connected · no audible signal'],
 ['EN DIRECTE','EN DIRECTO','LIVE'],
 ['Versió HTML autònoma: no necessita servidor, instal·lació ni connexió per als visuals i els fitxers locals.','Versión HTML autónoma: no necesita servidor, instalación ni conexión para los visuales y los archivos locales.','Standalone HTML version: no server, installation or connection needed for the visuals and local files.'],
 // Motor d'àudio i gràfic
 ['Aquest navegador no admet Web Audio.','Este navegador no admite Web Audio.','This browser does not support Web Audio.'],
 ['El navegador no autoritza la captura des d’aquest context. Obre l’HTML amb Chrome o Edge i revisa els permisos de captura. Pots fer servir fitxers locals i la demo.','El navegador no autoriza la captura desde este contexto. Abre el HTML con Chrome o Edge y revisa los permisos de captura. Puedes usar archivos locales y la demo.','The browser does not allow capture from this context. Open the HTML with Chrome or Edge and check the capture permissions. You can still use local files and the demo.'],
 ['Aquest navegador no permet accedir a les entrades d’àudio des d’aquest HTML.','Este navegador no permite acceder a las entradas de audio desde este HTML.','This browser does not allow access to audio inputs from this HTML.'],
 ['La captura de pestanya no està disponible en aquest navegador o context. Prova Chrome/Edge, un fitxer o el micròfon.','La captura de pestaña no está disponible en este navegador o contexto. Prueba Chrome/Edge, un archivo o el micrófono.','Tab capture is not available in this browser or context. Try Chrome/Edge, a file or the microphone.'],
 ['Has compartit una finestra sense pista de so.','Has compartido una ventana sin pista de sonido.','You shared a window with no audio track.'],
 ['Has compartit una pantalla sense pista de so.','Has compartido una pantalla sin pista de sonido.','You shared a screen with no audio track.'],
 ['La captura no inclou cap pista de so.','La captura no incluye ninguna pista de sonido.','The capture includes no audio track.'],
 [' No s’ha compartit àudio. Torna a triar «Pestanya de Chrome/Edge», selecciona la pestanya que reprodueix música i activa «Comparteix l’àudio». Una finestra pot no oferir so en aquest sistema. Per a tot el so del portàtil (i a Firefox), fes servir «So del sistema».',' No se ha compartido audio. Vuelve a elegir «Pestaña de Chrome/Edge», selecciona la pestaña que reproduce música y activa «Compartir audio». Una ventana puede no ofrecer sonido en este sistema. Para todo el sonido del ordenador (y en Firefox), usa «Sonido del sistema».',' No audio was shared. Choose “Chrome/Edge tab” again, select the tab playing music and enable “Share audio”. A window may not offer sound on this system. For all the computer’s sound (and on Firefox), use “System sound”.'],
 ['La pista d’àudio compartida està desactivada o acabada. Torna a seleccionar la font.','La pista de audio compartida está desactivada o terminada. Vuelve a seleccionar la fuente.','The shared audio track is disabled or ended. Select the source again.'],
 ['No trobo cap entrada amb el so del sistema. Chrome amaga els monitors de sortida de Linux: executa una vegada «./So-del-sistema.sh» (a la carpeta de Prisma), que crea l’entrada «Prisma · so del sistema», i torna a prémer el botó. També la pots triar a mà a «Entrada d’àudio».','No encuentro ninguna entrada con el sonido del sistema. Chrome oculta los monitores de salida de Linux: ejecuta una vez «./So-del-sistema.sh» (en la carpeta de Prisma), que crea la entrada «Prisma · so del sistema», y vuelve a pulsar el botón. También puedes elegirla a mano en «Entrada de audio».','No input carrying the system sound was found. Chrome hides Linux output monitors: run “./So-del-sistema.sh” once (in the Prisma folder), which creates the input “Prisma · so del sistema”, then press the button again. You can also pick it by hand under “Audio input”.'],
 ['Prisma necessita WebGL 2. Activa l’acceleració gràfica o prova un navegador actualitzat.','Prisma necesita WebGL 2. Activa la aceleración gráfica o prueba un navegador actualizado.','Prisma needs WebGL 2. Enable hardware acceleration or try an up-to-date browser.'],
 ['Error de shader: ','Error de shader: ','Shader error: '],
 ['Error WebGL: ','Error WebGL: ','WebGL error: '],
 ['No s’ha pogut crear la memòria gràfica.','No se ha podido crear la memoria gráfica.','The graphics memory could not be created.'],
 // Universos
 ['Aurora líquida','Aurora líquida','Liquid aurora'],
 ['Cintes de llum en moviment','Cintas de luz en movimiento','Ribbons of moving light'],
 ['Òrbites infinites','Órbitas infinitas','Infinite orbits'],
 ['Òrbites','Órbitas','Orbits'],
 ['Simetries que respiren amb els greus','Simetrías que respiran con los graves','Symmetries breathing with the bass'],
 ['Matèria viva','Materia viva','Living matter'],
 ['Matèria','Materia','Matter'],
 ['Un oceà de plasma i color','Un océano de plasma y color','An ocean of plasma and colour'],
 ['Travessa','Travesía','Crossing'],
 ['Un túnel cap a un altre lloc','Un túnel hacia otro lugar','A tunnel to somewhere else'],
 ['Pols estel·lar','Polvo estelar','Stardust'],
 ['Pols','Polvo','Dust'],
 ['Constel·lacions en suspensió','Constelaciones en suspensión','Constellations in suspension'],
 ['Ressonància','Resonancia','Resonance'],
 ['El traç elèctric del so','El trazo eléctrico del sonido','The electric trace of sound'],
 ['Jardí de Julia','Jardín de Julia','Julia garden'],
 ['Zoom infinit · cada forma en conté una còpia exacta','Zoom infinito · cada forma contiene una copia exacta','Infinite zoom · every shape holds an exact copy of itself'],
 ['Zoom infinit cap al Mandelbrot que viu dins del Mandelbrot','Zoom infinito hacia el Mandelbrot que vive dentro del Mandelbrot','Infinite zoom into the Mandelbrot living inside the Mandelbrot'],
 ['Gira-sol de Fibonacci','Girasol de Fibonacci','Fibonacci sunflower'],
 ['Gira-sol','Girasol','Sunflower'],
 ['Llavors que neixen al centre i s’obren en espirals de 21 i 34','Semillas que nacen en el centro y se abren en espirales de 21 y 34','Seeds born at the centre, opening into 21 and 34 spirals'],
 ['Quasicristall','Cuasicristal','Quasicrystal'],
 ['Set ones que interfereixen · cada una és una banda del so','Siete ondas que interfieren · cada una es una banda del sonido','Seven interfering waves · each one is a band of the sound'],
 ['Harmonògraf','Armonógrafo','Harmonograph'],
 ['Dos pèndols dibuixen amb llum · el dibuix s’endinsa','Dos péndulos dibujan con luz · el dibujo se adentra','Two pendulums draw with light · the drawing sinks inwards'],
 ['Paisatge espectral','Paisaje espectral','Spectral landscape'],
 ['Paisatge','Paisaje','Landscape'],
 ['Serralada de l’espectre · el so d’ara davant, el passat al fons','Cordillera del espectro · el sonido de ahora delante, el pasado al fondo','A mountain range of the spectrum · the present in front, the past behind'],
 ['Túnel de Chladni','Túnel de Chladni','Chladni tunnel'],
 ['Vol a través de plaques de sorra vibrant','Vuelo a través de placas de arena vibrante','A flight through plates of vibrating sand'],
];
export const LANGUAGES={ca:'Català',es:'Español',en:'English'};
const tables={es:new Map(),en:new Map()};
for(const [ca,es,en] of TEXTS){tables.es.set(ca,es);tables.en.set(ca,en)}
export const CATALAN_KEYS=TEXTS.map(row=>row[0]);
function pickLanguage(){
 if(typeof document==='undefined')return 'ca';   // proves de Node: català, el text de referència
 try{const q=new URLSearchParams(globalThis.location?.search||'').get('lang');if(q in LANGUAGES)return q}catch{}
 try{const saved=globalThis.localStorage?.getItem('prisma-lang');if(saved in LANGUAGES)return saved}catch{}
 for(const l of globalThis.navigator?.languages||[]){const base=String(l).slice(0,2).toLowerCase();if(base in LANGUAGES)return base}
 return globalThis.navigator?.languages?'en':'ca';
}
export let lang=pickLanguage();
// Separador decimal de l'idioma actiu.
export const DECIMAL=lang==='en'?'.':',';
export function t(ca,vars){
 let text=lang==='ca'?ca:(tables[lang].get(ca)??ca);
 if(vars)text=text.replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
 return text;
}
// Tradueix els textos fixos de la plantilla (nodes de text i atributs) sense tocar el codi ni els <code>.
export function translatePage(doc){
 if(doc.documentElement)doc.documentElement.lang=lang;
 if(lang==='ca')return;
 doc.title=t(doc.title);
 const meta=doc.querySelector('meta[name="description"]');if(meta)meta.content=t(meta.content);
 for(const el of doc.querySelectorAll('[aria-label],[title]'))for(const a of ['aria-label','title'])if(el.hasAttribute(a))el.setAttribute(a,t(el.getAttribute(a)));
 const walker=doc.createTreeWalker(doc.body,4);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  if(node.parentElement?.closest('code,script,style'))continue;
  const raw=node.nodeValue,key=raw.trim();if(!key)continue;
  const translated=t(key);if(translated!==key)node.nodeValue=raw.replace(key,translated);
 }
}
// Canviar d'idioma recarrega l'HTML amb ?lang=…: és fiable també des de file://.
export function switchLanguage(next){
 try{globalThis.localStorage?.setItem('prisma-lang',next)}catch{}
 const url=new URL(location.href);url.searchParams.set('lang',next);location.href=url.href;
}
