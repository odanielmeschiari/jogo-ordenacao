/* Competição: cronômetro, ranking e exportação em CSV */
/* ===== Competição ===== */
let comp=null,ranking=[],crit='ms';
try{ranking=JSON.parse(localStorage.getItem('mesa-ranking')||'[]')}catch(e){}
try{const c=localStorage.getItem('mesa-crit');crit=c==='mov'||c==='cmp'?c:'ms'}catch(e){}
ranking=ranking.filter(r=>r.tipo);
const tipoAtual=()=>cfg.busca?'buscar':'ordenar';
const BIG=1e12;
const kv=(r,c)=>c==='mov'?(r.mov??BIG):c==='cmp'?(r.cmp??BIG):r.ms;
const fn=x=>x==null?'—':(+x).toLocaleString('pt-BR',{maximumFractionDigits:1});
const vTxt=r=>crit==='mov'?fn(r.mov):crit==='cmp'?fn(r.cmp):fmt(r.ms);
const cmpRank=(a,b)=>kv(a,crit)-kv(b,crit)||a.ms-b.ms||(a.mov??BIG)-(b.mov??BIG);
const lista=()=>ranking.filter(r=>r.tipo===tipoAtual()).sort(cmpRank);
const guarda=()=>{try{localStorage.setItem('mesa-ranking',JSON.stringify(ranking))}catch(e){}};
const fmt=ms=>(ms/1000).toFixed(2).replace('.',',')+' s';
const unid=(n,busca)=>busca?(n===1?'virada':'viradas'):(n===1?'movimento':'movimentos');
const bloqueado=()=>!!cfg.comp&&(!comp||comp.estado!=='rodando');
function cancelaComp(){if(comp){cancelAnimationFrame(comp.raf);clearTimeout(comp.tm)}comp=null;$('#ov').hidden=true}
const rotComp=()=>comp.nome+(cfg.rod>1?` · rodada ${comp.r+1}/${cfg.rod}`:'');
function espera(prox){ // prox: o mesmo competidor segue para a próxima rodada (vai direto à contagem)
 comp={estado:'espera',r:0,acc:{ms:[],mov:[]},aus:false};$('#ov').hidden=false;$('#ovBox').hidden=false;$('#ovCount').hidden=true;
 $('#nome').value='';$('#cNome').textContent='';$('#cron').textContent='0,00 s';$('#btnProx').hidden=true;
 renderRank();
 if(prox){Object.assign(comp,prox);$('#cNome').textContent=rotComp();contagem();return}
 setTimeout(()=>$('#nome').focus(),60);
}
function comeca(){
 if(!comp||comp.estado!=='espera')return;
 comp.nome=$('#nome').value.trim()||'Competidor '+(lista().length+1);$('#cNome').textContent=rotComp();
 contagem();
}
function contagem(){
 comp.estado='contagem';$('#ovBox').hidden=true;
 const c=$('#ovCount');c.hidden=false;let n=3;c.textContent=n;sContagem(false);
 const passo=()=>{n--;
  if(n>0){c.textContent=n;sContagem(false);comp.tm=setTimeout(passo,800)}
  else{sContagem(true);c.hidden=true;$('#ov').hidden=true;comp.estado='rodando';comp.t0=performance.now();mostraAlvo();loop()}};
 comp.tm=setTimeout(passo,800);
}
function mostraAlvo(){
 const v=cfg.busca&&cfg.alvo!==''&&!(cfg.comp&&comp&&(comp.estado==='espera'||comp.estado==='contagem'));
 $('#alvoGrande').hidden=!v;$('#alvoNum').textContent=cfg.alvo;
 const aus=!!cfg.algo&&cfg.busca&&cfg.alvo!==''&&!cfg.vals.includes(cfg.alvo);
 $('#ultima').textContent=aus?'⚠ Valor fora da lista':'';$('#ultima').classList.toggle('av',aus);
}
function loop(){$('#cron').textContent=fmt(performance.now()-comp.t0);comp.raf=requestAnimationFrame(loop)}
function termina(){
 if(!comp||comp.estado!=='rodando')return;
 cancelAnimationFrame(comp.raf);const ms=performance.now()-comp.t0;comp.estado='fim';$('#cron').textContent=fmt(ms);
 const rod=cfg.rod||1,A=comp.acc;
 A.ms.push(ms);A.mov.push(mov);comp.aus=comp.aus||!!(cfg.busca&&!cfg.vals.includes(cfg.alvo));
 $('#msg').textContent+=' · '+fmt(ms)+' · '+mov+' '+unid(mov,cfg.busca);
 if(A.ms.length<rod){$('#btnProx').textContent=`Rodada ${A.ms.length+1} de ${rod}`;$('#btnProx').hidden=false;return} // o ranking só recebe o competidor depois da última rodada
 const av=x=>x.reduce((q,y)=>q+y,0)/x.length,mm=rod>1?Math.round(av(A.mov)*10)/10:mov;
 const reg={nome:comp.nome,ms:av(A.ms),mov:mm,tipo:tipoAtual(),id:Date.now(),aus:comp.aus,rod};ranking.push(reg);guarda();renderRank();
 if(rod>1)$('#msg').textContent+=` · média de ${rod} rodadas: ${fmt(reg.ms)} · ${fn(mm)} ${unid(mm,cfg.busca)}`;
 $('#btnProx').textContent='Próximo competidor';$('#btnProx').hidden=false;
}
function renderRank(){
 const l=$('#rankLista'),L=lista(),b=cfg.busca;l.innerHTML='';
 $('#rankTitulo').textContent='Ranking · '+(b?'busca':'ordenação');
 $('#critMov').textContent=b?'Viradas':'Movimentos';
 document.querySelectorAll('#rank .crit button').forEach(x=>x.classList.toggle('on',x.dataset.c===crit));
 if(!L.length){l.innerHTML='<li>Ninguém ainda.</li>';return}
 L.forEach((r,i)=>{const li=document.createElement('li');
  const a=document.createElement('span');a.textContent=`${i+1}º ${r.nome}`;
  const v=document.createElement('b');v.textContent=vTxt(r);li.append(a,v);
  const pt=[];if(crit!=='ms')pt.push(fmt(r.ms));if(crit!=='mov'&&r.mov!=null)pt.push(`${fn(r.mov)} ${unid(r.mov,r.tipo==='buscar')}`);if(crit!=='cmp'&&r.cmp!=null)pt.push(`${fn(r.cmp)} comp.`);
  if(r.rod>1)pt.push(`média de ${r.rod} rodadas`);else if(r.alg)pt.push('automático');if(r.aus)pt.push('valor ausente');
  if(pt.length){const m=document.createElement('small');m.textContent=pt.join(' · ');li.appendChild(m)}
  l.appendChild(li)});
}
document.querySelectorAll('#rank .crit button').forEach(x=>x.onclick=()=>{
 crit=x.dataset.c;try{localStorage.setItem('mesa-crit',crit)}catch(e){}
 renderRank();if(cfg.torneio&&cfg.torneio.fim&&!$('#resumo').hidden&&cfg.torneio.regs.length)torneioResumo();
});
$('#btnComecar').onclick=comeca;
$('#nome').addEventListener('keydown',e=>{if(e.key==='Enter')comeca()});
$('#btnProx').onclick=()=>{if(cfg.torneio&&cfg.gerA)Object.assign(cfg,novoConjunto(cfg.gerA));
 const c=comp,prox=c&&c.estado==='fim'&&c.r+1<(cfg.rod||1)?{nome:c.nome,r:c.r+1,acc:c.acc,aus:c.aus}:null; // próxima rodada do mesmo competidor
 montaMesa(false,prox)};
let confT=null;
$('#btnLimpaRank').onclick=()=>{const b=$('#btnLimpaRank');
 if(!confT){b.textContent='Toque de novo para confirmar';confT=setTimeout(()=>{confT=null;b.textContent='Limpar ranking'},3000);return}
 clearTimeout(confT);confT=null;b.textContent='Limpar ranking';
 ranking=ranking.filter(r=>r.tipo!==tipoAtual());guarda();renderRank()};

$('#btnCsv').onclick=()=>{
 const rows=[['posicao','nome','tempo_s','movimentos','comparacoes','automatico','rodadas']];
 lista().forEach((r,i)=>rows.push([i+1,r.nome,(r.ms/1000).toFixed(3),r.mov??'',r.cmp??'',r.alg?'sim':'nao',r.rod||1]));
 const csv=rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(';')).join('\n'),a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download='ranking-'+tipoAtual()+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};
