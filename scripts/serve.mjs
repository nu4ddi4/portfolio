import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { build, root } from './build.mjs';

await build();
const directory = resolve(root,'dist');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.json':'application/json'};
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';
const server = createServer(async (request,response) => {
  try {
    if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405,{Allow:'GET, HEAD'}).end(); return; }
    const path = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let file = resolve(directory,`.${path}`);
    if (file !== directory && !file.startsWith(directory+sep)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file,'index.html');
    const body = await readFile(file);
    response.writeHead(200,{'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('페이지를 찾을 수 없습니다.'); }
});
server.listen(port,host,() => console.log(`Portfolio preview: http://localhost:${port}`));
let timer;
let building = Promise.resolve();
if (!process.argv.includes('--production')) watch(resolve(root,'public'),{recursive:true},() => {
  clearTimeout(timer); timer=setTimeout(() => { building = building.then(build).catch(console.error); },150);
});
