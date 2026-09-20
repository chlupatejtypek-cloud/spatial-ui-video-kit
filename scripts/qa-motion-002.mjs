import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=process.cwd();
const output=path.join(root,'revisions/002/qa');
await fs.mkdir(output,{recursive:true});
const pathOutput=execFileSync(process.execPath,['scripts/hf.mjs','browser','path'],{encoding:'utf8'});
const executablePath=pathOutput.trim().split('\n').findLast(line=>line.startsWith('/'));
const browser=await puppeteer.launch({executablePath,headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],defaultViewport:{width:1920,height:1080,deviceScaleFactor:1}});
const page=await browser.newPage(),errors=[],remote=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url());});
async function seek(time){await page.evaluate(time=>{ window.__timelines['motion-002'].pause().time(time,false); },time);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
async function test(name,fn){await fn();results.push({name,pass:true});console.log('✓ '+name);}
async function signature(time){await seek(time);return page.evaluate(()=>{
 const ids=['world','camera-zoom','focus-card','focus-label','optimize-card','insight-surface','chart-content','chart-tip','chart-line','chart-value','result-mark','result-circle','result-check'];
 return Object.fromEntries(ids.map(id=>{const el=document.getElementById(id),s=getComputedStyle(el);return[id,{transform:Array.from(new DOMMatrix(s.transform === 'none' ? undefined : s.transform).toFloat64Array()).map(n=>Math.round(n*1e6)/1e6),opacity:s.opacity,visibility:s.visibility,width:s.width,height:s.height,strokeDashoffset:s.strokeDashoffset,svgTransform:el.getAttribute('transform'),r:el.getAttribute('r'),fillOpacity:el.getAttribute('fill-opacity')}];}));
});}
try{
 await page.goto(pathToFileURL(path.join(root,'revisions/002/composition/index.html')).href,{waitUntil:'networkidle0'});
 await page.bringToFront();
 await page.evaluate(async()=>{ await document.fonts.ready; });
 await test('Pure local film: no external network requests or web UI',async()=>{assert.deepEqual(remote,[]);assert.equal(await page.$('button,input,iframe,nav'),null);});
 await test('No corner brand, scene numbers, slogans or app chrome',async()=>{
  const text=await page.evaluate(()=>document.body.innerText.toLowerCase());
  for(const word of ['blackboard','noda','workspace','insights','compound effect','workflow','ideas into action'])assert.ok(!text.includes(word),word);
 });
 await test('Frame zero contains the project, not an empty stage',async()=>{
  await seek(0);const r=await page.$eval('#project-panel',el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,opacity:getComputedStyle(el).opacity};});
  assert.ok(r.x>0&&r.y>0&&r.x+r.w<1920&&r.y+r.h<1080);assert.equal(r.opacity,'1');
 });
 await test('Backward and nonsequential seeks are deterministic through every morph',async()=>{
  for(const time of [2.25,3.8,5.6,8.4,11.1,14.2,17.8,19.5,21.2]){
   const a=await signature(time);await signature(24);await signature(.2);const b=await signature(time);assert.deepEqual(b,a,'Mismatch at '+time);
  }
 });
 const chartSamples=[];
 await test('Graph tip and drawn path remain aligned at all sampled positions',async()=>{
  for(const t of [12.35,12.8,13.4,14.2,15,15.8,16.4,16.95]){
   await seek(t);
   const sample=await page.evaluate(t=>{
    const line=document.getElementById('chart-line'),tip=document.getElementById('chart-tip');
    const p=Math.max(0,Math.min(1,(t-12.35)/4.6));
    const at=line.getPointAtLength(line.getTotalLength()*p);const expected=new DOMPoint(at.x,at.y).matrixTransform(line.getScreenCTM());
    const actual=new DOMPoint(0,0).matrixTransform(tip.getScreenCTM());
    const s=getComputedStyle(line);
    return{time:t,p,error:Math.hypot(actual.x-expected.x,actual.y-expected.y),x:actual.x,y:actual.y,stroke:s.stroke,opacity:s.opacity,width:s.strokeWidth,dash:Number.parseFloat(s.strokeDashoffset)};
   },t);
   chartSamples.push(sample);assert.ok(sample.error<3,JSON.stringify(sample));
  }
 });
 await test('Graph color, stroke width and opacity never jump during the reveal',async()=>{
  const first=chartSamples[0];for(const s of chartSamples){assert.equal(s.stroke,first.stroke);assert.equal(s.width,first.width);assert.equal(s.opacity,first.opacity);assert.ok(Math.abs(s.dash-(1-s.p))<.001,JSON.stringify(s));}
 });
 await test('Endpoint-to-result handoff has no positional jump',async()=>{
  await seek(18.599);const a=await page.$eval('#chart-tip',el=>{const p=new DOMPoint(0,0).matrixTransform(el.getScreenCTM());return{x:p.x,y:p.y};});
  await seek(18.601);const b=await page.$eval('#result-circle',el=>{const p=new DOMPoint(64,64).matrixTransform(el.getScreenCTM());return{x:p.x,y:p.y};});
  assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.2,JSON.stringify({a,b}));
 });
 await test('Panel proportions vary and obsolete UI retires',async()=>{
  await seek(.8);const initial=await page.$eval('#focus-card',el=>[parseFloat(getComputedStyle(el).width),parseFloat(getComputedStyle(el).height)]);
  await seek(5.6);const compact=await page.$eval('#focus-card',el=>[parseFloat(getComputedStyle(el).width),parseFloat(getComputedStyle(el).height)]);
  assert.deepEqual(initial,[728,88]);assert.deepEqual(compact,[380,240]);
  await seek(17.8);assert.equal(await page.$eval('#project-panel',el=>getComputedStyle(el).opacity),'0');assert.equal(await page.$eval('#optimize-card',el=>getComputedStyle(el).opacity),'0');
  await seek(23);const ready=await page.$eval('#insight-surface',el=>[parseFloat(getComputedStyle(el).width),parseFloat(getComputedStyle(el).height)]);assert.deepEqual(ready,[580,350]);assert.equal(await page.$eval('#chart-content',el=>getComputedStyle(el).opacity),'0');
 });
 const frames=[['project',.8],['focus',2.25],['extraction',4.2],['chain',5.6],['optimize',7.5],['verify',9.55],['chart-start',11.95],['chart-trace',14.2],['chart-end',17.85],['replacement',19.45],['resolution',20.7],['ready',23]];
 const thumbs=[];
 for(let i=0;i<frames.length;i++){
  const[name,time]=frames[i];await seek(time);const filename=path.join(output,`frame-${name}.png`);await page.screenshot({path:filename});
  const image=await sharp(filename).resize(480,270).toBuffer();thumbs.push({input:image,left:(i%3)*480,top:Math.floor(i/3)*270});
 }
 await sharp({create:{width:1440,height:1080,channels:3,background:'#111612'}}).composite(thumbs).png().toFile(path.join(output,'contact-sheet.png'));
 assert.deepEqual(errors,[]);results.push({name:'No browser JavaScript errors',pass:true});
 await fs.writeFile(path.join(output,'tests.json'),JSON.stringify({passed:results.length,results,errors,remote,chartSamples},null,2));
 console.log(`\n${results.length} checks passed. Contact sheet: revisions/002/qa/contact-sheet.png`);
}catch(e){await fs.writeFile(path.join(output,'tests.json'),JSON.stringify({results,errors,remote,failure:e.stack},null,2));console.error(e);process.exitCode=1;}
finally{await browser.close();}
