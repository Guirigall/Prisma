import test from 'node:test';import assert from 'node:assert/strict';
import {AudioEngine} from '../dist/audio.js';
class Node{connect(){return this}disconnect(){this.disconnected=true}}
class Context{constructor(){this.currentTime=0;this.sampleRate=48000;this.destination={}}createAnalyser(){return Object.assign(new Node(),{frequencyBinCount:1024,getByteFrequencyData:a=>a.fill(0),getByteTimeDomainData:a=>a.fill(128)})}createGain(){return Object.assign(new Node(),{gain:{value:0,setTargetAtTime(){}}})}createMediaElementSource(){return new Node()}createMediaStreamSource(){return new Node()}async resume(){}close(){}}
class Element{constructor(){this.paused=true}addEventListener(){}pause(){this.paused=true}async play(){this.paused=false}}
globalThis.Audio=Element;globalThis.AudioContext=Context;globalThis.isSecureContext=true;
function setMedia(value){Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:value}})}
function stream(audio=true){const tracks=[{kind:'audio',stopped:false,stop(){this.stopped=true},addEventListener(){}}];if(!audio)tracks[0].kind='video';return {tracks,getTracks:()=>tracks,getAudioTracks:()=>tracks.filter(t=>t.kind==='audio')}}
test('Microphone is analysed without speaker monitoring; cleanup releases tracks',async()=>{const s=stream();setMedia({getUserMedia:async()=>s});const a=new AudioEngine();await a.live('mic');assert.equal(a.mode,'mic');assert.equal(a.output.gain.value,0);a.cleanup();assert.equal(s.tracks[0].stopped,true);assert.equal(a.mode,'idle')});
test('Late microphone permission cannot revive a source after cleanup',async()=>{let grant;setMedia({getUserMedia:()=>new Promise(r=>grant=r)});const a=new AudioEngine();const pending=a.live('mic');await new Promise(r=>setTimeout(r,0));a.cleanup();const s=stream();grant(s);assert.equal(await pending,false);assert.equal(s.tracks[0].stopped,true);assert.equal(a.mode,'idle')});
test('Screen sharing without an audio track is rejected and video is released',async()=>{const s=stream(false);setMedia({getDisplayMedia:async()=>s});const a=new AudioEngine();await assert.rejects(a.live('tab'),/No s’ha compartit àudio/);assert.ok(s.tracks.every(t=>t.stopped));assert.equal(a.mode,'idle')});
test('Permission errors do not create a live source',async()=>{setMedia({getUserMedia:async()=>{throw new Error('denied')}});const a=new AudioEngine();await assert.rejects(a.live('mic'),/denied/);assert.equal(a.mode,'idle');assert.equal(a.stream,null)});
test('Capture picker starts before AudioContext resumes, preserving user activation',async()=>{
 const a=new AudioEngine();let resume,calls=0;const original=a.init.bind(a);
 a.init=async()=>{await original();await new Promise(r=>resume=r)};
 const s=stream();setMedia({getDisplayMedia:()=>{calls++;return Promise.resolve(s)}});
 const pending=a.live('tab');assert.equal(calls,1);
 await new Promise(r=>setTimeout(r,0));a.cleanup();resume();
 assert.equal(await pending,false);assert.equal(s.tracks[0].stopped,true);assert.equal(a.mode,'idle');
});
test('Tab request asks for browser audio and does not silence the source tab',async()=>{
 let constraints;setMedia({getDisplayMedia:async o=>{constraints=o;return stream()}});const a=new AudioEngine();await a.live('tab');
 assert.equal(constraints.video.displaySurface,'browser');assert.equal(constraints.audio.suppressLocalAudioPlayback,false);assert.equal(constraints.selfBrowserSurface,'exclude');assert.equal(a.mode,'tab');a.cleanup();
});
test('A window without audio gives an actionable error and releases every track',async()=>{
 const s=stream(false);s.getVideoTracks=()=>[{getSettings:()=>({displaySurface:'window'})}];setMedia({getDisplayMedia:async()=>s});const a=new AudioEngine();
 await assert.rejects(a.live('tab'),/finestra sense pista de so/);assert.ok(s.tracks.every(t=>t.stopped));
});

