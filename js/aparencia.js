/* Aparência: tema de cor + papel de parede */
/* ===== Aparência (tema + papel de parede) ===== */
const WALLS=[['mogno','Mogno'],['lousa','Lousa verde'],['folhas','Tábuas e folhas'],['vermelho','Feltro vermelho'],['azul','Tábuas azuis'],
 ['marinho','Tábuas marinho'],['cafe','Mesa de trabalho'],['feltro','Feltro verde'],['madeira','Madeira escura'],['marmore','Mármore']];
const salvaVisual=()=>{try{localStorage.setItem('mesa-visual',JSON.stringify(visual))}catch(e){}};
function aplicaWall(){
 if(typeof WALL_IMG==='undefined')return;
 if(!WALL_IMG[visual.wall])visual.wall='mogno';
 const s=TEMAS[visual.tema].v.scrim;
 document.body.style.backgroundImage=`linear-gradient(${s},${s}),url("${WALL_IMG[visual.wall]}")`;
}
function marcaAp(){
 document.querySelectorAll('#apTemas .sw').forEach(b=>{const on=b.dataset.id===visual.tema;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
 document.querySelectorAll('#apWalls .wl').forEach(b=>{const on=b.dataset.id===visual.wall;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
}
function montaAp(){
 const T=$('#apTemas'),W=$('#apWalls');
 Object.entries(TEMAS).forEach(([id,t])=>{const b=document.createElement('button');b.type='button';b.className='sw';b.dataset.id=id;
  b.innerHTML=`<i style="background:linear-gradient(135deg,${t.v.t1},${t.v.t3})"></i><span>${t.nome}</span>`;
  b.onclick=()=>{visual.tema=id;salvaVisual();aplicaTema();aplicaWall();marcaAp()};T.appendChild(b)});
 WALLS.forEach(([id,nome])=>{const b=document.createElement('button');b.type='button';b.className='wl';b.dataset.id=id;b.title=nome;
  if(typeof WALL_IMG!=='undefined')b.style.backgroundImage=`url("${WALL_IMG[id]}")`;
  b.innerHTML=`<span>${nome}</span>`;
  b.onclick=()=>{visual.wall=id;salvaVisual();aplicaWall();marcaAp()};W.appendChild(b)});
 marcaAp();
}
function abreAp(btn,ap=$('#ap')){
 (ap.id==='ap'?$('#sp'):$('#ap')).hidden=true;
 if(!ap.hidden){ap.hidden=true;return}
 ap.hidden=false;const r=btn.getBoundingClientRect(),w=ap.offsetWidth;
 ap.style.left=Math.max(12,Math.min(innerWidth-w-12,r.right-w))+'px';
 ap.style.top=Math.max(12,Math.min(r.bottom+8,innerHeight-ap.offsetHeight-12))+'px';
}
document.querySelectorAll('.btnAp').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();abreAp(b)}));
document.addEventListener('click',e=>{['#ap','#sp'].forEach(q=>{const x=$(q);if(!x.hidden&&!x.contains(e.target))x.hidden=true})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#ap').hidden=true;$('#sp').hidden=true}});
document.addEventListener('DOMContentLoaded',()=>{montaAp();aplicaWall()});
