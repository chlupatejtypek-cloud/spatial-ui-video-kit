import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const browserOutput = execFileSync(process.execPath, ['scripts/hf.mjs','browser','path'], { encoding:'utf8' });
const executablePath = browserOutput.trim().split('\n').findLast(line => line.startsWith('/'));
const browser = await puppeteer.launch({ executablePath, headless:true, args:['--no-sandbox','--disable-dev-shm-usage'], defaultViewport:{width:1440,height:960,deviceScaleFactor:1} });
const errors = [], results = [];
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
const test = async (name, callback) => { await callback(); results.push({name,pass:true}); console.log(`✓ ${name}`); };
const settle = async () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const seek = async t => { await page.evaluate(t => window.BlackboardStudio.seek(t),t); await page.waitForFunction(t => Math.abs(window.BlackboardStudio.getState().time-t)<.02 && !window.BlackboardStudio.getState().playing,{},t); await settle(); };
try {
  await fs.mkdir('docs/qa',{recursive:true});
  await page.goto(base,{waitUntil:'networkidle0'});
  await page.waitForFunction(() => window.BlackboardStudio?.getState().ready);
  await test('Studio and sandboxed self-contained composition boot',async()=>assert.equal(await page.$eval('#loading',el=>getComputedStyle(el).display),'none'));
  await seek(.65); await page.screenshot({path:'docs/qa/studio-overview.png'});
  await seek(4.9); await page.screenshot({path:'docs/qa/studio-desktop.png'});
  await test('Play / pause responds to Space',async()=>{
    await page.keyboard.press('Space');
    await page.waitForFunction(()=>window.BlackboardStudio.getState().playing);
    await page.keyboard.press('Space');
    await page.waitForFunction(()=>!window.BlackboardStudio.getState().playing);
  });
  await test('Chapter keyboard navigation',async()=>{
    await page.keyboard.press('3');
    await page.waitForFunction(()=>Math.abs(window.BlackboardStudio.getState().time-13.5)<.02);
    assert.equal(await page.$eval('[data-scene="2"]',el=>el.classList.contains('active')),true);
  });
  await test('Scrubber supports reverse seeking',async()=>{
    await page.$eval('#scrubber',el=>{el.value='8.9';el.dispatchEvent(new Event('input',{bubbles:true}));});
    await page.waitForFunction(()=>Math.abs(window.BlackboardStudio.getState().time-8.9)<.02);
  });
  await test('Exploration, pan, zoom and return to canonical timeline',async()=>{
    await seek(4.9); const camera=await page.evaluate(()=>window.BlackboardStudio.getState().camera);
    await page.click('#mode-explore');
    await page.waitForFunction(()=>window.BlackboardStudio.getState().mode==='explore');
    const stage=await page.$eval('#stage',el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};});
    await page.mouse.move(stage.x+stage.width/2,stage.y+stage.height/2);
    await page.mouse.down();await page.mouse.move(stage.x+stage.width/2+90,stage.y+stage.height/2+30,{steps:6});await page.mouse.up();
    await page.waitForFunction(x=>Math.abs(window.BlackboardStudio.getState().camera.x-x)>20,{},camera.x);
    await page.mouse.wheel({deltaY:-140});
    await page.waitForFunction(z=>window.BlackboardStudio.getState().camera.z>z,{},camera.z);
    await page.click('#zoom-fit');
    await page.waitForFunction(()=>Math.abs(window.BlackboardStudio.getState().camera.z-.385)<.001);
    await page.screenshot({path:'docs/qa/studio-explore.png'});
    await page.click('#mode-play');
    await page.waitForFunction(x=>Math.abs(window.BlackboardStudio.getState().camera.x-x)<.1,{},camera.x);
    assert.equal(Math.round((await page.evaluate(()=>window.BlackboardStudio.getState().camera.z))*100),108);
  });
  await test('Loop and playback speed toggles',async()=>{
    await page.click('#loop-button');assert.equal(await page.$eval('#loop-button',el=>el.getAttribute('aria-pressed')),'false');
    await page.click('#loop-button');await page.click('#speed-button');
    assert.equal(await page.$eval('#speed-button',el=>el.textContent),'1,25×');
  });
  await test('Export menu and keyboard help',async()=>{
    await page.click('#export-button');assert.equal(await page.$eval('#export-menu',el=>el.hidden),false);
    await page.click('#help-button');assert.equal(await page.$eval('#help-dialog',el=>el.open),true);
    await page.keyboard.press('Escape');
  });
  await test('Narrow viewport has no horizontal overflow',async()=>{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});await seek(4.9);
    await page.screenshot({path:'docs/qa/studio-mobile.png'});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  });
  await test('Raw composition has deterministic backward seeking',async()=>{
    const raw=await browser.newPage();raw.on('pageerror',error=>errors.push(error.message));
    await raw.setViewport({width:1920,height:1080,deviceScaleFactor:1});
    await raw.goto(base+'/composition/index.html',{waitUntil:'networkidle0'});
    await raw.evaluate(()=>document.fonts.ready);
    const signature=async time=>raw.evaluate(time=>{window.__timelines.blackboard.pause().time(time,false);return [getComputedStyle(document.querySelector('#world')).transform,getComputedStyle(document.querySelector('#camera-zoom')).transform,document.querySelector('#task-count').textContent,getComputedStyle(document.querySelector('#focus-line')).strokeDashoffset];},time);
    const first=await signature(4.9);await signature(22);const second=await signature(4.9);assert.deepEqual(second,first);
    for(const [name,time] of [['space',.65],['overview',4.9],['workflow',10.7],['analytics',15.9],['detail',20.9]]){
      await signature(time);await raw.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      await raw.screenshot({path:`docs/qa/frame-${name}.png`});
    }
    await raw.close();
  });
  await test('Standalone viewer works offline, including sandboxed child',async()=>{
    const standalone=await browser.newPage();standalone.on('pageerror',error=>errors.push(error.message));
    await standalone.setRequestInterception(true);
    standalone.on('request',req=>{if(req.url().startsWith('http')&&!req.url().endsWith('/blackboard-preview.html'))req.abort();else req.continue();});
    await standalone.goto(base+'/blackboard-preview.html',{waitUntil:'networkidle0'});
    await standalone.waitForFunction(()=>window.BlackboardStudio?.getState().ready);
    await standalone.evaluate(()=>window.BlackboardStudio.seek(20.9));
    await standalone.waitForFunction(()=>Math.abs(window.BlackboardStudio.getState().time-20.9)<.02);
    await standalone.close();
  });
  assert.deepEqual(errors,[],'No JavaScript errors');
  results.push({name:'No browser JavaScript errors',pass:true});
  await fs.writeFile('docs/qa/results.json',JSON.stringify({passed:results.length,results,errors},null,2));
  console.log(`\n${results.length} checks passed.`);
} catch(error){
  await fs.writeFile('docs/qa/results.json',JSON.stringify({results,errors,failure:error.stack},null,2));
  console.error(error);process.exitCode=1;
} finally {await browser.close();}
