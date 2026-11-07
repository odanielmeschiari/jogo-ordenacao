/* Execução automática: play/pausa, histórico, fim e torneio */
/* ===== Execução automática ===== */
const ATRASOS=[1000,700,500,350,250,170,110,70,40,20,16,16,16,16],LOTE=[1,1,1,1,1,1,1,1,1,1,3,10,50,250];
const posiciona=p=>{const r=rect(p);p.el.style.left=r.x+'px';p.el.style.top=r.y+'px'};
let velManual=false;
function velInicial(){ // escolhe a velocidade que deixa a execução visível: simula os passos e mira num tempo total confortável
 const orc=cfg.torneio?10000:25000;let S=0;
 const it=cfg.busca?buscaGen(cfg.algo,cfg.vals,cfg.alvo):gera(cfg.algo,cfg.vals).it;
 for(const _ of it)S++;
 for(let v=2;v<=14;v++)if(Math.ceil(S/LOTE[v-1])*ATRASOS[v-1]<=orc)return v;
 return 14;
}
function iniciaAuto(mantemVel){
 const n=cfg.vals.length,busca=cfg.busca;let a=null,it;
 if(busca)it=buscaGen(cfg.algo,cfg.vals,cfg.alvo);else{const g=gera(cfg.algo,cfg.vals);a=g.a;it=g.it}
 auto={tipo:busca?'busca':'ord',a,A:a&&a.slice(),S:a&&a.slice(),seen:new Set(),hist:[],pos:0,done:false,res:-1,it,n:0,play:cfg.torneio?cfg.torneio.play:true,timer:null,hl:[]};
 if(!mantemVel||!velManual)$('#vel').value=velInicial();
 $('#btnPlay').textContent=auto.play?'Pausar':'Continuar';barra();
 if(cfg.desafio&&!cfg.torneio){auto.play=false;iniciaDesafio()}else auto.timer=setTimeout(tick,900); // pausa inicial: dá tempo de ver a lista antes do primeiro passo
}
function abre(p,anim){ // desvira uma peça na busca automática
 if(anim){p.el.classList.remove('gira');void p.el.offsetWidth;p.el.classList.add('gira');setTimeout(()=>p.el.classList.remove('virada'),180)}
 else p.el.classList.remove('virada');
 sVirar();$('#ultima').textContent='Última virada: '+p.val;
}
function txOrd(h,p,c,S){ // texto do passo (estado S = depois do passo)
 const nome=cfg.algo,V=s=>pecas[S[s]].val,o=(x,y)=>DIR*(x-y)>0,rel=(x,y)=>o(x,y)?(DIR>0?'>':'<'):(DIR>0?'≤':'≥'),mm=DIR>0?'menor':'maior';
 if(nome==='contagem'||nome==='radix')return c.length?`Põe o ${V(c[0])} no lugar certo (sem comparar)`:`Lê o ${V(h[0])} e anota na contagem`;
 if(nome==='merge'||(nome==='tim'&&h.length>2))return c.length?`Faixa ${h[0]}–${h[h.length-1]} intercalada e ordenada`:`Vai intercalar a faixa ${h[0]}–${h[h.length-1]}`;
 if(c.length&&h.length===1&&p>=0)return`Pivô ${V(h[0])} vai para o lugar definitivo`;
 if(c.length)return`Trocou ${V(h[1])} com ${V(h[0])}`;
 if(nome==='selecao'&&h.length===1){const j=+V(h[0]),m=+V(p);return`${j} ${j<m?'<':j>m?'>':'='} ${m} (${mm} até agora): ${DIR*(j-m)<0?'novo '+mm:'continua o mesmo'}`}
 if(nome==='quick'&&h.length===1){const j=+V(h[0]),m=+V(p);return`${j} ${j<m?'<':j>m?'>':'='} pivô ${m}: ${DIR*(j-m)<0?'vai para o grupo da esquerda':'fica no grupo da direita'}`}
 if(nome==='heap')return h[0]===h[1]?`Pai ${V(h[0])} já ${DIR>0?'é maior':'é menor'} que os filhos: fica`:`Filho ${V(h[1])} ${DIR>0?'>':'<'} pai ${V(h[0])}: sobe`;
 const x=+V(h[0]),y=+V(h[1]);return`${x} ${rel(x,y)} ${y}: ${o(x,y)?'fora de ordem, troca':'já está em ordem'}`;
}
function txBusca(i,lo,hi){
 const x=+pecas[i].val,t=+cfg.alvo,k=DIR*(x-t);
 if(k===0)return`Leu ${x} = alvo ${t}: encontrou!`;
 if(cfg.algo==='linear')return`Leu ${x} ≠ ${t}: segue para a próxima peça`;
 return`Leu ${x}. Alvo ${t} é ${t<x?'menor':'maior'} que ${x}: descarta ${k<0?'o que vem antes (esquerda)':'o que vem depois (direita)'}`;
}
function puxa(){ // busca o próximo passo no gerador e guarda no histórico (sem mexer na tela)
 if(auto.done)return null;
 const r=auto.it.next();if(r.done){auto.done=true;auto.res=r.value;return null}
 let e;
 if(auto.tipo==='busca'){const[i,lo,hi]=r.value;e={i,lo,hi,op:!auto.seen.has(i),tx:txBusca(i,lo,hi)};auto.seen.add(i)}
 else{
  const[h,p=-1,c=[],w=c.length?1:0,nc=0,cc=null,tx]=r.value,S=auto.S,d=c.map(sl=>[sl,S[sl],auto.a[sl]]).filter(x=>x[1]!==x[2]);
  d.forEach(([sl,,nv])=>S[sl]=nv);
  e={d,h,p,w,dc:cc!==null?cc:(c.length||nc?0:1),tx:tx||txOrd(h,p,c,S)};
 }
 auto.hist.push(e);
 if(auto.hist.length>20000){auto.hist.splice(0,5000);auto.pos-=5000} // guarda os últimos ~15 mil passos
 return e;
}
const tit=()=>`${NOME[cfg.algo]}${auto.tipo==='busca'?'':' · '+nomeDir()}: passo ${auto.n}`;
function mostraOrd(e){
 auto.hl.forEach(p=>p.el.classList.remove('cmp','pv'));auto.hl=[];
 if(e){e.h.forEach(sl=>{const p=pecas[auto.A[sl]];p.el.classList.add('cmp');auto.hl.push(p)});
  if(e.p>=0){const p=pecas[auto.A[e.p]];p.el.classList.add('pv');auto.hl.push(p)}}
 txt(e?e.tx:'Estado inicial da lista');
}
function mostraBusca(e){
 auto.hl.forEach(p=>p.el.classList.remove('cmp'));auto.hl=[];
 if(e){const p=pecas[e.i];p.el.classList.add('cmp');auto.hl.push(p);nota(+p.val);
  pecas.forEach((q,i)=>q.el.classList.toggle('fora',i<e.lo||i>e.hi));faixaR=[e.lo,e.hi];faixa(e.lo,e.hi)}
 else{pecas.forEach(q=>q.el.classList.remove('fora'));faixaR=null;faixa(null)}
 txt(e?e.tx:'Estado inicial da lista');
}
function proxima(k){
 const H=auto.hist,bu=auto.tipo==='busca',ch=new Set(),anim=ATRASOS[+$('#vel').value-1]>=170;let fim=false,ult=null;
 for(let t=0;t<k;t++){
  const e=auto.pos<H.length?H[auto.pos]:puxa();
  if(!e){fim=true;break}
  auto.pos++;auto.n++;ult=e;
  if(bu){comps++;if(e.op){const p=pecas[e.i];if(p.virada){p.virada=false;mov++;abre(p,anim)}}}
  else{e.d.forEach(([sl,,nv])=>{auto.A[sl]=nv;ch.add(sl)});mov+=e.w;comps+=e.dc}
 }
 ch.forEach(sl=>{const p=pecas[auto.A[sl]];p.slot=sl;posiciona(p)});
 if(ult){
  if(bu)mostraBusca(ult);
  else{mostraOrd(ult);
   if(ch.size)sMover(140+Math.min(1,+pecas[auto.A[[...ch][0]]].val/G.vmax)*90,1,'moverAuto');else if(ult.h.length)nota(+pecas[auto.A[ult.h[0]]].val)}
 }
 $('#titulo').textContent=tit();contador();
 if(cfg.torneio)$('#cron').textContent=fmt(auto.n*PASSO_MS);
 if(fim)fimAuto(auto.res);
}
function volta(){ // desfaz o último passo mostrado
 if(!auto||auto.pos<=0)return;
 const e=auto.hist[--auto.pos],bu=auto.tipo==='busca';auto.n--;
 if(bu){comps--;if(e.op){const p=pecas[e.i];p.virada=true;p.el.classList.add('virada');mov--}}
 else{e.d.forEach(([sl,o])=>{auto.A[sl]=o});e.d.forEach(([sl])=>{const p=pecas[auto.A[sl]];p.slot=sl;posiciona(p)});mov-=e.w;comps-=e.dc}
 const q=auto.pos>0?auto.hist[auto.pos-1]:null;bu?mostraBusca(q):mostraOrd(q);
 $('#titulo').textContent=tit();contador();
 if(cfg.torneio)$('#cron').textContent=fmt(auto.n*PASSO_MS);
}
const passo=()=>{if(auto)proxima(1)};
$('#vel').addEventListener('input',()=>{velManual=true});
function tick(){
 if(!auto)return;clearTimeout(auto.timer);if(!auto.play)return;
 const i=+$('#vel').value-1,d=ATRASOS[i];
 mesa.style.setProperty('--t',Math.min(.2,d*.0009)+'s');proxima(LOTE[i]);
 if(auto)auto.timer=setTimeout(tick,d);
}
function fimAuto(res){
 const A=auto,busca=A.tipo==='busca',T=cfg.torneio;
 clearTimeout(A.timer);auto=null;limpaDestaques();$('#desafio').hidden=true;txt('');
 pecas.forEach(p=>p.el.classList.remove('fora'));faixaR=null;faixa(null);
 let achou=true;
 if(busca){achou=res>=0;if(achou)verificaBusca();else ausente()}
 else{jaOrd=false;verifica()}
 barra();
 const un=busca?(mov===1?'virada':'viradas'):(mov===1?'movimento':'movimentos');
 $('#resAlgo').textContent=`${NOME[cfg.algo]} · ${cfg.vals.length} peças`+(busca&&!achou?' · valor ausente':'');
 $('#resGraf').innerHTML='';$('#resumo').classList.remove('larga');$('#resNum').className='';$('#resNum').textContent=mov.toLocaleString('pt-BR');
 $('#resLab').textContent=un+(cfg.desafio&&D?` · desafio: ${D.ok} de ${D.tot} acertos`:'');$('#resumo').hidden=false;atividade();
 if(T){
  const k=cfg.algo,ac=T.acc[k]=T.acc[k]||{ms:[],mov:[],cmp:[],det:[]};ac.ms.push(A.n*PASSO_MS);ac.mov.push(mov);ac.cmp.push(comps);
  ac.det.push({n:cfg.vals.length,vals:cfg.vals.length<=100?cfg.vals.slice():null,alvo:busca?cfg.alvo:''});
  const av=x=>x.reduce((q,y)=>q+y,0)/x.length,rd=x=>Math.round(av(x)*10)/10;
  let reg=T.map[k];
  if(!reg){reg={nome:NOME[k],tipo:tipoAtual(),id:Date.now()+T.i,alg:1,aus:false,conf:cfg.conf&&cfg.conf.k,confTxt:cfg.conf&&cfg.conf.t};T.map[k]=reg;ranking.push(reg);T.regs.push(reg)}
  reg.ms=av(ac.ms);reg.mov=rd(ac.mov);reg.cmp=rd(ac.cmp);reg.rod=ac.ms.length;reg.rounds=ac.ms.map((m,i)=>({ms:m,mov:ac.mov[i],cmp:ac.cmp[i],...ac.det[i]}));reg.aus=reg.aus||(busca&&!achou);
  guarda();renderRank();$('#cron').textContent=fmt(A.n*PASSO_MS);
  T.play=A.play;T.i++;
  const esp=+$('#vel').value>=10?500:1400;
  if(T.i>=T.lista.length){
   if(T.r+1<T.rod){
    const nova=()=>{T.espera=null;T.r++;T.i=0;if(cfg.gerA)Object.assign(cfg,novoConjunto(cfg.gerA));cfg.algo=T.lista[0];montaMesa(true)};
    if(T.autoRod===false){ // nova rodada pelo botão: a competição espera
     T.espera=nova;$('#titulo').textContent=`Rodada ${T.r+1} de ${T.rod} concluída.`;
     $('#btnProx').textContent=mob()?`Iniciar rodada ${T.r+2}/${T.rod}`:`Iniciar rodada ${T.r+2} de ${T.rod}`;$('#btnProx').hidden=false;barra();
    }else{
     $('#titulo').textContent=`Rodada ${T.r+1} de ${T.rod} concluída. Sorteando nova lista…`;
     T.tm=setTimeout(nova,esp)}
   }else{T.fim=true;torneioFim()}
  }else{$('#titulo').textContent=`Próximo: ${NOME[T.lista[T.i]]}…`;
   T.tm=setTimeout(()=>{cfg.algo=T.lista[T.i];montaMesa(true)},esp)}
 }
}
function melhor(L){return L.slice().sort(cmpRank)[0]}
function torneioResumo(){
 const T=cfg.torneio,L=T.regs.slice().sort(cmpRank),w=L[0];if(!w)return;
 const u=cfg.busca?'viradas':'movimentos',por=crit==='mov'?u:crit==='cmp'?'comparações':'tempo',mx=Math.max(1e-9,...L.map(r=>kv(r,crit)));
 $('#resAlgo').textContent=`Competição concluída`+(T.rod>1?` · média de ${T.rod} rodadas`:'')+` · vencedor (por ${por})`;
 $('#resNum').className='nome';$('#resNum').textContent=w.nome;$('#resLab').textContent=vTxt(w);
 $('#resGraf').innerHTML=L.map(r=>`<div class="gr"><span>${r.nome}</span><div><i style="width:${Math.max(2,kv(r,crit)/mx*100)}%"></i></div><b>${vTxt(r)}</b></div>`).join('');
 $('#resGraf').querySelectorAll('.gr').forEach((g,i)=>{ // tocar numa linha abre os detalhes daquele algoritmo
  g.classList.add('clic');g.tabIndex=0;g.setAttribute('role','button');g.title='Ver os detalhes';g.onclick=()=>detalhes(L[i]);
  g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();detalhes(L[i])}}});
 $('#resumo').classList.add('larga');$('#resumo').hidden=false;
}
function torneioFim(){
 $('#titulo').textContent='Competição concluída';$('#cNome').textContent='Concluída';
 $('#btnProx').hidden=false;barra();torneioResumo();
}
$('#fechaResumo').onclick=()=>$('#resumo').hidden=true;
function stopAuto(){
 if(auto){clearTimeout(auto.timer);auto=null}
 $('#desafio').hidden=true;txt('');
 if(cfg&&cfg.torneio)clearTimeout(cfg.torneio.tm);
 mesa.style.removeProperty('--t');limpaDestaques();
}
function limpaDestaques(){pecas.forEach(p=>p.el.classList.remove('cmp','pv'))}
$('#btnPlay').onclick=()=>{if(!auto)return;auto.play=!auto.play;if(cfg.torneio)cfg.torneio.play=auto.play;$('#btnPlay').textContent=auto.play?'Pausar':'Continuar';tick()};
$('#btnPasso').onclick=()=>{if(!auto)return;auto.play=false;if(cfg.torneio)cfg.torneio.play=false;clearTimeout(auto.timer);$('#btnPlay').textContent='Continuar';passo()};
$('#btnParar').onclick=()=>{
 const T=cfg.torneio;stopAuto();pecas.forEach(p=>p.el.classList.remove('fora'));faixaR=null;faixa(null);
 if(T){T.fim=true;$('#titulo').textContent='Competição interrompida';$('#btnProx').hidden=false}
 jaOrd=ordenado();barra();
};
