export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
export function bandEnergy(data,sampleRate,fftSize,lo,hi){
 const start=Math.max(1,Math.floor(lo*fftSize/sampleRate)),end=Math.min(data.length,Math.ceil(hi*fftSize/sampleRate));
 if(end<=start)return 0;let sum=0;for(let i=start;i<end;i++)sum+=(data[i]/255)**2;return Math.sqrt(sum/(end-start));
}
export class Pulse{
 constructor(){this.floor=.08;this.fluxFloor=.005;this.last=-10;this.value=0;this.beat=false;this.previous=0}
 update(energy,time,dt,flux=0,release=.18){
  const rise=Math.max(0,energy-this.previous);this.previous=energy;
  const onset=(energy>.035&&energy>this.floor*1.25&&rise>.025)||(flux>.008&&flux>this.fluxFloor*1.6&&energy>.025);
  this.beat=onset&&time-this.last>.16;
  if(this.beat){this.last=time;this.value=1}
  this.floor+=(energy-this.floor)*(1-Math.exp(-dt*1.5));
  this.fluxFloor+=(flux-this.fluxFloor)*(1-Math.exp(-dt*1.8));
  this.value*=Math.exp(-dt/Math.max(.06,release));return this.value;
 }
}
export class ReactiveEnvelope{
 constructor(){this.level=.12;this.sustained={bass:0,mid:0,high:0};this.lastRaw={bass:0,mid:0,high:0};this.previous=new Uint8Array(1024);this.bands={bass:0,mid:0,high:0,rms:0,pulse:0};this.pulse=new Pulse()}
 update(raw,spectrum,time,dt,{sensitivity=1.8,release=.18,normalise=true,bassGain=1,midGain=1,highGain=1,rhythm=.7}={}){
  const active=raw.rms>.0015;
  if(active)this.level+=(raw.rms-this.level)*(1-Math.exp(-dt*1.2));
  const gain=normalise?clamp(.16/Math.max(.012,this.level),.5,10):1;
  const balance={bass:clamp(bassGain,0,2),mid:clamp(midGain,0,2),high:clamp(highGain,0,2)};
  const transient={};let onset=0;
  for(const key of ['bass','mid','high']){
   const value=active?raw[key]*balance[key]:0;
   transient[key]=Math.max(0,value-this.sustained[key]);
   // Les pujades de mitjos/aguts també detecten cops amb un baix sostingut.
   onset=Math.max(onset,Math.max(0,value-this.lastRaw[key]));
   this.lastRaw[key]=value;
   this.sustained[key]+=(value-this.sustained[key])*(1-Math.exp(-dt/.5));
  }
  this.bands.pulse=this.pulse.update(onset,time,dt,0,release);
  for(const key of ['bass','mid','high','rms']){
   const value=key==='rms'?raw.rms:raw[key]*balance[key]*(1-clamp(rhythm)) + transient[key]*clamp(rhythm)*1.8;
   const target=active?1-Math.exp(-value*gain*sensitivity*1.25):0;
   const tau=target>this.bands[key]?.012:release;
   this.bands[key]+=(target-this.bands[key])*(1-Math.exp(-dt/tau));
  }
  this.bands.gain=gain;this.bands.inputRms=raw.rms;return this.bands;
 }
}
export const PRESETS=[
 {name:'Aurora líquida',short:'Aurora',subtitle:'Cintes de llum en moviment'},
 {name:'Òrbites infinites',short:'Òrbites',subtitle:'Simetries que respiren amb els greus'},
 {name:'Matèria viva',short:'Matèria',subtitle:'Un oceà de plasma i color'},
 {name:'Travessa',short:'Travessa',subtitle:'Un túnel cap a un altre lloc'},
 {name:'Pols estel·lar',short:'Pols',subtitle:'Constel·lacions en suspensió'},
 {name:'Ressonància',short:'Ressonància',subtitle:'El traç elèctric del so'},
 {name:'Jardí de Julia',short:'Julia',subtitle:'Zoom infinit · cada forma en conté una còpia exacta'},
 {name:'Mandelbrot',short:'Mandelbrot',subtitle:'Zoom infinit cap al Mandelbrot que viu dins del Mandelbrot'},
 {name:'Gira-sol de Fibonacci',short:'Gira-sol',subtitle:'Llavors que neixen al centre i s’obren en espirals de 21 i 34'},
 {name:'Quasicristall',short:'Quasicristall',subtitle:'Set ones que interfereixen · cada una és una banda del so'},
 {name:'Harmonògraf',short:'Harmonògraf',subtitle:'Dos pèndols dibuixen amb llum · el dibuix s’endinsa'},
 {name:'Paisatge espectral',short:'Paisatge',subtitle:'Serralada de l’espectre · el so d’ara davant, el passat al fons'},
 {name:'Túnel de Chladni',short:'Chladni',subtitle:'Vol a través de plaques de sorra vibrant'},
];
