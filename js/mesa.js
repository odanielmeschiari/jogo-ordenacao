/* Mesa: medidas, desenho das peças e contadores */
/* ===== Mesa ===== */
function medidas(n){
 const top=cfg&&cfg.busca?186:(cfg&&cfg.barras?122:82),W=mesa.clientWidth,H=mesa.clientHeight,s1=Math.min(88,(W-60)/n-14);
 if(cfg&&cfg.barras){ // linhas verticais: uma coluna por valor, apoiadas numa linha de base
  const step=Math.min(90,(W-40)/n),g=step>=8?Math.max(2,Math.round(step*.15)):step>=3?1:0;
  Object.assign(G,{size:Math.max(.5,step-g),gap:g,step,cols:n,rows:1,W,H});
  G.x0=(W-step*n+g)/2;G.base=H-32;G.maxH=Math.max(60,G.base-top-10);G.rowY=G.base-G.maxH;return}
 let s,g,c,r;
 if(s1>=34){s=s1;g=14;c=n;r=1}
 else for(s=88;;s--){g=Math.max(3,Math.round(s*.16));c=Math.max(1,Math.floor((W-40+g)/(s+g)));r=Math.ceil(n/c);
  if(r*(s+g)-g<=H-top-28||s<=8)break}
 Object.assign(G,{size:s,gap:g,step:s+g,cols:c,rows:r,W,H});
 G.x0=(W-(Math.min(n,c)*(s+g)-g))/2;G.rowY=r===1?Math.max(top+8,H*.3-s/2):top;
}
const vaga=i=>({x:G.x0+(i%G.cols)*G.step,y:G.rowY+Math.floor(i/G.cols)*G.step});
const rect=p=>p.slot!==null?(cfg.barras?{x:G.x0+p.slot*G.step,y:G.base-p.h}:vaga(p.slot)):{x:p.fx*G.W,y:p.fy*G.H};
const ANIM_FIM={pisca:'ok',giro:'gira',piscaR:'nao',assenta:'assenta'};

