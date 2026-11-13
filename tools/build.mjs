// Uneix les fonts en un HTML sense imports, fetch, manifest ni service worker.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let html=read('src/index.template.html');
const css=read('dist/style.css');
const scripts=['i18n','analysis','audio','visual','app'].map(name=>read('dist/'+name+'.js').replace(/^import .*?;\s*$/gm,'').replace(/^export /gm,'')).join('\n;\n');
if(/<\/script/i.test(scripts))throw Error('El bundle conté un tancament de script no escapat.');
const icon='data:image/svg+xml;base64,'+Buffer.from(read('dist/icon.svg')).toString('base64');
html=html.replace('href="icon.svg"','href="'+icon+'"').replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>').replace('<script type="module" src="app.js"></script>','<script>\n(()=>{\n"use strict";\n'+scripts+'\n})();\n</script>');
for(const p of ['Prisma.html','dist/index.html'])fs.writeFileSync(path.join(root,p),html);
console.log('Prisma.html i dist/index.html: HTML autònoms ('+Buffer.byteLength(html)+' bytes).');
