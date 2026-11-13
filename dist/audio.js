import {t} from './i18n.js';
import {bandEnergy,clamp,Pulse,ReactiveEnvelope} from './analysis.js';
// Entrades que porten el so que surt pels altaveus: la font virtual del guió So-del-sistema.sh,
// els monitors de PulseAudio/PipeWire (Firefox els mostra; Chrome no) i equivalents d'altres sistemes.
const SYSTEM_INPUT=[[/prisma/i,4],[/^monitor (of|de) (?!virtual)/i,3],[/monitor/i,2],[/stereo mix|mescla est[eè]reo|mezcla est[eé]reo|what u hear|loopback|blackhole|soundflower/i,2]];
export function pickSystemInput(devices){
 let best=null,score=0;
 for(const d of devices||[]){if(d.kind!=='audioinput'||!d.label||!d.deviceId||d.deviceId==='default')continue;
  const s=Math.max(0,...SYSTEM_INPUT.map(([re,v])=>re.test(d.label)?v:0));if(s>score){best=d;score=s}}
 return best;
}
export const SYSTEM_MISSING=t('No trobo cap entrada amb el so del sistema. Chrome amaga els monitors de sortida de Linux: executa una vegada «./So-del-sistema.sh» (a la carpeta de Prisma), que crea l’entrada «Prisma · so del sistema», i torna a prémer el botó. També la pots triar a mà a «Entrada d’àudio».');
const liveKinds=['mic','tab','system'];
const rawAudio=id=>({audio:{...(id?{deviceId:{exact:id}}:{}),echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
export class AudioEngine{
 constructor(onEnd=()=>{}){this.context=null;this.element=new Audio();this.element.preload='metadata';this.element.addEventListener('ended',onEnd);this.mode='idle';this.stream=null;this.url=null;this.generation=0;this.demoNodes=new Set();this.pulse=new Pulse();this.envelope=new ReactiveEnvelope();this.bands={bass:0,mid:0,high:0,rms:0,pulse:0};this.disposed=false;this.volume=.65;this.demoStep=0;this.nextNote=0}
 async init(){if(!this.context){const AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AC)throw Error(t('Aquest navegador no admet Web Audio.'));this.context=new AC();this.analyser=this.context.createAnalyser();this.analyser.fftSize=2048;this.analyser.smoothingTimeConstant=.08;this.analyser.minDecibels=-95;this.analyser.maxDecibels=-15;this.output=this.context.createGain();this.output.gain.value=this.volume;this.analyser.connect(this.output);this.output.connect(this.context.destination);this.mediaNode=this.context.createMediaElementSource(this.element);this.freq=new Uint8Array(this.analyser.frequencyBinCount);this.wave=new Uint8Array(this.analyser.fftSize);this.wave.fill(128)}await this.context.resume();}
 setVolume(v){this.volume=v;this.output?.gain.setTargetAtTime(liveKinds.includes(this.mode)?0:v,this.context.currentTime,.03)}
 cleanup(){this.generation++;this.element.pause();this.mediaNode?.disconnect();this.streamNode?.disconnect();this.streamNode=null;if(this.stream){for(const t of this.stream.getTracks())t.stop();this.stream=null}clearInterval(this.demoTimer);this.demoTimer=null;for(const n of this.demoNodes){try{n.stop()}catch{}n.disconnect()}this.demoNodes.clear();this.mode='idle';this.pulse=new Pulse();this.envelope=new ReactiveEnvelope()}
 async file(file){this.cleanup();const token=this.generation;await this.init();if(token!==this.generation)return false;if(this.url)URL.revokeObjectURL(this.url);this.url=URL.createObjectURL(file);this.element.src=this.url;this.mediaNode.connect(this.analyser);this.output.gain.value=this.volume;this.mode='file';try{await this.element.play();if(token!==this.generation)this.element.pause()}catch(e){if(token===this.generation)this.cleanup();throw e}}
 async live(kind,deviceId=''){
  this.cleanup();const token=this.generation;let stream;
  if(!globalThis.isSecureContext)throw Error(t('El navegador no autoritza la captura des d’aquest context. Obre l’HTML amb Chrome o Edge i revisa els permisos de captura. Pots fer servir fitxers locals i la demo.'));
  try{
   // Cridar l’API ABANS de qualsevol await preserva el gest real del clic.
   let request;
   if(kind==='mic'||kind==='system'){
    if(!navigator.mediaDevices?.getUserMedia)throw Error(t('Aquest navegador no permet accedir a les entrades d’àudio des d’aquest HTML.'));
    // Sense cancel·lació d’eco: amb el so del sistema, l’eco a eliminar seria precisament la música.
    request=kind==='mic'?navigator.mediaDevices.getUserMedia(rawAudio(deviceId)):this.openSystem(deviceId);
   }else{
    if(!navigator.mediaDevices?.getDisplayMedia)throw Error(t('La captura de pestanya no està disponible en aquest navegador o context. Prova Chrome/Edge, un fitxer o el micròfon.'));
    request=navigator.mediaDevices.getDisplayMedia({video:{displaySurface:'browser'},audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,suppressLocalAudioPlayback:false},selfBrowserSurface:'exclude',surfaceSwitching:'include',systemAudio:'include',windowAudio:'system'});
   }
   // Activa Web Audio també dins del clic, mentre el selector és obert.
   // Gestionem immediatament el rebuig: el permís pot trigar o cancel·lar-se.
   const initialized=this.init().then(()=>null,error=>({error}));
   stream=await request;
   if(token!==this.generation){stream.getTracks().forEach(t=>t.stop());return false}
   const tracks=stream.getAudioTracks();
   if(!tracks.length){
    const surface=stream.getVideoTracks?.()[0]?.getSettings?.().displaySurface;
    const detail=surface==='window'?t('Has compartit una finestra sense pista de so.'):surface==='monitor'?t('Has compartit una pantalla sense pista de so.'):t('La captura no inclou cap pista de so.');
    throw Error(detail+t(' No s’ha compartit àudio. Torna a triar «Pestanya de Chrome/Edge», selecciona la pestanya que reprodueix música i activa «Comparteix l’àudio». Una finestra pot no oferir so en aquest sistema. Per a tot el so del portàtil (i a Firefox), fes servir «So del sistema».'));
   }
   if(!tracks.some(t=>t.enabled!==false&&t.readyState!=='ended'))throw Error(t('La pista d’àudio compartida està desactivada o acabada. Torna a seleccionar la font.'));
   const initialization=await initialized;
   if(initialization)throw initialization.error;
   if(token!==this.generation){stream.getTracks().forEach(t=>t.stop());return false}
   this.output.gain.value=0;
   this.stream=stream;this.streamNode=this.context.createMediaStreamSource(stream);this.streamNode.connect(this.analyser);
   this.mode=kind;
   this.capture={surface:stream.getVideoTracks?.()[0]?.getSettings?.().displaySurface||kind,label:tracks[0].label||'',deviceId:tracks[0].getSettings?.().deviceId||'',muted:tracks.every(t=>t.muted===true)};
   for(const t of stream.getTracks())t.addEventListener('ended',()=>{if(token===this.generation){this.cleanup();this.onLiveEnd?.()}});
   return true;
  }catch(e){if(token===this.generation)this.cleanup();if(stream&&stream!==this.stream)stream.getTracks().forEach(t=>t.stop());throw e}
 }
 // Busca l’entrada que porta la sortida del sistema. Sense permís previ les etiquetes són buides:
 // demanem l’entrada predeterminada per obtenir-les i, si cal, obrim la correcta.
 async openSystem(deviceId=''){
  const media=navigator.mediaDevices;
  if(deviceId)return media.getUserMedia(rawAudio(deviceId));
  let devices=await media.enumerateDevices?.()||[],found=pickSystemInput(devices);
  if(found)return media.getUserMedia(rawAudio(found.deviceId));
  if(devices.some(d=>d.kind==='audioinput'&&d.label))throw Object.assign(Error(SYSTEM_MISSING),{name:'SystemAudioMissing'});
  const probe=await media.getUserMedia(rawAudio(''));
  try{
   found=pickSystemInput(await media.enumerateDevices());
   const current=probe.getAudioTracks()[0]?.getSettings?.().deviceId;
   if(found&&found.deviceId===current)return probe;
   probe.getTracks().forEach(t=>t.stop());
  }catch(e){probe.getTracks().forEach(t=>t.stop());throw e}
  if(!found)throw Object.assign(Error(SYSTEM_MISSING),{name:'SystemAudioMissing'});
  return media.getUserMedia(rawAudio(found.deviceId));
 }
 async demo(){this.cleanup();const token=this.generation;await this.init();if(token!==this.generation)return false;this.mode='demo';this.output.gain.value=this.volume;this.demoStep=0;this.nextNote=this.context.currentTime+.04;this.scheduleDemo();this.demoTimer=setInterval(()=>this.scheduleDemo(),80)}
 scheduleDemo(){if(this.mode!=='demo')return;const ctx=this.context,stepTime=60/108/4;
  // Si la pestanya s'ha suspès, no intentem reproduir totes les notes perdudes.
  if(this.nextNote<ctx.currentTime-.5)this.nextNote=ctx.currentTime+.03;
  while(this.nextNote<ctx.currentTime+.25){const t=this.nextNote,s=this.demoStep++;
   if(s%4===0)this.note(t,100,.32,'sine',.5,42);
   if(s%2===0)this.note(t,6000,.035,'triangle',.025,3200);
   if(s%8===4)this.note(t,190,.1,'triangle',.10,65);
   const notes=[130.81,155.56,196,233.08,261.63,233.08,196,155.56];
   if(s%2===0)this.note(t,notes[Math.floor(s/2)%8],.45,'sine',.09);
   if(s%16===0)this.note(t,65.4,.85,'triangle',.06);
   this.nextNote+=stepTime;
  }
 }
 note(time,freq,duration,type,volume,end){const o=this.context.createOscillator(),g=this.context.createGain();o.type=type;o.frequency.setValueAtTime(freq,time);if(end)o.frequency.exponentialRampToValueAtTime(end,time+duration);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(volume,time+.006);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(this.analyser);o.start(time);o.stop(time+duration+.02);this.demoNodes.add(o);o.onended=()=>{this.demoNodes.delete(o);o.disconnect();g.disconnect()}}
 async toggle(){if(this.mode==='file'){if(this.element.paused){await this.context.resume();await this.element.play()}else this.element.pause()}else if(this.mode==='demo'){this.cleanup()}else if(liveKinds.includes(this.mode)){this.cleanup()}else await this.demo()}
 sample(dt,time,options={}){
  if(!this.context)return this.bands;
  if(typeof options==='number')options={sensitivity:options};
  this.analyser.getByteFrequencyData(this.freq);this.analyser.getByteTimeDomainData(this.wave);
  let sum=0;for(const x of this.wave)sum+=((x-128)/128)**2;const rms=Math.sqrt(sum/this.wave.length);
  const active=this.mode!=='idle'&&(this.mode!=='file'||!this.element.paused);
  const raw=active?{bass:bandEnergy(this.freq,this.context.sampleRate,this.analyser.fftSize,35,220),mid:bandEnergy(this.freq,this.context.sampleRate,this.analyser.fftSize,220,2500),high:bandEnergy(this.freq,this.context.sampleRate,this.analyser.fftSize,2500,12000),rms}:{bass:0,mid:0,high:0,rms:0};
  this.bands=this.envelope.update(raw,this.freq,time,dt,options);return this.bands;
 }
 dispose(){this.cleanup();if(this.url)URL.revokeObjectURL(this.url);this.context?.close();this.disposed=true}
}