let faixas=[],faixaR=null;
function faixa(lo,hi){ // destaca o intervalo restante da busca (uma faixa por linha de peças)
 if(lo==null||hi<lo){faixas.forEach(f=>f.style.opacity=0);return}
 const pad=Math.max(4,Math.round(G.size*.12)),r0=Math.floor(lo/G.cols),r1=Math.floor(hi/G.cols),need=r1-r0+1;
 while(faixas.length<need){const d=document.createElement('div');d.className='faixa';d.style.opacity=0;mesa.insertBefore(d,pecas[0].el);faixas.push(d)}
 faixas.forEach((d,k)=>{
  if(k>=need){d.style.opacity=0;return}
  const r=r0+k,x=Math.max(lo,r*G.cols),y=Math.min(hi,(r+1)*G.cols-1),va=vaga(x),vb=vaga(y);
  Object.assign(d.style,{left:(va.x-pad)+'px',top:(va.y-pad)+'px',width:(vb.x-va.x+G.size+2*pad)+'px',height:(G.size+2*pad)+'px',opacity:1})});
}
function montaMesa(manter){
 stopAuto();cancelaComp();mesa.innerHTML='';faixas=[];faixaR=null;pecas=[];vagasEl=[];idxEl=[];$('#msg').classList.remove('on','err');$('#flash').classList.remove('on');
 DIR=cfg.dir;mesa.classList.toggle('barras',!!cfg.barras);
 if(cfg.gera)sorteia(cfg.gera);
 const T=cfg.torneio;
 if(!manter)velManual=false;
 if(T&&!manter){T.i=0;T.r=0;T.map={};T.acc={};T.fim=false;T.play=true;T.regs=[];cfg.algo=T.lista[0];
  if(cfg.zera){ranking=ranking.filter(r=>r.tipo!==tipoAtual());guarda()}}
 mov=0;comps=0;$('#resumo').hidden=true;$('#sandbox').classList.toggle('comp',!!cfg.comp);$('#rank').hidden=!cfg.comp;
 const n=cfg.vals.length;DIG=Math.max(2,...cfg.vals.map(v=>v.length));medidas(n);
 G.vmax=Math.max(1,...cfg.vals.map(Number));G.vmin=Math.min(...cfg.vals.map(Number));$('#passoTxt').style.top=cfg.busca?'150px':'56px';
 for(let i=0;i<(cfg.barras?0:n);i++){
  const s=document.createElement('div');s.className='vaga';mesa.appendChild(s);vagasEl.push(s);
  const t=document.createElement('div');t.className='idx';t.textContent=i;mesa.appendChild(t);idxEl.push(t);
 }
 cfg.vals.forEach((v,i)=>{
  const el=document.createElement('div');el.className='peca'+(cfg.busca?' virada':'');el.textContent=v;mesa.appendChild(el);
  el.addEventListener('animationend',e=>{const c=ANIM_FIM[e.animationName];if(c)el.classList.remove(c)});
  const p={val:v,el,slot:i,fx:0,fy:0,virada:!!cfg.busca,h:0};ligaArraste(p);pecas.push(p);
 });
 desenha();jaOrd=ordenado();
 $('#btnProx').textContent=T?'Repetir com novos valores':'Próximo competidor';
 if(T){
  $('#btnProx').hidden=true;$('#cron').textContent='0,00 s';
  $('#cNome').textContent=`${NOME[cfg.algo]} (${T.i+1}/${T.lista.length})`+(T.rod>1?` · rodada ${T.r+1}/${T.rod}`:'');renderRank();
  iniciaAuto(!!manter);
 }else if(cfg.algo)iniciaAuto();
 barra();
 if(cfg.comp&&!T)espera();
 mostraAlvo();
}
function desenha(){
 medidas(pecas.length||1);mesa.classList.toggle('pq',!cfg.barras&&G.size<30);
 vagasEl.forEach((s,i)=>{const v=vaga(i);
  Object.assign(s.style,{left:v.x+'px',top:v.y+'px',width:G.size+'px',height:G.size+'px'});
  Object.assign(idxEl[i].style,{left:v.x+'px',top:(v.y+G.size+10)+'px',width:G.size+'px',display:G.rows>1?'none':''})});
 pecas.forEach(p=>{
  if(cfg.barras)p.h=Math.max(2,Math.round(+p.val/G.vmax*G.maxH));
  const r=rect(p),s=p.el.style;
  s.width=G.size+'px';s.height=(cfg.barras?p.h:G.size)+'px';
  s.fontSize=cfg.barras?((G.size>=22&&p.h>=28)?Math.min(G.size*.5,20):0)+'px':(G.size<13?0:G.size*Math.min(.42,.95/DIG))+'px';
  s.left=r.x+'px';s.top=r.y+'px';
  s.background=cfg.barras&&cfg.degrade?corVal(+p.val):''});
 if(faixaR&&!cfg.barras)faixa(faixaR[0],faixaR[1]);
}
window.addEventListener('resize',()=>{if($('#sandbox').classList.contains('ativa')&&pecas.length)desenha()});
function contador(){$('#cont').textContent=(cfg.busca?'Viradas: ':'Movimentos: ')+mov+(cfg.algo?' · Comparações: '+comps:'')}
const emTorneio=()=>!!(cfg&&cfg.torneio&&!cfg.torneio.fim);
function barra(){
 contador();
 $('#ctrlAuto').style.display=(auto||emTorneio())&&!cfg.desafio?'flex':'none';$('#btnCor').hidden=!cfg.barras;$('#btnCor').textContent='Cores: '+(cfg.degrade?'degradê':'desligadas');
 if(!auto&&!cfg.torneio)$('#titulo').textContent=cfg.busca?'Toque nas peças para virá-las.':`Arraste as peças e solte sobre uma vaga. Ordem ${nomeDir()}.`;
}
