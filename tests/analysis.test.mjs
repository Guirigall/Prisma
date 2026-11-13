import test from 'node:test';import assert from 'node:assert/strict';
import {bandEnergy,Pulse,PRESETS,clamp} from '../dist/analysis.js';
test('Frequency bands separate bass and high bins at real sample rates',()=>{const bins=new Uint8Array(1024);bins[5]=255;assert.ok(bandEnergy(bins,48000,2048,35,220)>0);assert.equal(bandEnergy(bins,48000,2048,2500,12000),0);assert.equal(bandEnergy(bins,48000,2048,30000,40000),0)});
test('Beat detection has a refractory period and decays over time',()=>{const p=new Pulse();assert.ok(p.update(.8,0,.016)>.9);assert.equal(p.beat,true);p.update(.9,.1,.1);assert.equal(p.beat,false);const before=p.value;p.update(0,.2,.1);assert.ok(p.value<before);assert.equal(p.update(0,2,1)<.01,true)});
test('Thirteen named presets and bounded numeric settings',()=>{assert.equal(PRESETS.length,13);assert.equal(new Set(PRESETS.map(p=>p.name)).size,13);assert.ok(['Paisatge espectral','Túnel de Chladni','Harmonògraf','Gira-sol de Fibonacci','Quasicristall'].every(n=>PRESETS.some(p=>p.name===n)));assert.equal(clamp(-1),0);assert.equal(clamp(4,.2,2),2)});
import {ReactiveEnvelope} from '../dist/analysis.js';
test('Short musical attacks produce an immediate response rather than a slow fade',()=>{const env=new ReactiveEnvelope(),spectrum=new Uint8Array(1024).fill(180);const b=env.update({bass:.5,mid:.25,high:.1,rms:.12},spectrum,0,1/60,{sensitivity:1.8,release:.18,normalise:false});assert.ok(b.bass>.45);assert.ok(b.pulse>.8)});
test('Sensitivity is adjustable and increases response without hard clipping',()=>{const raw={bass:.15,mid:.1,high:.05,rms:.06},spectrum=new Uint8Array(1024).fill(100);const low=new ReactiveEnvelope().update(raw,spectrum,0,.1,{sensitivity:.3,normalise:false});const high=new ReactiveEnvelope().update(raw,spectrum,0,.1,{sensitivity:4,normalise:false});assert.ok(high.bass>low.bass*4);assert.ok(high.bass<1)});
test('Normalisation helps quiet audio but never amplifies a silent source',()=>{const raw={bass:.15,mid:.1,high:.05,rms:.008},s=new Uint8Array(1024).fill(70);const a=new ReactiveEnvelope(),b=new ReactiveEnvelope();let x,y;for(let i=0;i<240;i++){x=a.update(raw,s,i/60,1/60,{sensitivity:1,normalise:true});y=b.update(raw,s,i/60,1/60,{sensitivity:1,normalise:false})}assert.ok(x.bass>y.bass*3);for(let i=240;i<360;i++)x=a.update({bass:.8,mid:.8,high:.8,rms:0},s,i/60,1/60);assert.ok(x.bass<.001);assert.equal(x.inputRms,0)});
test('Release controls the persistence of the audio envelope',()=>{const fast=new ReactiveEnvelope(),slow=new ReactiveEnvelope(),s=new Uint8Array(1024).fill(100),raw={bass:.5,mid:.5,high:.5,rms:.1};fast.update(raw,s,0,.1,{release:.08});slow.update(raw,s,0,.1,{release:.8});const silence={bass:0,mid:0,high:0,rms:0};const a=fast.update(silence,s,1,.2,{release:.08}),b=slow.update(silence,s,1,.2,{release:.8});assert.ok(b.bass>a.bass*4)});

test('Sustained bass settles while midrange attacks still trigger beats',()=>{
 const env=new ReactiveEnvelope(),s=new Uint8Array(1024);let baseline;
 for(let i=0;i<300;i++)baseline={...env.update({bass:.8,mid:.1,high:.1,rms:.3},s,i/60,1/60,{normalise:false,rhythm:1})};
 assert.ok(baseline.bass<.01);assert.ok(baseline.pulse<.01);
 const attack=env.update({bass:.8,mid:.5,high:.1,rms:.3},s,5,1/60,{normalise:false,rhythm:1});
 assert.ok(attack.pulse>.8);assert.ok(attack.mid>.3);
});
test('Band controls mute their visual contribution and beat influence',()=>{
 const env=new ReactiveEnvelope(),s=new Uint8Array(1024);
 const b=env.update({bass:.9,mid:0,high:0,rms:.2},s,0,.016,{bassGain:0});
 assert.equal(b.bass,0);assert.equal(b.pulse,0);
});

// Traduccions: cada text català de la interfície i del codi ha de tenir versió castellana i anglesa.
import fs from 'node:fs';
import {CATALAN_KEYS} from '../dist/i18n.js';
test('Every Catalan string used in the template and code has Spanish and English translations',()=>{
 const keys=new Set(CATALAN_KEYS),missing=[];
 for(const f of ['app','audio','visual'])for(const m of fs.readFileSync(new URL('../dist/'+f+'.js',import.meta.url),'utf8').matchAll(/\bt\('((?:[^'\\]|\\.)*)'/g))if(!keys.has(m[1]))missing.push(m[1]);
 for(const p of PRESETS)for(const k of [p.name,p.short,p.subtitle])if(!keys.has(k)&&!['Aurora','Julia','Mandelbrot','Chladni'].includes(k))missing.push(k);
 const html=fs.readFileSync(new URL('../src/index.template.html',import.meta.url),'utf8').replace(/<code>[\s\S]*?<\/code>|<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>/g,'<x>');
 for(const m of html.matchAll(/>([^<>]+)</g)){const k=m[1].trim();if(/[A-Za-zÀ-ÿ]{2}/.test(k)&&!keys.has(k)&&!['PRISMA','20 s','40 s','60 s','180 ms','— FPS'].includes(k))missing.push(k)}
 for(const m of html.matchAll(/(?:aria-label|title)="([^"]+)"/g))if(!keys.has(m[1]))missing.push(m[1]);
 assert.deepEqual(missing,[]);
});
