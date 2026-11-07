/* Celular: menu da barra, folha do ranking, medição das áreas fixas e redesenho da mesa */
/* ===== Celular ===== */
(function(){
 const sb=$('#sandbox'),bar=$('.barra'),menu=$('#menuBarra'),mais=$('.btnMais'),rank=$('#rank'),tg=$('#rankTg');

 /* menu ⋮ da barra */
 const fechaMenu=()=>{menu.classList.remove('aberto');mais.setAttribute('aria-expanded','false')};
 mais.addEventListener('click',e=>{e.stopPropagation();const a=!menu.classList.contains('aberto');menu.classList.toggle('aberto',a);mais.setAttribute('aria-expanded',a)});
 menu.addEventListener('click',e=>{if(e.target.closest('button'))fechaMenu()},true);
 document.addEventListener('click',e=>{if(!menu.contains(e.target))fechaMenu()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')fechaMenu()});
 $('#btnVoltar').addEventListener('click',fechaMenu);
 $('#btnReiniciar2').onclick=()=>$('#btnReiniciar').click();

 /* folhas de Aparência e Som: botão ✕ */
 document.querySelectorAll('.fechar-mob').forEach(b=>b.onclick=e=>{e.stopPropagation();b.parentElement.hidden=true});

 /* ranking: abre e fecha a lista */
 tg.onclick=()=>{const a=!rank.classList.contains('aberto');rank.classList.toggle('aberto',a);tg.setAttribute('aria-expanded',a);tg.textContent=a?'Ranking ▾':'Ranking ▴';mede()};

 /* mede a barra e os painéis da base para a mesa ocupar só o que sobra (as variáveis são usadas em css/mobile.css) */
 const alt=e=>e?e.offsetHeight:0;
 function mede(){
  if(!mob())return;
  if(rank.hidden&&rank.classList.contains('aberto')){rank.classList.remove('aberto');tg.setAttribute('aria-expanded','false');tg.textContent='Ranking ▴'}
  const s=sb.style;
  if(!rank.classList.contains('aberto'))s.setProperty('--rankh',alt(rank)+'px'); // aberta, a folha cobre os controles em vez de empurrá-los
  const rk=parseFloat(s.getPropertyValue('--rankh'))||0,dock=sb.classList.contains('com-ctrl')?alt($('#linhaAuto')):0;
  s.setProperty('--barh',alt(bar)+'px');
  s.setProperty('--baixo',(rk+dock+alt($('#desafio')))+'px');
 }
 if(window.ResizeObserver){
  const ro=new ResizeObserver(mede);[bar,rank,$('#linhaAuto'),$('#desafio')].forEach(e=>ro.observe(e));
  /* a mesa mudou de tamanho (painel da base, girar o aparelho, barra de endereço): reposiciona as peças */
  new ResizeObserver(()=>{if(mob()&&sb.classList.contains('ativa')&&pecas.length&&!mesa.querySelector('.arrasta'))desenha()}).observe(mesa);
 }
 new MutationObserver(mede).observe(sb,{attributes:true,attributeFilter:['class']});
 MOB.addEventListener('change',()=>{mede();if(cfg&&pecas.length){contador();desenha()}});
 window.addEventListener('resize',mede);
 mede();
})();
