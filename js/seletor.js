/* Seletor personalizado (substitui o <select> nativo) */
/* ===== Seletor personalizado (substitui o <select> nativo) ===== */
function customSelect(sel){
 const w=document.createElement('div'),b=document.createElement('button'),ul=document.createElement('ul');
 w.className='cs';b.type='button';b.className='cs-btn';b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');
 ul.className='cs-list';ul.setAttribute('role','listbox');ul.hidden=true;w.append(b,ul);sel.after(w);sel.style.display='none';
 let hi=0;const isOpen=()=>!ul.hidden;
 function refresh(){
  const o=[...sel.options];if(sel.selectedIndex<0)sel.selectedIndex=0;
  b.innerHTML='';const t=document.createElement('span'),a=document.createElement('i');t.textContent=o[sel.selectedIndex]?o[sel.selectedIndex].text:'';a.textContent='▾';b.append(t,a);
  ul.innerHTML='';
  o.forEach((op,i)=>{const li=document.createElement('li');li.setAttribute('role','option');li.setAttribute('aria-selected',i===sel.selectedIndex);
   li.textContent=op.text;li.onmouseenter=()=>marca(i);li.onclick=()=>escolhe(i);ul.appendChild(li)});
 }
 function marca(i){hi=i;[...ul.children].forEach((li,k)=>li.classList.toggle('hi',k===i));const li=ul.children[i];if(li)li.scrollIntoView({block:'nearest'})}
 function abre(){
  if(isOpen())return;ul.hidden=false;w.classList.add('open');b.setAttribute('aria-expanded','true');
  const r=b.getBoundingClientRect();ul.style.width=r.width+'px';ul.style.left=r.left+'px';
  const h=ul.offsetHeight,abaixo=innerHeight-r.bottom-12;
  ul.style.top=(h<=abaixo||abaixo>=r.top?r.bottom+6:Math.max(8,r.top-h-6))+'px';
  marca(sel.selectedIndex);
 }
 function fecha(){ul.hidden=true;w.classList.remove('open');b.setAttribute('aria-expanded','false')}
 function escolhe(i){const mudou=i!==sel.selectedIndex;sel.selectedIndex=i;fecha();refresh();b.focus();if(mudou)sel.dispatchEvent(new Event('change'))}
 b.onclick=()=>isOpen()?fecha():abre();
 b.addEventListener('keydown',e=>{
  const n=sel.options.length;
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!isOpen())abre();else marca((hi+(e.key==='ArrowDown'?1:-1)+n)%n)}
  else if(e.key==='Home'&&isOpen()){e.preventDefault();marca(0)}
  else if(e.key==='End'&&isOpen()){e.preventDefault();marca(n-1)}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();isOpen()?escolhe(hi):abre()}
  else if(e.key==='Escape'&&isOpen()){e.stopPropagation();fecha()}
  else if(e.key==='Tab')fecha();
 });
 document.addEventListener('click',e=>{if(isOpen()&&!w.contains(e.target))fecha()});
 document.addEventListener('scroll',e=>{if(isOpen()&&!ul.contains(e.target))fecha()},true);
 window.addEventListener('resize',fecha);
 refresh();return{refresh};
}
const algoCS=customSelect($('#algo'));
