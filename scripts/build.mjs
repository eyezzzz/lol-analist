import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await build({entryPoints:['src/main.tsx'],bundle:true,minify:true,jsx:'automatic',format:'iife',target:'es2022',outfile:'dist/app.js',loader:{'.tsx':'tsx'},define:{'process.env.NODE_ENV':'"production"'}});
const js=await readFile('dist/app.js','utf8');const css=await readFile('dist/app.css','utf8');
const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Rift Coach</title><style>${css.replaceAll('</style','<\\/style')}</style></head><body><div id="root"></div><script>${js.replaceAll('</script','<\\/script')}</script></body></html>`;
const server=await readFile('src/worker.js','utf8');await writeFile('dist/worker.js',`const HTML=${JSON.stringify(html)};\n${server}`);
