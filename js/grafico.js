/* Gráfico de custo × tamanho da lista */
const GF_N=[10,50,100,500,1000],gfCache={};let gfSel=['bolha','insercao','quick','merge','heap'],gfRaf=0;
function custoDe(nome,n){
 const k=nome+n;if(gfCache[k]!=null)return gfCache[k];
 const d0=DIR;DIR=1;let s=0;
 try{for(const y of gera(nome,embaralha(Array.from({length:n},(_,i)=>String(i+1)))).it){const c=y[2]||[],nc=y[4]||0,cc=y[5];s+=(y[3]!==undefined?y[3]:(c.length?1:0))+(cc!=null?cc:(c.length||nc?0:1))+nc}}finally{DIR=d0}
 return gfCache[k]=s;
}
function montaGfSel(){$('#gfSel').innerHTML=Object.entries(NOMES).filter(([k])=>k!=='bogo').map(([k,v])=>`<label><input type="checkbox" value="${k}"${gfSel.includes(k)?' checked':''}><span>${v}</span></label>`).join('')}
function desenhaGraf(anima){
 const log=$('#gfLog').checked,W=720,Hh=380,L=72,R=150,T=16,B=46,pw=W-L-R,ph=Hh-T-B,ks=Object.keys(NOMES),lista=ks.filter(k=>gfSel.includes(k));
 if(!lista.length){$('#gfBox').innerHTML='<p class="nota">Marque pelo menos um algoritmo.</p>';return}
 const dados=lista.map(k=>({k,i:ks.indexOf(k),pts:GF_N.map(n=>custoDe(k,n))}));
 const mx=Math.max(10,...dados.flatMap(d=>d.pts)),top=log?Math.pow(10,Math.ceil(Math.log10(mx))):mx;
 const X=n=>L+n/1000*pw,Y=c=>T+ph-(log?Math.log10(Math.max(1,c))/Math.log10(top):c/top)*ph,f=x=>Math.round(x).toLocaleString('pt-BR');
 let s=`<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Custo por tamanho da lista"><defs><clipPath id="gfc"><rect id="gfr" x="0" y="0" width="${anima?0:W}" height="${Hh}"/></clipPath></defs>`;
 const tk=log?Array.from({length:Math.round(Math.log10(top))+1},(_,i)=>Math.pow(10,i)):[0,1,2,3,4].map(i=>top*i/4);
 tk.forEach(v=>{const y=Y(v);s+=`<line x1="${L}" x2="${L+pw}" y1="${y}" y2="${y}" style="stroke:rgba(var(--ln),.2)"/><text x="${L-8}" y="${y+4}" text-anchor="end">${f(v)}</text>`});
 GF_N.forEach(n=>{s+=`<text x="${X(n)}" y="${T+ph+20}" text-anchor="middle">${n}</text>`});
 s+=`<text x="${L+pw/2}" y="${Hh-6}" text-anchor="middle">tamanho da lista (n)</text><g clip-path="url(#gfc)">`;
 const lab=[];
 dados.forEach(d=>{const c=`hsl(${(d.i*47+10)%360} 75% 60%)`;
  s+=`<polyline points="${d.pts.map((p,j)=>X(GF_N[j])+','+Y(p)).join(' ')}" fill="none" stroke-width="3" stroke-linejoin="round" style="stroke:${c}"/>`+d.pts.map((p,j)=>`<circle cx="${X(GF_N[j])}" cy="${Y(p)}" r="4" style="fill:${c}"/>`).join('');
  lab.push({d,c,y:Y(d.pts[4])})});
 lab.sort((a,b)=>a.y-b.y);for(let i=1;i<lab.length;i++)if(lab[i].y-lab[i-1].y<15)lab[i].y=lab[i-1].y+15;
 lab.forEach(l=>{s+=`<text x="${L+pw+10}" y="${l.y+4}" style="fill:${l.c};font-weight:700">${NOMES[l.d.k].replace(' sort','')} (${f(l.d.pts[4])})</text>`});
 $('#gfBox').innerHTML=s+'</g></svg>';
 cancelAnimationFrame(gfRaf);
 if(anima){const r=$('#gfr');
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)r.setAttribute('width',W);
  else{const t0=performance.now(),q=t=>{const u=Math.min(1,(t-t0)/2600);r.setAttribute('width',W*(1-Math.pow(1-u,2)));if(u<1)gfRaf=requestAnimationFrame(q)};gfRaf=requestAnimationFrame(q)}}
}
function abreGraf(){['#ap','#sp'].forEach(q=>$(q).hidden=true);if(!$('#gfSel').children.length)montaGfSel();$('#gf').hidden=false;$('#gfx').focus();desenhaGraf(true)}
document.querySelectorAll('.btnGraf').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();abreGraf()}));
$('#gfSel').addEventListener('change',()=>{gfSel=[...document.querySelectorAll('#gfSel input:checked')].map(i=>i.value);desenhaGraf(true)});
$('#gfLog').onchange=()=>desenhaGraf(true);$('#gfAnim').onclick=()=>desenhaGraf(true);
$('#gfx').onclick=()=>{$('#gf').hidden=true};$('#gf').addEventListener('click',e=>{if(e.target===$('#gf'))$('#gf').hidden=true});
