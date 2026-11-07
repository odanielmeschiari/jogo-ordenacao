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
let verTodos=false,nomeOk=false,pendente=null,saidaForcada=false;
/* cada ranking vale para uma configuração (peças, direção, rodadas…); "Ver todas" mostra tudo do tipo, inclusive resultados antigos sem configuração */
const noGrupo=r=>r.tipo===tipoAtual()&&(verTodos||!cfg||!cfg.conf||r.conf===cfg.conf.k);
const lista=()=>ranking.filter(noGrupo).sort(cmpRank);
const norm=s=>String(s).trim().toLowerCase();
const mesmoGrupo=r=>r.tipo===tipoAtual()&&!r.alg&&!!cfg.conf&&r.conf===cfg.conf.k;
const anterior=nome=>ranking.filter(r=>mesmoGrupo(r)&&norm(r.nome)===norm(nome)).sort(cmpRank)[0];
const nomeUnico=()=>{let n=lista().length+1;while(ranking.some(r=>mesmoGrupo(r)&&norm(r.nome)==='competidor '+n))n++;return'Competidor '+n};
const guarda=()=>{
 for(let k=0;k<=ranking.length;k++){ // se estourar a cota do navegador, as jogadas detalhadas dos registros mais antigos são descartadas primeiro
  try{localStorage.setItem('mesa-ranking',JSON.stringify(ranking));return}catch(e){}
  const r=ranking[k];if(r&&r.rounds)r.rounds.forEach(x=>{delete x.log;delete x.vals});
 }
};
const fmt=ms=>(ms/1000).toFixed(2).replace('.',',')+' s';
const unid=(n,busca)=>busca?(n===1?'virada':'viradas'):(n===1?'movimento':'movimentos');
const bloqueado=()=>!!cfg.comp&&(!comp||comp.estado!=='rodando');
function cancelaComp(){if(comp){cancelAnimationFrame(comp.raf);clearTimeout(comp.tm);clearInterval(comp.adv)}comp=null;$('#ov').hidden=true;$('#sai').hidden=true;pendente=null}
const rotComp=()=>comp.nome+(cfg.rod>1?` · rodada ${comp.r+1}/${cfg.rod}`:'');
function espera(prox){ // prox: o mesmo competidor segue para a próxima rodada (vai direto à contagem)
 comp={estado:'espera',r:0,acc:{ms:[],mov:[],det:[]},aus:false};nomeOk=false;$('#nomeAviso').hidden=true;$('#ov').hidden=false;$('#ovBox').hidden=false;$('#ovCount').hidden=true;
 $('#nome').value='';$('#cNome').textContent='';$('#cron').textContent='0,00 s';$('#btnProx').hidden=true;
 renderRank();
 if(prox){Object.assign(comp,prox);$('#cNome').textContent=rotComp();contagem();return}
 setTimeout(()=>$('#nome').focus(),60);
}
function comeca(){
 if(!comp||comp.estado!=='espera')return;
 const dig=$('#nome').value.trim(),ant=dig&&anterior(dig);
 if(ant&&!nomeOk){ // mesmo nome já está no ranking: avisa e pede confirmação (como no aviso de valor ausente)
  nomeOk=true;const a=$('#nomeAviso');a.textContent=`"${ant.nome}" já está no ranking (${vTxt(ant)}). Se continuar, só o melhor resultado fica. Toque em Começar de novo para confirmar, ou mude o nome.`;
  a.hidden=false;a.classList.remove('pulsa');void a.offsetWidth;a.classList.add('pulsa');return}
 comp.nome=dig||nomeUnico();$('#cNome').textContent=rotComp();$('#nomeAviso').hidden=true;
 contagem();
}
function contagem(){
 comp.estado='contagem';$('#ovBox').hidden=true;
 const c=$('#ovCount');c.hidden=false;let n=3;c.textContent=n;sContagem(false);
 const passo=()=>{n--;
  if(n>0){c.textContent=n;sContagem(false);comp.tm=setTimeout(passo,800)}
  else{sContagem(true);c.hidden=true;$('#ov').hidden=true;comp.estado='rodando';comp.t0=performance.now();comp.log=[];comp.logN=0;mostraAlvo();loop()}};
 comp.tm=setTimeout(passo,800);
}
function mostraAlvo(){
 const v=cfg.busca&&cfg.alvo!==''&&!(cfg.comp&&comp&&(comp.estado==='espera'||comp.estado==='contagem'));
 $('#alvoGrande').hidden=!v;$('#alvoNum').textContent=cfg.alvo;
 const aus=!!cfg.algo&&cfg.busca&&cfg.alvo!==''&&!cfg.vals.includes(cfg.alvo);
 $('#ultima').textContent=aus?'⚠ Valor fora da lista':'';$('#ultima').classList.toggle('av',aus);
}
function loop(){$('#cron').textContent=fmt(performance.now()-comp.t0);comp.raf=requestAnimationFrame(loop)}
function registra(parcial){ // grava o competidor no ranking com a média das rodadas concluídas; mesmo nome: fica só o melhor
 const A=comp.acc,k=A.ms.length,av=x=>x.reduce((q,y)=>q+y,0)/x.length;
 const reg={nome:comp.nome,ms:av(A.ms),mov:k>1?Math.round(av(A.mov)*10)/10:A.mov[0],tipo:tipoAtual(),id:Date.now(),aus:comp.aus,rod:k,
  conf:cfg.conf&&cfg.conf.k,confTxt:cfg.conf&&cfg.conf.t,rounds:A.ms.map((m,i)=>({ms:m,mov:A.mov[i],...(A.det[i]||{})}))};
 if(parcial)reg.parc=cfg.rod||1;
 const ant=ranking.filter(r=>mesmoGrupo(r)&&norm(r.nome)===norm(reg.nome)),mel=ant.sort(cmpRank)[0];let nota='';
 if(mel&&(cmpRank(reg,mel)>=0||(parcial&&!mel.parc))){nota='seu melhor resultado anterior foi mantido'} // resultado parcial nunca substitui um completo
 else{if(mel){ranking=ranking.filter(r=>!ant.includes(r));nota='novo melhor resultado'}ranking.push(reg)}
 guarda();renderRank();return{reg,nota};
}
function termina(){
 if(!comp||comp.estado!=='rodando')return;
 cancelAnimationFrame(comp.raf);const ms=performance.now()-comp.t0;comp.estado='fim';$('#cron').textContent=fmt(ms);
 const rod=cfg.rod||1,A=comp.acc;
 A.ms.push(ms);A.mov.push(mov);A.det.push({n:cfg.vals.length,vals:cfg.vals.length<=100?cfg.vals.slice():null,alvo:cfg.busca?cfg.alvo:'',log:comp.log,mais:comp.logN});comp.aus=comp.aus||!!(cfg.busca&&!cfg.vals.includes(cfg.alvo));
 $('#msg').textContent+=' · '+fmt(ms)+' · '+mov+' '+unid(mov,cfg.busca);
 if(A.ms.length<rod){$('#btnProx').textContent=mob()?`Rodada ${A.ms.length+1}/${rod}`:`Rodada ${A.ms.length+1} de ${rod}`;$('#btnProx').hidden=false;
  if(cfg.autoRod)agendaProx(SEG_RODADA,$('#btnProx').textContent);return} // o ranking só recebe o competidor depois da última rodada
 const{reg,nota}=registra(false);
 if(rod>1)$('#msg').textContent+=` · média de ${rod} rodadas: ${fmt(reg.ms)} · ${fn(reg.mov)} ${unid(reg.mov,cfg.busca)}`;
 if(nota)$('#msg').textContent+=' · '+nota;
 $('#btnProx').textContent='Próximo competidor';$('#btnProx').hidden=false;
 if(cfg.autoJog)agendaProx(SEG_JOGADOR,'Próximo competidor');
}
/* Passagem automática: o botão do ranking mostra a contagem regressiva e dispara sozinho; tocar nele adianta */
const SEG_RODADA=3,SEG_JOGADOR=4;
function agendaProx(seg,rot){
 clearInterval(comp.adv);let s=seg;const b=$('#btnProx'),mostra=()=>{b.textContent=`${rot} · ${s} s`};
 comp.advArgs=[seg,rot];mostra();
 comp.adv=setInterval(()=>{s--;if(s<=0){clearInterval(comp.adv);comp.adv=null;b.click()}else mostra()},1000);
}
const rvTxt=r=>{ // resultado de cada rodada no critério escolhido (até 5; com mais, só o melhor e o pior)
 if(!r.rounds||r.rounds.length<2)return'';
 const v=r.rounds.map(x=>crit==='mov'?x.mov:crit==='cmp'?x.cmp:x.ms);if(v.some(x=>x==null))return'';
 const f=x=>crit==='ms'?fmt(x):fn(x);
 return v.length<=5?'rodadas: '+v.map(f).join(' · '):`melhor ${f(Math.min(...v))} · pior ${f(Math.max(...v))}`;
};
function renderRank(){
 const l=$('#rankLista'),L=lista(),b=cfg.busca;l.innerHTML='';
 $('#rankTitulo').textContent='Ranking · '+(b?'busca':'ordenação');
 $('#rankConf').hidden=$('#rankTodos').hidden=!cfg.conf;
 if(cfg.conf){$('#rankConf').textContent=verTodos?'Todas as configurações':cfg.conf.t;$('#rankTodos').textContent=verTodos?'Só esta configuração':'Ver todas as configurações'}
 $('#critMov').textContent=b?'Viradas':'Movimentos';
 document.querySelectorAll('#rank .crit button').forEach(x=>x.classList.toggle('on',x.dataset.c===crit));
 $('#rankDica').hidden=!L.length;
 if(!L.length){l.innerHTML='<li>Ninguém ainda.</li>';return}
 L.forEach((r,i)=>{const li=document.createElement('li');
  li.className='clic';li.tabIndex=0;li.setAttribute('role','button');li.title='Ver os detalhes de '+r.nome;li.onclick=()=>detalhes(r);
  li.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();detalhes(r)}};
  const a=document.createElement('span');a.textContent=`${i+1}º ${r.nome}`;
  const v=document.createElement('b');v.textContent=vTxt(r);li.append(a,v);
  const pt=[];if(crit!=='ms')pt.push(fmt(r.ms));if(crit!=='mov'&&r.mov!=null)pt.push(`${fn(r.mov)} ${unid(r.mov,r.tipo==='buscar')}`);if(crit!=='cmp'&&r.cmp!=null)pt.push(`${fn(r.cmp)} comp.`);
  if(r.parc)pt.push(`parcial: ${r.rod} de ${r.parc} ${r.parc===1?'rodada':'rodadas'}`);else if(r.rod>1)pt.push(`média de ${r.rod} rodadas`);else if(r.alg)pt.push('automático');
  const rv=rvTxt(r);if(rv)pt.push(rv);if(r.aus)pt.push('valor ausente');if(verTodos)pt.push(r.confTxt||'configuração antiga');
  if(pt.length){const m=document.createElement('small');m.textContent=pt.join(' · ');li.appendChild(m)}
  l.appendChild(li)});
}
document.querySelectorAll('#rank .crit button').forEach(x=>x.onclick=()=>{
 crit=x.dataset.c;try{localStorage.setItem('mesa-crit',crit)}catch(e){}
 renderRank();if(cfg.torneio&&cfg.torneio.fim&&!$('#resumo').hidden&&cfg.torneio.regs.length)torneioResumo();
});
$('#btnComecar').onclick=comeca;
$('#nome').addEventListener('keydown',e=>{if(e.key==='Enter')comeca()});
$('#nome').addEventListener('input',()=>{nomeOk=false;$('#nomeAviso').hidden=true});
$('#rankTodos').onclick=()=>{verTodos=!verTodos;renderRank()};
$('#btnProx').onclick=()=>{const T=cfg.torneio;
 if(T&&T.espera){const f=T.espera;T.espera=null;$('#btnProx').hidden=true;f();return} // simulador: começa a próxima rodada
 if(cfg.torneio&&cfg.gerA)Object.assign(cfg,novoConjunto(cfg.gerA));
 const c=comp,prox=c&&c.estado==='fim'&&c.r+1<(cfg.rod||1)?{nome:c.nome,r:c.r+1,acc:c.acc,aus:c.aus}:null; // próxima rodada do mesmo competidor
 montaMesa(false,prox)};
