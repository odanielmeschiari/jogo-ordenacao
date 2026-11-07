/* Ordem, sobreposição, encaixe e arraste das peças */
/* ===== Ordem, sobreposição e encaixe ===== */
function ordenado(){
 if(cfg.busca||pecas.length<2||pecas.some(p=>p.slot===null))return false;
 const a=[];pecas.forEach(p=>a[p.slot]=+p.val);return a.every((v,i)=>!i||DIR*(a[i-1]-v)<=0);
}
function verifica(){
 const o=ordenado();
 if(o&&!jaOrd){pecas.forEach(p=>{p.el.classList.remove('ok');void p.el.offsetWidth;p.el.classList.add('ok')});fanfarra(true)}
 jaOrd=o;const m=$('#msg');m.textContent='Ordenado!';m.classList.remove('err');m.classList.toggle('on',o);
 if(o)termina();
}
function verificaBusca(){
 if(!cfg.busca||cfg.alvo==='')return;
 const ach=pecas.filter(p=>!p.virada&&p.val===cfg.alvo);
 pecas.forEach(p=>p.el.classList.toggle('achou',ach.includes(p)));
 const m=$('#msg');
 if(ach.length){m.classList.remove('err');m.textContent='Encontrado!';m.classList.add('on');fanfarra(true);termina();return}
 if(pecas.length&&pecas.every(p=>!p.virada))ausente();else m.classList.remove('on','err');
}
function ausente(){ // todas as peças viradas (ou o algoritmo esgotou a lista) e o valor não apareceu
 pecas.forEach(p=>{p.el.classList.remove('nao');void p.el.offsetWidth;p.el.classList.add('nao')});
 const f=$('#flash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');
 f.onanimationend=()=>f.classList.remove('on');
 const m=$('#msg');fanfarra(false);m.textContent=`O valor ${cfg.alvo} não está presente na lista!`;m.classList.add('err','on');
 termina();
}
const ov=(a,b)=>Math.max(0,G.size-Math.abs(a.x-b.x))*Math.max(0,G.size-Math.abs(a.y-b.y));
const perto=(a,b)=>Math.abs(a.x-b.x)<G.size+8&&Math.abs(a.y-b.y)<G.size+8;
function afasta(q){ // manda a peça de baixo para o ponto livre mais próximo, fora da fileira
 const r=rect(q),minY=Math.min(G.rowY+G.rows*G.step+36,G.H-G.size),st=Math.max(G.size/2,6);let best=null,bd=1e9;
 for(let y=minY;y<=G.H-G.size;y+=st)for(let x=0;x<=G.W-G.size;x+=st){
  const c={x,y};if(pecas.some(o=>o!==q&&perto(c,rect(o))))continue;
  const d=Math.hypot(x-r.x,y-r.y);if(d<bd){bd=d;best=c}}
 best=best||{x:r.x,y:minY};q.slot=null;q.fx=best.x/G.W;q.fy=best.y/G.H;
}
function resolve(p){const r=rect(p);pecas.forEach(q=>{if(q!==p&&ov(r,rect(q))>G.size*G.size*.1)afasta(q)})}
function livre(p,x,y){x=Math.min(Math.max(0,x),G.W-G.size);y=Math.min(Math.max(0,y),G.H-G.size);p.slot=null;p.fx=x/G.W;p.fy=y/G.H}
function alvoPerto(cx,cy){let b=null,bd=G.size*.9;
 for(let i=0;i<pecas.length;i++){const v=vaga(i),d=Math.hypot(cx-v.x-G.size/2,cy-v.y-G.size/2);if(d<bd){bd=d;b=i}}return b}
function vira(p){p.el.classList.remove('gira');void p.el.offsetWidth;p.el.classList.add('gira');
 setTimeout(()=>{p.virada=!p.virada;p.el.classList.toggle('virada',p.virada);sVirar();
  if(!p.virada){mov++;contador();$('#ultima').textContent='Última virada: '+p.val}
  verificaBusca()},180)}

function ligaArraste(p){
 let ox,oy,sx,sy,down=false,drag=false,origem,ini;
 p.el.addEventListener('pointerdown',e=>{
  if(auto||bloqueado()||cfg.barras)return;down=true;drag=false;sx=e.clientX;sy=e.clientY;p.el.setPointerCapture(e.pointerId);
  const r=p.el.getBoundingClientRect(),m=mesa.getBoundingClientRect();
  ox=e.clientX-r.left;oy=e.clientY-r.top;origem=p.slot;ini={x:r.left-m.left,y:r.top-m.top};
 });
 p.el.addEventListener('pointermove',e=>{
  if(!down)return;
  if(!drag){
   if(Math.hypot(e.clientX-sx,e.clientY-sy)<6||(cfg.busca&&p.virada))return;
   drag=true;sMover(120,.5);p.slot=null;p.el.classList.add('arrasta');p.el.style.zIndex=++z;
  }
  const m=mesa.getBoundingClientRect(),x=e.clientX-m.left-ox,y=e.clientY-m.top-oy;
  p.el.style.left=x+'px';p.el.style.top=y+'px';
  const a=alvoPerto(x+G.size/2,y+G.size/2);vagasEl.forEach((s,i)=>s.classList.toggle('alvo',i===a));
 });
 const fim=e=>{
  if(!down)return;down=false;
  if(!drag){if(cfg.busca&&e.type==='pointerup')vira(p);return}
  drag=false;p.el.classList.remove('arrasta');vagasEl.forEach(s=>s.classList.remove('alvo'));
  if(!cfg.busca){mov++;contador();$('#resumo').hidden=true}
  const x=parseFloat(p.el.style.left),y=parseFloat(p.el.style.top),a=alvoPerto(x+G.size/2,y+G.size/2);
  if(a!==null){
   const o=pecas.find(q=>q!==p&&q.slot===a);
   if(o){if(origem!==null)o.slot=origem;else livre(o,ini.x,ini.y)}
   p.slot=a;
  }else livre(p,x,y);
  resolve(p);desenha();sMover(170,1);p.el.classList.remove('assenta');void p.el.offsetWidth;p.el.classList.add('assenta');verifica();
 };
 p.el.addEventListener('pointerup',fim);p.el.addEventListener('pointercancel',fim);
}
