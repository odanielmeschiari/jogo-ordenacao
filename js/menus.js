/* Menus da tela inicial: Início → (Jogo | Simulador) → (Rodada única | Torneio) → opções → iniciar */
/* ===== Menus ===== */
/* As linhas de opção moram em #estoque (index.html). Cada etapa leva para a sua tela só as linhas do caminho escolhido,
   então nenhuma tela fica sobrecarregada e nenhuma opção some. Os ids e os eventos das linhas não mudam. */
const MENU={area:null,modo:null,etapa:'home',pilha:[]};
const AREAS={jogo:'Jogo',sim:'Simulador'},MODOS={unica:'Rodada única',torneio:'Torneio'};
const TXT_MODO={
 jogo:{unica:'Uma partida livre (sandbox): monte as peças e jogue, sem cronômetro nem ranking.',
  torneio:'Vários competidores, com cronômetro, rodadas e ranking. Dá para escolher se rodadas e competidores passam sozinhos.'},
 sim:{unica:'Um algoritmo, uma lista: acompanhe a execução passo a passo.',
  torneio:'Vários algoritmos recebem a mesma lista e competem entre si, com ranking.'}};
const TIT_MODO={jogo:'Como quer jogar?',sim:'Como quer simular?'};
/* cada bloco: [título, [ids das linhas]]; uma string solta é um elemento sem bloco */
const LAYOUT={
 'jogo.unica':{
  c2:[['Tipo de jogo',['rModo','rSentido']],['Peças',['rOrigem','rPecas']],['Regras',['rOrdem','alvoBox']],['Exposição',['rFeira']]],
  t2:'Configurar a rodada'},
 'jogo.torneio':{
  c1:[['Torneio',['rodBox','zeraBox','rAutoRod','rAutoJog']],['Tipo de jogo',['rModo','rSentido','rOrigem']],['Exposição',['rFeira']]],
  c2:[['Peças',['rPecas']],['Regras',['rOrdem','alvoBox']]],
  t1:'Opções do torneio',t2:'Peças e regras',prox:'Continuar: peças e regras'},
 'sim.unica':{
  c2:[['Tarefa',['sTipo','umBox','rSentido']],['Lista',['sQtd','gAlvoBox']],['Ordem inicial e visual',['sForma','sVis','sCores']],['Desafio',['sDes']],'legGer'],
  t2:'Configurar a simulação'},
 'sim.torneio':{
  c1:[['Competição de algoritmos',['sTipo','rSentido','sQuem','tAviso']],['Rodadas',['sRod','sZera','sAutoRod']]],
  c2:[['Lista',['sQtd','gAlvoBox']],['Ordem inicial e visual',['sForma','sVis','sCores']],'legGer'],
  t1:'Opções da competição',t2:'Lista e visual',prox:'Continuar: lista e visual'}};

const estoque=()=>$('#estoque'),corpos=()=>[$('#corpo1'),$('#corpo2')];
function devolve(){ // leva todas as linhas de volta ao estoque e esvazia as telas
 corpos().forEach(c=>{
  c.querySelectorAll('.bloco').forEach(b=>[...b.children].forEach(x=>{if(x.tagName!=='H2')estoque().appendChild(x)}));
  [...c.children].forEach(x=>{if(!x.classList.contains('bloco'))estoque().appendChild(x)});
  c.innerHTML='';
 });
}
function monta(corpo,lista){
 devolve();
 lista.forEach(item=>{
  if(typeof item==='string'){corpo.appendChild($('#'+item));return}
  const b=document.createElement('section'),h=document.createElement('h2');b.className='bloco';h.textContent=item[0];b.appendChild(h);
  item[1].forEach(id=>b.appendChild($('#'+id)));corpo.appendChild(b);
 });
 limpaBlocos();
}
function limpaBlocos(){ // esconde o bloco cujas linhas estão todas escondidas
 corpos().forEach(c=>c.querySelectorAll('.bloco').forEach(b=>{b.hidden=[...b.children].filter(x=>x.tagName!=='H2').every(x=>x.hidden)}));
}

function mostraEtapa(nome){
 MENU.etapa=nome;
 document.querySelectorAll('.etapa').forEach(e=>e.hidden=e.id!=='e-'+nome);
 $('#nav').hidden=nome==='home';
 const L=LAYOUT[MENU.area+'.'+MENU.modo],A=AREAS[MENU.area];
 if(nome==='home'){devolve();return}
 let trilha=A,tit=TIT_MODO[MENU.area];
 if(nome==='modo')devolve();
 else{
  trilha=A+' › '+MODOS[MENU.modo];
  tit=nome==='c1'?L.t1:L.t2;
  monta(nome==='c1'?$('#corpo1'):$('#corpo2'),nome==='c1'?L.c1:L.c2);
  if(nome==='c1')$('#btnProximo').textContent=L.prox;
  else{
   const jogo=MENU.area==='jogo';
   $('#btnIniciar').hidden=!jogo;$('#btnLimpar').hidden=!jogo||radio('origem')==='aleatorio';$('#btnGerar').hidden=jogo;
   if(jogo&&radio('origem')==='manual'&&!matchMedia('(pointer:coarse)').matches)$('#valor').focus(); // no toque, o teclado não abre sozinho
  }
 }
 $('#trilha').textContent=trilha;$('#etapaTit').textContent=tit;
 const c=$('#e-'+nome+' .corpo');if(c)c.scrollTop=0;
}
function vai(nome){MENU.pilha.push(MENU.etapa);mostraEtapa(nome)}
function voltaMenu(){mostraEtapa(MENU.pilha.pop()||'home')}
function irInicio(){MENU.pilha=[];MENU.area=MENU.modo=null;mostraEtapa('home')} // também usada pelo modo feira

function escolheArea(a){
 MENU.area=a;MENU.modo=null;
 document.querySelectorAll('#e-modo .cartao').forEach(b=>b.querySelector('.txt').textContent=TXT_MODO[a][b.dataset.modo]);
 vai('modo');
}
function escolheModo(m){
 MENU.modo=m;const torn=m==='torneio';
 $('#comp').checked=MENU.area==='jogo'&&torn; // no Jogo, torneio = cronômetro e ranking de competidores
 document.querySelector(`input[name=gmodo][value=${torn?'torneio':'um'}]`).checked=true; // no Simulador, torneio = competição de algoritmos
 atualizaManager();atualizaGer();
 vai(torn?'c1':'c2');
}
document.querySelectorAll('#e-home .cartao').forEach(b=>b.onclick=()=>escolheArea(b.dataset.area));
document.querySelectorAll('#e-modo .cartao').forEach(b=>b.onclick=()=>escolheModo(b.dataset.modo));
$('#btnVoltarMenu').onclick=voltaMenu;
$('#btnProximo').onclick=()=>{
 if(MENU.area==='sim'&&document.querySelectorAll('#tornLista input:checked').length<2){$('#tAviso').hidden=false;limpaBlocos();return}
 vai('c2');
};
$('#tornLista').addEventListener('change',()=>{$('#tAviso').hidden=document.querySelectorAll('#tornLista input:checked').length>=2;limpaBlocos()});
mostraEtapa('home');
