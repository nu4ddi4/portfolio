// Pages Advanced Mode: the same static site in a self-contained deployment.
// Immutable assets are decoded once during isolate startup, never per request.
export function createHandler(input, securityHeaders) {
  const files = new Map(Object.entries(input).map(([path, file]) => {
    const binary = atob(file.value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return [path, { body: bytes, contentType: file.contentType, etag: `"${file.etag}"` }];
  }));
  return {
    fetch(request) {
      if (!['GET', 'HEAD'].includes(request.method)) {
        return new Response('Method not allowed', { status: 405, headers: { ...securityHeaders, Allow: 'GET, HEAD' } });
      }
      let path;
      try { path = decodeURIComponent(new URL(request.url).pathname); }
      catch { return new Response('Bad request', { status: 400, headers: securityHeaders }); }
      if (path.endsWith('/')) path += 'index.html';
      else if (files.has(`${path}/index.html`)) path += '/index.html';
      const match = files.get(path);
      const file = match || files.get('/404.html');
      const status = match ? 200 : 404;
      if (!file) return new Response('Not found', { status: 404, headers: securityHeaders });
      const headers = new Headers(securityHeaders);
      headers.set('Content-Type', file.contentType + (/^(text\/|application\/(javascript|json))/.test(file.contentType) ? '; charset=utf-8' : ''));
      headers.set('Cache-Control', path.startsWith('/assets/') ? 'public, max-age=86400' : 'public, max-age=0, must-revalidate');
      headers.set('ETag', file.etag);
      const suppliedETags = request.headers.get('If-None-Match')?.split(',').map(value => value.trim().replace(/^W\//, '')) || [];
      if (match && (suppliedETags.includes(file.etag) || suppliedETags.includes('*'))) return new Response(null, { status: 304, headers });
      headers.set('Content-Length', String(file.body.byteLength));
      return new Response(request.method === 'HEAD' ? null : file.body, { status, headers });
    },
  };
}