let confT=null;
$('#btnLimpaRank').onclick=()=>{const b=$('#btnLimpaRank');
 if(!confT){b.textContent='Toque de novo para confirmar';confT=setTimeout(()=>{confT=null;b.textContent='Limpar ranking'},3000);return}
 clearTimeout(confT);confT=null;b.textContent='Limpar ranking';
 ranking=ranking.filter(r=>!noGrupo(r));guarda();renderRank()}; // apaga o que está à mostra: esta configuração, ou tudo se "Ver todas" estiver ativo

$('#btnCsv').onclick=()=>{
 const L=lista(),nr=Math.max(0,...L.map(r=>r.rounds&&r.rounds.length>1?r.rounds.length:0)),cab=['posicao','nome','tempo_s','movimentos','comparacoes','automatico','rodadas','configuracao','parcial'];
 for(let k=1;k<=nr;k++)cab.push(`r${k}_tempo_s`,`r${k}_movimentos`);
 const rows=[cab];
 L.forEach((r,i)=>{const l=[i+1,r.nome,(r.ms/1000).toFixed(3),r.mov??'',r.cmp??'',r.alg?'sim':'nao',r.rod||1,r.confTxt||'',r.parc?'sim':'nao'];
  for(let k=0;k<nr;k++){const x=r.rounds&&r.rounds.length>1?r.rounds[k]:null;l.push(x?(x.ms/1000).toFixed(3):'',x?x.mov:'')}
  rows.push(l)});
 const csv=rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(';')).join('\n'),a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download='ranking-'+tipoAtual()+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};