test('AudioContext starts in the click before the capture picker resolves',async()=>{
 let grant;const events=[];const a=new AudioEngine();
 setMedia({getDisplayMedia:()=>{events.push('picker');return new Promise(r=>grant=r)}});
 const init=a.init.bind(a);a.init=()=>{events.push('audio');return init()};
 const pending=a.live('tab');
 assert.deepEqual(events,['picker','audio']);assert.ok(a.context);
 grant(stream());assert.equal(await pending,true);a.cleanup();
});
test('Audio initialization failure releases a subsequently granted capture',async()=>{
 let grant;const a=new AudioEngine();a.init=async()=>{throw Error('resume failed')};
 setMedia({getDisplayMedia:()=>new Promise(r=>grant=r)});
 const pending=a.live('tab');await new Promise(r=>setTimeout(r,0));
 const s=stream();grant(s);await assert.rejects(pending,/resume failed/);
 assert.ok(s.tracks.every(t=>t.stopped));assert.equal(a.mode,'idle');assert.equal(a.stream,null);
});
test('Graph connection failure clears the partially installed stream',async()=>{
 const a=new AudioEngine();await a.init();
 a.context.createMediaStreamSource=()=>{throw Error('graph failed')};
 const s=stream();setMedia({getDisplayMedia:async()=>s});
 await assert.rejects(a.live('tab'),/graph failed/);
 assert.ok(s.tracks.every(t=>t.stopped));assert.equal(a.stream,null);assert.equal(a.mode,'idle');
});

// So del sistema: cal trobar l'entrada que porta la sortida (font virtual, monitor o Stereo Mix).
import {pickSystemInput} from '../dist/audio.js';
const input=(label,deviceId=label)=>({kind:'audioinput',label,deviceId});
test('System input prefers the Prisma virtual source, then a real output monitor',()=>{
 assert.equal(pickSystemInput([input('Àudio intern'),input('Monitor of Virtual A2DP Output'),input('Monitor of Àudio intern'),input('Prisma · so del sistema')]).label,'Prisma · so del sistema');
 assert.equal(pickSystemInput([input('Àudio intern'),input('Monitor of Virtual A2DP Output'),input('Monitor of Àudio intern')]).label,'Monitor of Àudio intern');
 assert.equal(pickSystemInput([input('Mescla estèreo (Realtek)')]).label,'Mescla estèreo (Realtek)');
 assert.equal(pickSystemInput([input('Àudio intern'),{kind:'audiooutput',label:'Monitor of x',deviceId:'o'}]),null);
 assert.equal(pickSystemInput([{kind:'audioinput',label:'Prisma',deviceId:'default'}]),null);
});
function systemMedia(devicesAfter,{before=[]}={}){
 const calls=[];let granted=false;
 const media={calls,
  enumerateDevices:async()=>granted?devicesAfter:before,
  getUserMedia:async c=>{calls.push(c);granted=true;const s=stream();const id=c.audio.deviceId?.exact||'mic';s.tracks[0].getSettings=()=>({deviceId:id});s.tracks[0].label=id;return s}};
 setMedia(media);return media;
}
test('System audio asks for permission, finds the monitor and reopens it without echo cancellation',async()=>{
 const m=systemMedia([input('Àudio intern','mic'),input('Monitor of Àudio intern','monitor')]);
 const a=new AudioEngine();assert.equal(await a.live('system'),true);
 assert.equal(a.mode,'system');assert.equal(a.output.gain.value,0);
 assert.equal(m.calls.length,2);assert.equal(m.calls[1].audio.deviceId.exact,'monitor');
 assert.ok(m.calls.every(c=>c.audio.echoCancellation===false&&c.audio.autoGainControl===false));
 assert.equal(a.capture.deviceId,'monitor');a.cleanup();
});
test('System audio opens a known source directly when labels are already visible',async()=>{
 const devices=[input('Àudio intern','mic'),input('Prisma · so del sistema','prisma')];
 const m=systemMedia(devices,{before:devices});const a=new AudioEngine();
 assert.equal(await a.live('system'),true);assert.equal(m.calls.length,1);assert.equal(m.calls[0].audio.deviceId.exact,'prisma');a.cleanup();
});
test('Without any system source the probe is released and the user gets the setup hint',async()=>{
 let probe;const m=systemMedia([input('Àudio intern','mic')]);const original=m.getUserMedia;m.getUserMedia=async c=>(probe=await original(c));
 const a=new AudioEngine();await assert.rejects(a.live('system'),e=>e.name==='SystemAudioMissing'&&/So-del-sistema\.sh/.test(e.message));
 assert.ok(probe.tracks.every(t=>t.stopped));assert.equal(a.mode,'idle');
});
