const V='tqm-v1';
const FILES=["./", "index.html", "listen.html", "items.json", "manifest.json", "audio/10a.mp3", "audio/10q.mp3", "audio/11a.mp3", "audio/11q.mp3", "audio/12a.mp3", "audio/12q.mp3", "audio/13a.mp3", "audio/13q.mp3", "audio/14a.mp3", "audio/14q.mp3", "audio/15a.mp3", "audio/15q.mp3", "audio/16a.mp3", "audio/16q.mp3", "audio/17a.mp3", "audio/17q.mp3", "audio/18a.mp3", "audio/18q.mp3", "audio/19a.mp3", "audio/19q.mp3", "audio/1a.mp3", "audio/1q.mp3", "audio/20a.mp3", "audio/20q.mp3", "audio/2a.mp3", "audio/2q.mp3", "audio/3a.mp3", "audio/3q.mp3", "audio/4a.mp3", "audio/4q.mp3", "audio/5a.mp3", "audio/5q.mp3", "audio/6a.mp3", "audio/6q.mp3", "audio/7a.mp3", "audio/7q.mp3", "audio/8a.mp3", "audio/8q.mp3", "audio/9a.mp3", "audio/9q.mp3"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  e.respondWith((async()=>{
    const hit=await caches.match(r,{ignoreSearch:true});
    if(!hit){try{return await fetch(r)}catch(_){return new Response('offline',{status:503})}}
    const range=r.headers.get('range');
    if(!range)return hit;
    // Safari 播放音频要求支持 Range 分段请求
    const buf=await hit.arrayBuffer();
    const m=/bytes=(\d*)-(\d*)/.exec(range);
    let s=m[1]?parseInt(m[1]):0, en=m[2]?parseInt(m[2]):buf.byteLength-1;
    if(en>=buf.byteLength)en=buf.byteLength-1;
    return new Response(buf.slice(s,en+1),{status:206,headers:{'Content-Type':hit.headers.get('Content-Type')||'audio/mpeg','Content-Range':`bytes ${s}-${en}/${buf.byteLength}`,'Content-Length':en-s+1}});
  })());
});
