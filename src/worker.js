export default {
 async fetch(request, env, ctx) {
  if (!ctx.access) return new Response('Acesso privado ainda não configurado.', {status:403,headers:{'Cache-Control':'no-store'}});
  let identity; try {identity = await ctx.access.getIdentity()} catch {return new Response('Não autorizado',{status:403})}
  if (!identity?.email) return new Response('Não autorizado',{status:403});
  const url = new URL(request.url);
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(url.pathname==='/api/data') {
   if(request.method==='GET') {let row=await env.DB.prepare('SELECT data FROM workspace WHERE id = ?').bind('team').first();return Response.json(row?JSON.parse(row.data):null,{headers});}
   if(request.method==='PUT') {
    if(request.headers.get('Origin')!==url.origin) return new Response('Origem inválida',{status:403,headers});
    const contentLength=Number(request.headers.get('Content-Length')||0);if(contentLength>1000000)return new Response('Dados muito grandes',{status:413,headers});
    let data;try{data=await request.json()}catch{return new Response('Dados inválidos',{status:400,headers})};
    if(!data||!Array.isArray(data.items)||typeof data.team!=='string')return new Response('Dados inválidos',{status:400,headers});
    const body=JSON.stringify(data);if(body.length>1000000)return new Response('Dados muito grandes',{status:413,headers});
    await env.DB.prepare('INSERT INTO workspace (id,data) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind('team',body).run();return Response.json({ok:true},{headers});
   }
   return new Response('Método não permitido',{status:405,headers});
  }
  if(request.method!=='GET')return new Response('Método não permitido',{status:405,headers});
  return new Response(HTML,{headers:{...headers,'Content-Type':'text/html; charset=utf-8'}});
 }
};