/* Sair (Voltar/Reiniciar) no meio das rodadas: pergunta se salva a média parcial. O cronômetro fica parado enquanto a pergunta está aberta */
const naMetade=()=>!!cfg&&!!cfg.comp&&!cfg.torneio&&!!comp&&!!comp.acc&&comp.acc.ms.length>0&&comp.acc.ms.length<(cfg.rod||1);
function pausaComp(){
 if(comp.adv){clearInterval(comp.adv);comp.adv=null;comp.advPend=true} // a contagem do avanço automático também espera a decisão
 if(comp.estado==='rodando'){cancelAnimationFrame(comp.raf);comp.pausaT=performance.now()}
 else if(comp.estado==='contagem')clearTimeout(comp.tm);
}
function retomaComp(){
 if(!comp)return;
 if(comp.advPend){comp.advPend=false;agendaProx(...comp.advArgs);return}
 if(comp.estado==='rodando'&&comp.pausaT){comp.t0+=performance.now()-comp.pausaT;comp.pausaT=0;loop()}
 else if(comp.estado==='contagem')contagem(); // a contagem recomeça do 3
}
function confirmaSaida(acao){ // saidaForcada: o modo feira volta ao início sem perguntar (ninguém está olhando)
 if(saidaForcada||!naMetade()){saidaForcada=false;acao();return}
 if(!$('#sai').hidden)return;
 const k=comp.acc.ms.length;
 $('#saiTxt').textContent=`${comp.nome} concluiu ${k} de ${cfg.rod} rodadas. O que fazer com o resultado até aqui?`;
 pausaComp();pendente=acao;$('#sai').hidden=false;$('#saiVolta').focus();
}
const fechaSai=()=>{$('#sai').hidden=true;pendente=null};
$('#saiSalva').onclick=()=>{const a=pendente;fechaSai();if(naMetade())registra(true);if(a)a()};
$('#saiDescarta').onclick=()=>{const a=pendente;fechaSai();if(a)a()};
$('#saiVolta').onclick=()=>{fechaSai();retomaComp()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#sai').hidden)$('#saiVolta').click()});

/* Detalhes de um competidor (ou algoritmo): resumo, e cada rodada com a lista usada e as jogadas na ordem em que aconteceram */
const LOGMAX=100; // jogadas guardadas por rodada (o resto só é contado)
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
function regJog(e){ // chamado por pecas.js a cada jogada, só enquanto o cronômetro roda
 if(!comp||comp.estado!=='rodando'||!comp.log)return;
 if(comp.log.length<LOGMAX)comp.log.push([Math.round(performance.now()-comp.t0),...e]);else comp.logN++;
}
function txJog(busca,e,alvo){ // e = [tempo, valor, ...]; posições começam em 0, como na mesa; -1 = fora da fileira
 const[,v,a,b,o]=e;
 if(busca)return`Virou a peça da posição ${a}: ${v}`+(String(v)===String(alvo)?' (encontrou!)':'');
 if(b<0)return a<0?`Mexeu em ${v} fora da fileira`:`Tirou ${v} da posição ${a} e deixou fora da fileira`;
 if(a===b)return`Soltou ${v} de volta na posição ${b}`;
 if(a<0)return`Colocou ${v} na posição ${b}`+(o!=null?`; ${o} saiu da fileira`:'');
 return o!=null?`Trocou ${v} (posição ${a}) com ${o} (posição ${b})`:`Moveu ${v} da posição ${a} para a posição ${b}`;
}
let detOrigem=null;
function detalhes(r){
 const busca=r.tipo==='buscar',un=x=>unid(x,busca),pos=lista().indexOf(r)+1;
 $('#detPos').textContent=pos?`${pos}º no ranking · por ${crit==='mov'?(busca?'viradas':'movimentos'):crit==='cmp'?'comparações':'tempo'}`:'';
 $('#detNome').textContent=r.nome;
 $('#detConf').textContent=r.confTxt||'Configuração antiga (sem descrição)';
 const res=$('#detRes');res.innerHTML='';
 const dado=(k,v)=>{const d=el('div','dado');d.append(el('small',null,k),el('b',null,v));res.appendChild(d)},m=r.rod>1;
 dado(m?'Tempo médio':'Tempo',fmt(r.ms));
 if(r.mov!=null)dado(m?'Média de '+(busca?'viradas':'movimentos'):(busca?'Viradas':'Movimentos'),fn(r.mov));
 if(r.cmp!=null)dado(m?'Comparações (média)':'Comparações',fn(r.cmp));
 dado('Rodadas',r.parc?`${r.rod} de ${r.parc} (parcial)`:String(r.rod||1));
 const R=r.rounds||[],box=$('#detRod');box.innerHTML='';
 if(r.aus)box.appendChild(el('p','aviso','O valor buscado não estava na lista em ao menos uma rodada.'));
 if(!R.length){box.appendChild(el('p','dica','Este registro é de uma versão anterior e não guarda o detalhe das rodadas.'))}
 else{
  box.appendChild(el('h3',null,R.length>1?'Rodada a rodada':'A rodada'));
  R.forEach((x,i)=>{
   const d=el('details'),s=el('summary'),pt=[fmt(x.ms)];
   if(x.mov!=null)pt.push(`${fn(x.mov)} ${un(x.mov)}`);if(x.cmp!=null)pt.push(`${fn(x.cmp)} comp.`);
   s.textContent=(R.length>1?`Rodada ${i+1} · `:'')+pt.join(' · ');d.appendChild(s);
   const c=el('div','rod'),linha=(k,v)=>{const p=el('p');p.append(el('b',null,k+': '),document.createTextNode(v));c.appendChild(p)};
   if(x.vals)linha('Lista inicial',x.vals.join(' · '));else if(x.n)linha('Lista inicial',`${x.n} peças (grande demais para listar)`);
   if(busca&&x.alvo!==undefined&&x.alvo!=='')linha('Valor buscado',x.alvo+(x.vals&&!x.vals.includes(x.alvo)?' (não estava na lista)':''));
   if(r.alg){if(!x.vals&&!x.n)c.appendChild(el('p','dica','Sem a lista desta rodada.'))}
   else if(x.log){
    if(!x.log.length)c.appendChild(el('p','dica','Nenhuma jogada nesta rodada.'));
    else{
     const ol=el('ol','jogadas');
     x.log.forEach(e=>{const li=el('li');li.append(el('time',null,fmt(e[0])),document.createTextNode(txJog(busca,e,x.alvo)));ol.appendChild(li)});
     c.appendChild(ol);
     if(x.mais>0)c.appendChild(el('p','dica',`… e mais ${x.mais} ${x.mais===1?'jogada':'jogadas'} (só as primeiras ${LOGMAX} ficam guardadas).`));
    }
   }else c.appendChild(el('p','dica','Sem o registro das jogadas desta rodada.'));
   d.appendChild(c);if(R.length===1)d.open=true;box.appendChild(d);
  });
 }
 detOrigem=document.activeElement;$('#det').hidden=false;$('#detBox').scrollTop=0;$('#detX').focus();
}
function fechaDet(){$('#det').hidden=true;if(detOrigem&&detOrigem.focus&&document.contains(detOrigem))detOrigem.focus();detOrigem=null}
$('#detX').onclick=fechaDet;
$('#det').addEventListener('click',e=>{if(e.target===$('#det'))fechaDet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#det').hidden){e.stopPropagation();fechaDet()}},true);
