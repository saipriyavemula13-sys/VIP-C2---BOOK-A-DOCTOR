const http = require('http');
const hosts = ['localhost','127.0.0.1','::1'];
(async()=>{
  for(const host of hosts){
    const url = `http://${host}:5000/`;
    await new Promise((resolve)=>{
      const req = http.get(url, res=>{
        let b=''; res.on('data', c=>b+=c); res.on('end', ()=>{ console.log('OK', url, res.statusCode); resolve(); });
      });
      req.on('error', e=>{ console.error('ERR', url, e.message); resolve(); });
      req.setTimeout(2000, ()=>{ console.error('TIMEOUT', url); req.destroy(); resolve(); });
    });
  }
})();
