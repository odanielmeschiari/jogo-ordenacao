/* Modo desafio: adivinhar o próximo passo */
let D=null;
const desenhaPts=()=>{$('#dsPts').textContent=`${D.ok} / ${D.tot}`};
function iniciaDesafio(){D={ok:0,tot:0};$('#desafio').hidden=false;$('#dsQ').textContent='';$('#dsOps').innerHTML='';$('#dsFb').textContent='';desenhaPts();perguntar()}
const espia=()=>auto.pos<auto.hist.length?auto.hist[auto.pos]:puxa();
const FASES_Q=['conta','fixa','poe','checa']; // passos de contagem/radix/bogo (marcados em algoritmos.js) que viram pergunta
/* Merge sort (e a fase de intercalação do Tim sort): o passo "Vai intercalar a faixa X–Y" (sem peças movidas ainda) é a pergunta. */
const ehMerge=e=>!e.dc&&!e.d.length&&((cfg.algo==='merge'&&e.h.length>=2)||(cfg.algo==='tim'&&e.h.length>2));
function ehQ(e){if(auto.tipo==='busca')return auto.pos>0;if(['contagem','radix','bogo'].includes(cfg.algo))return FASES_Q.includes(e.fase);if(cfg.algo==='merge')return ehMerge(e);return !e.d.length&&(ehMerge(e)||e.h.length===2||(e.h.length===1&&e.p>=0))}
function perguntar(){
 while(auto){const e=espia();
  if(!e){proxima(1);return}
  if(ehQ(e)&&montaOps(e))return;
  proxima(1)}
}
function montaOps(e){
 const n=pecas.length,bu=auto.tipo==='busca';let cor,cand,q,lab;
 if(!bu&&e.fase==='checa'){ // bogo: depois de embaralhar, a lista ficou ordenada por sorte?
  const ord=pecas.every((_,s)=>!s||DIR*(+pecas[auto.A[s-1]].val-+pecas[auto.A[s]].val)<=0);
  cor=[ord?1:0];lab=x=>x?'Sim, ficou ordenada':'Não, ainda está desordenada';cand=[[ord?0:1]];
  q='Depois desse embaralhamento, a lista ficou ordenada?'}
 else if(!bu&&e.fase==='conta'){ // contagem/radix: leitura peça a peça
  const i=e.h[0];cor=[i];lab=s=>`posição ${s} (peça ${pecas[auto.A[s]].val})`;
  cand=[[i+1],[i-1],[i+2],[i-2]].filter(([s])=>s>=0&&s<n);
  q='Qual peça será lida agora para anotar na contagem?'}
 else if(!bu&&(e.fase==='fixa'||e.fase==='poe')){ // contagem/radix: posicionamento
  const k=e.h[0],src=e.h.length===2?e.h[1]:k,val=s=>pecas[auto.A[s]].val,vistos=new Set([String(val(src))]);cand=[];
  for(let s=k;s<n;s++)if(s!==src&&!vistos.has(String(val(s)))){vistos.add(String(val(s)));cand.push([s])}
  cor=[src];lab=s=>`peça ${val(s)} (posição ${s})`;
  q=`Qual peça vai para a posição ${k} agora?`}
 else if(!bu&&ehMerge(e)){const lo=e.h[0],hi=e.h[e.h.length-1],mid=(lo+hi)>>1,t=hi-lo+1;cor=[lo,hi];lab=(a,b)=>`faixa ${a}–${b}`;
  cand=[[lo,mid],[mid+1,hi],[lo,hi-1],[lo+1,hi],[lo,hi+1],[lo-1,hi],[lo,hi+t],[lo-t,hi]].filter(([a,b])=>b-a>=1&&a>=0&&b<n);
  q='Qual faixa será intercalada (merge) agora?'}
 else if(bu){const p=auto.hist[auto.pos-1],m=(p.lo+p.hi)>>1;cor=[e.lo,e.hi];lab=(l,h)=>`posições ${l} a ${h}`;
  cand=[[p.lo,m-1],[m+1,p.hi],[p.lo+1,p.hi],[p.lo,p.hi-1],[p.lo,p.i-1],[p.i+1,p.hi]].filter(([l,h])=>l<=h&&l>=0&&h<n);
  q=`Alvo ${cfg.alvo}. Acabou de ler ${pecas[p.i].val}. Qual será o próximo intervalo de busca?`}
 else{const P=(e.h.length===1?[e.h[0],e.p]:e.h.slice()).sort((x,y)=>x-y);cor=P;lab=(a,b)=>`posições ${a} e ${b}`;
  cand=[[P[0]+1,P[1]+1],[P[0]-1,P[1]-1],[P[0]-1,P[1]],[P[0],P[1]+1],[P[0]+1,P[1]],[P[0],P[1]-1]].filter(([a,b])=>a<b&&a>=0&&b<n);
  q='Quais peças serão comparadas agora?'}
 const key=x=>x.join(),seen=new Set([key(cor)]),pool=[];
 embaralha(cand).forEach(x=>{if(!seen.has(key(x))){seen.add(key(x));pool.push(x)}});
 const ops=embaralha([cor,...pool.slice(0,2)]);if(ops.length<2)return false;
 $('#dsQ').textContent=q;$('#dsFb').textContent='';const box=$('#dsOps');box.innerHTML='';
 ops.forEach(o=>{const b=document.createElement('button');b.className='sec';b.textContent=lab(...o);b.onclick=()=>responde(b,key(o)===key(cor),lab(...cor));box.appendChild(b)});
 return true;
}
function responde(b,ok,certa){
 if(!D||b.parentNode.firstChild.disabled)return;
 [...$('#dsOps').children].forEach(x=>x.disabled=true);D.tot++;if(ok)D.ok++;b.classList.add(ok?'certa':'errada');desenhaPts();
 $('#dsFb').textContent=ok?'✔ Acertou! +1 ponto':'✘ Não foi dessa vez. Era: '+certa;
 if(ok)tom(880,.14,.15,0,'triangle');else tom(200,.25,.15,0,'sawtooth');
 const ia=auto;setTimeout(()=>{if(auto===ia){proxima(1);if(auto===ia)perguntar()}},ok?800:1700);
}
$('#dsParar').onclick=()=>$('#btnParar').click();
