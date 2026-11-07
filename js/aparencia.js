/* Aparência: tema de cor + papel de parede */
/* ===== Aparência (tema + papel de parede) ===== */
const WALLS=[['mogno','Mogno'],['lousa','Lousa verde'],['folhas','Tábuas e folhas'],['vermelho','Feltro vermelho'],['azul','Tábuas azuis'],
 ['marinho','Tábuas marinho'],['cafe','Mesa de trabalho'],['feltro','Feltro verde'],['madeira','Madeira escura'],['marmore','Mármore'],
 ['cidade','Cidade futurista'],['estrada','Estrada na chuva'],['gotas','Gotas na folha'],['lago','Lago e montanha'],['neblina','Floresta com neblina'],['estrelas','Árvore sob estrelas'],['moraine','Lago Moraine'],['flores','Campo de flores'],
 ['lagoverde','Lago verde na neblina'],['nebulosa','Nebulosa colorida'],['cometa','Cometa sobre as montanhas'],['carina','Penhascos cósmicos'],['troncos','Floresta de troncos altos'],['vialactea','Via Láctea'],['azulestelar','Céu azul estrelado'],
 ['planeta','Planeta gelado'],['orbita','Terra em órbita'],['nebroxa','Nebulosa roxa'],['outono','Vale no outono'],['pinheiros','Pinheiros na neblina'],['bosque','Bosque iluminado'],['terranoite','Terra à noite']];
/* Camada escura única sobre o papel de parede, igual para todos os temas (o tema só pinta menus e peças). */
const WALL_SCRIM='rgba(0,0,0,.2)';
const salvaVisual=()=>{try{localStorage.setItem('mesa-visual',JSON.stringify(visual))}catch(e){}};
function aplicaWall(){
 if(typeof WALL_IMG==='undefined')return;
 if(!WALL_IMG[visual.wall])visual.wall='mogno';
 document.body.style.backgroundImage=`linear-gradient(${WALL_SCRIM},${WALL_SCRIM}),url("${WALL_IMG[visual.wall]}")`;
}
function marcaAp(){
 document.querySelectorAll('#apTemas .sw').forEach(b=>{const on=b.dataset.id===visual.tema;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
 document.querySelectorAll('#apWalls .wl').forEach(b=>{const on=b.dataset.id===visual.wall;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
}
function montaAp(){
 const T=$('#apTemas'),W=$('#apWalls');
 Object.entries(TEMAS).forEach(([id,t])=>{const b=document.createElement('button');b.type='button';b.className='sw';b.dataset.id=id;
  b.innerHTML=`<i style="background:linear-gradient(135deg,${t.v.t1},${t.v.t3})"></i><span>${t.nome}</span>`;
  b.onclick=()=>{visual.tema=id;salvaVisual();aplicaTema();marcaAp()};T.appendChild(b)});
 WALLS.forEach(([id,nome])=>{const b=document.createElement('button');b.type='button';b.className='wl';b.dataset.id=id;b.title=nome;
  if(typeof WALL_THUMB!=='undefined')b.style.backgroundImage=`url("${WALL_THUMB[id]}")`;
  b.innerHTML=`<span>${nome}</span>`;
  b.onclick=()=>{visual.wall=id;salvaVisual();aplicaWall();marcaAp()};W.appendChild(b)});
 marcaAp();
}
function abreAp(btn,ap=$('#ap')){
 (ap.id==='ap'?$('#sp'):$('#ap')).hidden=true;
 if(!ap.hidden){ap.hidden=true;return}
 ap.hidden=false;
 if(mob()){ap.style.left=ap.style.top='';return} // no celular o painel é uma folha fixa na base da tela (css/mobile.css)
 const r=btn.getBoundingClientRect(),w=ap.offsetWidth;
 ap.style.left=Math.max(12,Math.min(innerWidth-w-12,r.right-w))+'px';
 ap.style.top=Math.max(12,Math.min(r.bottom+8,innerHeight-ap.offsetHeight-12))+'px';
}
document.querySelectorAll('.btnAp').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();abreAp(b)}));
document.addEventListener('click',e=>{['#ap','#sp'].forEach(q=>{const x=$(q);if(!x.hidden&&!x.contains(e.target))x.hidden=true})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#ap').hidden=true;$('#sp').hidden=true}});
document.addEventListener('DOMContentLoaded',()=>{montaAp();aplicaWall()});
