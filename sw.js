const CACHE="moto-meter-v-v1.3";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","assets/logo.webp","assets/bike_yellow.webp","assets/bike_red.webp","assets/bike_black.webp","assets/bike_blue.webp","assets/bike_silver.webp","fonts/mmv-seg7.woff"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("moto-meter-v-")&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(new URL(e.request.url).origin!==location.origin)return; // 標高データ（国土地理院）などほかのサイトへの通信は保存しない
  e.respondWith(
    fetch(e.request.url,{cache:"no-cache"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r})
      .catch(()=>caches.match(e.request,{ignoreSearch:true}))
  );
});
