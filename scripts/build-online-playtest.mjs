// Dedicated online playtest: never build the source or production namespace directly.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { isolatePlaytestSave } from './isolate-playtest-save.mjs';

const expectedBranch = 'preview/online-playtest';
if (process.env.VERCEL && process.env.VERCEL_GIT_COMMIT_REF !== expectedBranch) {
  throw new Error('Refused deployment from a non-playtest branch');
}
const root = resolve('playtest');
if (existsSync(root)) throw new Error('Refused to overwrite existing playtest directory');
const sha = process.env.VERCEL_GIT_COMMIT_SHA || execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
if (!/^[a-f0-9]{40}$/i.test(sha)) throw new Error('Missing or invalid Git revision');
mkdirSync(root);
for (const name of ['index.html','chuyen-save.html','asset-manifest.json','css','js','assets']) {
  cpSync(name, join(root,name), {recursive:true, errorOnExist:true, force:false});
}
isolatePlaytestSave(root);
const index=join(root,'index.html');
let html=readFileSync(index,'utf8');
if (!/<title>[^<]*<\/title>/.test(html)) throw new Error('Missing page title');
html=html.replace(/<title>[^<]*<\/title>/,'<title>BPVQ ONLINE PLAYTEST - save thu rieng - '+sha.slice(0,12)+'</title>');
html=html.replace(/((?:href|src)="(?:css|js)\/[^"]+?\.(?:css|js))(?:\?[^"]*)?(")/g,(_,a,b)=>a+'?test='+sha.slice(0,12)+b);
writeFileSync(index,html);
writeFileSync(join(root,'build-info.json'),JSON.stringify({environment:'online-playtest',branch:expectedBranch,commit:sha,saveNamespace:'bpvq_playtest_',release:false},null,2)+'\n');
console.log('Isolated online playtest built from '+sha);
