/* Modo desafio: adivinhar o próximo passo */
let D=null;
const desenhaPts=()=>{$('#dsPts').textContent=`${D.ok} / ${D.tot}`};
function iniciaDesafio(){D={ok:0,tot:0};$('#desafio').hidden=false;$('#dsQ').textContent='';$('#dsOps').innerHTML='';$('#dsFb').textContent='';desenhaPts();perguntar()}
const espia=()=>auto.pos<auto.hist.length?auto.hist[auto.pos]:puxa();
const SEM_Q=['merge','contagem','radix','bogo'];
function ehQ(e){return auto.tipo==='busca'?auto.pos>0:(!SEM_Q.includes(cfg.algo)&&!e.d.length&&(e.h.length===2||(e.h.length===1&&e.p>=0)))}
function perguntar(){
 while(auto){const e=espia();
  if(!e){proxima(1);return}
  if(ehQ(e)&&montaOps(e))return;
  proxima(1)}
}
function montaOps(e){
 const n=pecas.length,bu=auto.tipo==='busca';let cor,cand,q,lab;
 if(bu){const p=auto.hist[auto.pos-1],m=(p.lo+p.hi)>>1;cor=[e.lo,e.hi];lab=(l,h)=>`posições ${l} a ${h}`;
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
