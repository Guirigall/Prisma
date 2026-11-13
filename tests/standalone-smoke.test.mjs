import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
test('The exact inline HTML starts without module loading or localStorage access',()=>{
 const html=fs.readFileSync(new URL('../Prisma.html',import.meta.url),'utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const nodes=new Map(),presets=[],frames=[];
 function node(tag='DIV'){return {tagName:tag.toUpperCase(),value:'',checked:false,hidden:false,children:[],style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},setAttribute(k,v){this[k]=String(v)},getAttribute(k){return this[k]},addEventListener(){},append(...xs){this.children.push(...xs);if(this.id==='presets')presets.push(...xs)},getContext(t){return t==='2d'?{clearRect(){},fillRect(){}}:null},showModal(){this.open=true},close(){this.open=false}}}
 for(const match of html.matchAll(/<([a-z]+)[^>]*\bid="([^"]+)"[^>]*>/g)){const e=node(match[1]);e.id=match[2];e.min=match[0].match(/\bmin="([^"]+)"/)?.[1];e.max=match[0].match(/\bmax="([^"]+)"/)?.[1];e.value=match[0].match(/\bvalue="([^"]+)"/)?.[1]||'';nodes.set('#'+e.id,e)}
 const document={querySelector:s=>{assert.ok(nodes.has(s),s);return nodes.get(s)},querySelectorAll:s=>s==='.preset'?presets:[],createElement:tag=>node(tag),addEventListener(){},hidden:false,body:node(),activeElement:null};
 class Audio{addEventListener(){}pause(){}}
 const context=vm.createContext({document,Audio,performance:{now:()=>0},matchMedia:()=>({matches:false}),localStorage:{getItem(){throw Error('file storage denied')},setItem(){throw Error('denied')}},ResizeObserver:class{observe(){}},requestAnimationFrame:f=>frames.push(f),addEventListener(){},isSecureContext:true,navigator:{},setTimeout,clearTimeout,setInterval,clearInterval,console});
 assert.doesNotThrow(()=>new vm.Script(script).runInContext(context));assert.equal(context.__prisma.state.mode,'idle');assert.equal(presets.length,13);assert.equal(nodes.get('#sensitivity').value,1.8);assert.equal(nodes.get('#normalise').checked,true);
 assert.doesNotThrow(()=>frames[0](100));context.__prisma.selectPreset(3);assert.equal(nodes.get('#sceneTitle').textContent,'Travessa');nodes.get('#help').onclick();assert.equal(nodes.get('#helpDialog').open,true);
});
