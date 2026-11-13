import {spawn} from 'node:child_process';import {fileURLToPath} from 'node:url';
const file=fileURLToPath(new URL('../Prisma.html',import.meta.url));
const cmd=process.platform==='darwin'?'open':process.platform==='win32'?'explorer.exe':'xdg-open';
const p=spawn(cmd,[file],{stdio:'inherit'});p.on('error',e=>{console.error(e.message+' · Obre Prisma.html directament.');process.exitCode=1});
