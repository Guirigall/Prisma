import {spawn} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const executable=process.env.PRISMA_CHROME||'/var/lib/flatpak/app/com.google.Chrome/current/active/files/extra/chrome';
const chrome=spawn(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run','--disable-breakpad','--disable-crash-reporter','--disable-background-networking','--user-data-dir=/tmp/prisma-chrome-profile','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--remote-debugging-pipe'],{stdio:['ignore','ignore','pipe','pipe','pipe'],env:{...process.env,XDG_CONFIG_HOME:'/tmp/prisma-chrome-config'}});
for(const pipe of [chrome.stdio[3],chrome.stdio[4]])pipe.on('error',()=>{});
let serial=0,buffer='',stderr='';const pending=new Map();chrome.stderr.on('data',d=>stderr+=d);chrome.stdio[4].on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\0'))>=0){const item=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!item)continue;let r;try{r=JSON.parse(item)}catch{continue}if(r.id&&pending.has(r.id)){const {resolve,reject,timer}=pending.get(r.id);clearTimeout(timer);pending.delete(r.id);r.error?reject(Error(JSON.stringify(r.error))):resolve(r.result)}}});
chrome.on('exit',code=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Chrome exited '+code+' '+stderr.slice(-1500)))}pending.clear()});
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error('Timeout '+method+' '+stderr.slice(-600)))},30000);pending.set(id,{resolve,reject,timer});chrome.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0')})}
let session;
async function evaluate(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true},session);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{
 const version=await call('Browser.getVersion');const target=await call('Target.createTarget',{url:'about:blank'});session=(await call('Target.attachToTarget',{targetId:target.targetId,flatten:true})).sessionId;await call('Page.enable',{},session);await call('Runtime.enable',{},session);await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false},session);
 await call('Page.addScriptToEvaluateOnNewDocument',{source:"window.__errors=[];addEventListener('error',e=>__errors.push(e.message));addEventListener('unhandledrejection',e=>__errors.push(String(e.reason)));"},session);
 await call('Page.navigate',{url:pathToFileURL(path.join(ROOT,'Prisma.html')).href},session);await sleep(3000);
 const initial=await evaluate('({state:window.__prisma?.state,error:document.querySelector("#canvasError").textContent,errors:window.__errors,overflow:document.documentElement.scrollWidth>innerWidth})');
 if(!initial.state?.webgl||initial.state.frames<3||initial.errors.length)throw Error('Initial: '+JSON.stringify(initial));
 await evaluate('document.querySelector("#auto").checked=false');
 const modes=[];for(let i=0;i<13;i++){await evaluate(`__prisma.selectPreset(${i})`);await sleep(300);modes.push(await evaluate('__prisma.state.preset'))}
 await evaluate('__prisma.selectPreset(0)');await sleep(700);
 let shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},session);fs.mkdirSync(path.join(ROOT,'docs'),{recursive:true});fs.writeFileSync(path.join(ROOT,'docs/desktop.png'),Buffer.from(shot.data,'base64'));
 // Pista real de Web Audio; només el selector de permisos es substitueix.
 await evaluate(`(async()=>{
  const ctx=new AudioContext();await ctx.resume();const oscillator=ctx.createOscillator();
  const destination=ctx.createMediaStreamDestination();oscillator.frequency.value=110;
  oscillator.connect(destination);oscillator.start();
  const original=navigator.mediaDevices.getDisplayMedia;
  window.__captureTest={ctx,oscillator,stream:destination.stream,original};
  navigator.mediaDevices.getDisplayMedia=()=>new Promise(resolve=>setTimeout(()=>resolve(destination.stream),350));
  document.querySelector('#tabAudio').click();
 })()`);
 await sleep(1200);const capture=await evaluate('__prisma.state');
 if(capture.mode!=='tab'||capture.bands.inputRms<=.01)throw Error('Live stream analysis: '+JSON.stringify(capture));
 await evaluate(`document.querySelector('#tabAudio').click()`);
 const released=await evaluate(`__captureTest.stream.getTracks().every(t=>t.readyState==='ended')`);
 if(!released)throw Error('Capture tracks not released');
 await evaluate(`navigator.mediaDevices.getDisplayMedia=__captureTest.original;__captureTest.oscillator.stop();__captureTest.ctx.close();delete window.__captureTest`);
 await evaluate('document.querySelector("#demo").click()');await sleep(1000);const demo=await evaluate('__prisma.state');if(demo.mode!=='demo'||demo.bands.rms<=.001)throw Error('Demo audio: '+JSON.stringify(demo));
 await evaluate('document.querySelector("#demo").click()');if((await evaluate('__prisma.state.mode'))!=='idle')throw Error('Demo failed to stop');
 // WAV local: senyal generat per la prova, cap música de tercers.
 const rate=22050,frames=rate*8,pcm=Buffer.alloc(frames*2);for(let i=0;i<frames;i++)pcm.writeInt16LE(Math.round(Math.sin(2*Math.PI*110*i/rate)*10000),i*2);const wav=Buffer.alloc(44+pcm.length);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length,40);pcm.copy(wav,44);fs.writeFileSync('/tmp/prisma-test.wav',wav);
 const root=await call('DOM.getDocument',{},session);const input=await call('DOM.querySelector',{nodeId:root.root.nodeId,selector:'#file'},session);await call('DOM.setFileInputFiles',{nodeId:input.nodeId,files:['/tmp/prisma-test.wav']},session);await sleep(700);const file=await evaluate('__prisma.state');if(file.mode!=='file'||file.bands.rms<=.001)throw Error('File playback: '+JSON.stringify(file));
 await evaluate('document.querySelector("#play").click()');const paused=await evaluate('document.querySelector("#play").getAttribute("aria-label")');if(paused!=='Reprodueix')throw Error('Pause failed');
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},session);await sleep(500);const overflow=await evaluate('document.documentElement.scrollWidth>innerWidth');if(overflow)throw Error('Mobile horizontal overflow');shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},session);fs.writeFileSync(path.join(ROOT,'docs/mobile.png'),Buffer.from(shot.data,'base64'));
 await evaluate('document.querySelector("#help").click()');if(!await evaluate('document.querySelector("#helpDialog").open'))throw Error('Help did not open');await evaluate('document.querySelector("#closeHelp").click()');
 const errors=await evaluate('__errors');if(errors.length)throw Error('Page errors '+JSON.stringify(errors));
 const report={browser:version.product,source:'standalone file:// HTML, no module file-access override',webgl:true,presets:modes,demoRms:demo.bands.rms,fileRms:file.bands.rms,filePause:true,mobileOverflow:overflow,help:true,errors,microphone:'not tested on physical hardware',liveStreamRms:capture.bands.inputRms,captureTracksReleased:released,autoplayOverride:false,tabCapture:'synthetic audio stream tested; actual picker permission not tested',serviceWorker:'not tested from file://'};fs.writeFileSync(path.join(ROOT,'docs/browser-check.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{if(chrome.exitCode===null&&chrome.signalCode===null){await call('Browser.close').catch(()=>{});chrome.kill()}}
