(async()=>{
  const base = 'http://localhost:5175';
  try{
    const resIndex = await fetch(base + '/');
    console.log('/ status', resIndex.status);
    const html = await resIndex.text();
    console.log('Index length', html.length);
    console.log("Index contains 'bg-slate-900':", html.includes('bg-slate-900'));

    const cssRes = await fetch(base + '/src/index.css');
    console.log('/src/index.css status', cssRes.status);
    const cssText = await cssRes.text();
    console.log('index.css starts with:', cssText.slice(0,80).replace(/\n/g,' '));

    const mainRes = await fetch(base + '/src/main.tsx');
    console.log('/src/main.tsx status', mainRes.status);
    const mainText = await mainRes.text();
    console.log('main.tsx includes import "./index.css":', mainText.includes("import './index.css'") || mainText.includes('import "./index.css"'));

    process.exit(0);
  }catch(e){ console.error('fetch error', e); process.exit(1); }
})();
