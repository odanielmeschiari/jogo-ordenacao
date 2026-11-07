/* Tela inicial: montar peças, gerador automático e início do jogo */
/* ===== Gerenciador ===== */
let ausOk=false;
const ausenteNaLista=t=>t!==''&&!isNaN(+t)&&!valores.includes(String(parseInt(t,10)));
function desenhaLista(){
 const l=$('#lista');l.innerHTML=valores.length?'':'<div class="vazio">Nenhuma peça ainda.</div>';ausOk=false;
 valores.forEach((v,i)=>{const d=document.createElement('div');d.className='mini peca';d.textContent=v;
  const x=document.createElement('button');x.className='x';x.textContent='✕';x.setAttribute('aria-label','Remover '+v);
  x.onclick=()=>{valores.splice(i,1);desenhaLista()};d.appendChild(x);l.appendChild(d)});
 atualizaManager();
}
function adiciona(){const inp=$('#valor'),t=inp.value.trim();
 if(t===''||isNaN(+t)||valores.length>=MAX){inp.focus();return}
 valores.push(String(parseInt(t,10)));inp.value='';inp.focus();desenhaLista()}
$('#btnAdd').onclick=adiciona;
$('#valor').addEventListener('keydown',e=>{if(e.key==='Enter')adiciona()});
$('#btnLimpar').onclick=()=>{valores=[];desenhaLista()};
function atualizaManager(){
 const b=radio('modo')==='busca',rand=radio('origem')==='aleatorio',comp=$('#comp').checked,t=$('#alvo').value.trim();
 const aus=b&&!rand&&valores.length>0&&ausenteNaLista(t);
 if(!aus)ausOk=false;
 $('#alvoAviso').hidden=!aus;
 if(aus)$('#alvoAviso').textContent=`⚠ O valor ${parseInt(t,10)} não está na lista de peças. Nesta busca ele nunca será encontrado: o jogo só vai avisar que não está presente depois que você virar todas as peças.`;
 $('#btnIniciar').textContent=b?(aus&&ausOk?'Iniciar mesmo assim':'Iniciar busca'):'Iniciar sandbox';$('#zeraBox').hidden=!$('#comp').checked;
 $('#alvoBox').hidden=!b||rand;$('#gerBox').hidden=!rand;$('#manualBox').hidden=rand;
 $('#btnIniciar').disabled=!rand&&!valores.length;
 // na geração aleatória a ordem inicial só pode ser "ordenado" ou "embaralhado" (não há ordem prévia a manter)
 const at=document.querySelector('input[name=ordem][value=atual]');at.closest('label').hidden=rand;
 if(rand&&at.checked)document.querySelector('input[name=ordem][value=emb]').checked=true;
 $('#gerTxt').textContent=(comp?'Cada competidor recebe peças':'As peças são sorteadas')+(comp?' sorteadas':'')+' nesta faixa'+(b?(comp?', e um valor a buscar sorteado entre elas':'; o valor a buscar é sorteado entre elas'):'')+'. Se a faixa tiver menos números que a quantidade, o jogo usa só os que existem.'+(comp?' Ao passar para o próximo competidor, a lista é sorteada de novo.':' Em "Reiniciar", a lista é sorteada de novo.');
}
document.querySelectorAll('input[name=modo],input[name=origem]').forEach(r=>r.onchange=atualizaManager);
$('#alvo').addEventListener('input',()=>{ausOk=false;atualizaManager()});
$('#comp').onchange=atualizaManager;
function sorteia(g){
 const n=Math.min(g.qtd,g.max-g.min+1),S=new Set();
 while(S.size<n)S.add(g.min+Math.floor(Math.random()*(g.max-g.min+1)));
 const a=[...S];if(g.ordem==='asc')a.sort((x,y)=>DIR*(x-y));
 cfg.vals=a.map(String);cfg.alvo=cfg.busca?cfg.vals[Math.floor(Math.random()*n)]:'';
}
document.querySelectorAll('.aba').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.aba').forEach(x=>x.classList.toggle('on',x===b));
 ['p1','p2'].forEach(id=>$('#'+id).hidden=id!==b.dataset.t)});
$('#btnIniciar').onclick=()=>{
 const d=dirAtual();let a=valores.slice(),o=radio('ordem');
 if(o==='asc')a.sort((x,y)=>d*(x-y));
 if(o==='emb'){for(let k=0;k<6;k++){embaralha(a);if(a.some((v,i)=>i&&d*(+a[i-1]-+v)>0))break}}
 const busca=radio('modo')==='busca',alvo=$('#alvo').value.trim();
 if(radio('origem')==='aleatorio'){
  const mn=parseInt($('#fmin').value),mx=parseInt($('#fmax').value),q=parseInt($('#fqtd').value);
  const bad=[['#fmin',mn],['#fmax',mx],['#fqtd',q]].find(([,v])=>isNaN(v));
  if(bad||mx<=mn){$(bad?bad[0]:'#fmax').focus();return}
  inicia({vals:[],busca,alvo:'',comp:$('#comp').checked,gera:{min:mn,max:mx,qtd:Math.max(2,Math.min(MAXG,q)),ordem:o},zera:$('#comp').checked&&$('#zera').checked});return}
 if(busca&&(alvo===''||isNaN(+alvo))){$('#alvo').focus();return}
 if(busca&&ausenteNaLista(alvo)&&!ausOk){ // avisa e pede confirmação antes de começar
  ausOk=true;atualizaManager();const av=$('#alvoAviso');av.classList.remove('pulsa');void av.offsetWidth;av.classList.add('pulsa');return}
 inicia({vals:a,busca,alvo:busca?String(parseInt(alvo,10)):'',comp:$('#comp').checked,zera:$('#comp').checked&&$('#zera').checked});
};

/* --- Gerador automático --- */
function preencheAlgo(){
 const L=radio('gtipo')==='buscar'?BUSCAS:NOMES;
 $('#algo').innerHTML=Object.entries(L).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');$('#algo').selectedIndex=0;algoCS.refresh();
 $('#tornLista').innerHTML=Object.entries(L).filter(([k])=>k!=='bogo').map(([k,v])=>`<label><input type="checkbox" value="${k}" checked><span>${v}</span></label>`).join('');
 atualizaGer();
}
function atualizaGer(){
 const busca=radio('gtipo')==='buscar',torn=radio('gmodo')==='torneio';
 $('#visBox').hidden=busca;$('#desBox').hidden=torn;$('#umBox').hidden=torn;$('#tornBox').hidden=!torn;$('#gAlvoBox').hidden=!busca;
 $('#gEmbBox').hidden=!(busca&&!torn&&$('#algo').value==='linear');
 $('#btnGerar').textContent=torn?'Iniciar competição':busca?'Gerar e buscar':'Gerar e ordenar';
 let t;
 if(torn)t='Todos os algoritmos recebem exatamente a mesma lista'+(busca?' e o mesmo valor a buscar':'')+'. Eles rodam um depois do outro e cada resultado é salvo no ranking. O tempo da competição é simulado (cada passo vale 1 ms) para que mudar a velocidade não altere o resultado. Dá para acelerar, pausar e avançar passo a passo. Com várias rodadas, cada uma usa uma lista nova e o ranking mostra a média.';
 else if(busca)t='Laranja: peça que acabou de ser virada. Peças apagadas já foram descartadas; a faixa iluminada marca o intervalo que ainda resta. Só a busca linear funciona em lista embaralhada; as demais precisam da lista ordenada, então ela é gerada já ordenada no sentido escolhido. Se o valor informado não estiver na lista gerada, a busca termina avisando que ele não está presente.';
 else t=(radio('gvis')==='linhas'?'Cada linha tem altura proporcional ao valor (uma linha 10 é o dobro de uma linha 5). ':'')+'Laranja: peças sendo comparadas. Azul: pivô do Quick sort. Dá para pausar, avançar passo a passo e mudar a velocidade durante a animação. Com muitas peças, aumente a velocidade.';
 if(!busca&&!torn&&$('#algo').value==='bogo')t+=' Bogo sort: só 6 peças, senão a animação nunca acabaria. Ele embaralha tudo e confere; em média precisa de n! tentativas.';
 $('#legGer').textContent=t;
}
document.querySelectorAll('input[name=gtipo]').forEach(r=>r.onchange=preencheAlgo);
document.querySelectorAll('input[name=gmodo],input[name=gvis]').forEach(r=>r.onchange=atualizaGer);
$('#algo').onchange=atualizaGer;
function novoConjunto(g){
 const vals=embaralha([...Array(Math.max(99,g.n))].map((_,i)=>String(i+1))).slice(0,g.n);
 let alvo='';
 if(g.tipo==='ordenar'&&g.forma&&g.forma!=='emb'){
  const n=g.n;
  if(g.forma==='rep'){const pool=Math.max(3,Math.round(n/4));return{vals:Array.from({length:n},()=>String(1+Math.floor(Math.random()*pool))),alvo:''}}
  vals.sort((x,y)=>DIR*(x-y));
  if(g.forma==='inv')vals.reverse();
  else for(let i=0,k=Math.max(1,Math.round(n*.06));i<k;i++){const x=Math.floor(Math.random()*n),y=Math.floor(Math.random()*n);[vals[x],vals[y]]=[vals[y],vals[x]]}
 }
 if(g.tipo==='buscar'){
  if(!g.emb)vals.sort((x,y)=>DIR*(x-y));
  alvo=g.alvo!==''?String(g.alvo):vals[Math.floor(Math.random()*vals.length)];
 }
 return{vals,alvo};
}
$('#btnGerar').onclick=()=>{
 let n=Math.max(2,Math.min(MAXG,parseInt($('#qtd').value)||8));const busca=radio('gtipo')==='buscar',torn=radio('gmodo')==='torneio';
 DIR=dirAtual();let algos=[$('#algo').value];if(!busca&&!torn&&algos[0]==='bogo'&&n>6){n=6;$('#qtd').value=6}
 if(torn){algos=[...document.querySelectorAll('#tornLista input:checked')].map(i=>i.value);
  if(algos.length<2){$('#tAviso').hidden=false;return}}
 $('#tAviso').hidden=true;
 const at=$('#galvo').value.trim();
 const g={n,tipo:busca?'buscar':'ordenar',forma:busca?'emb':radio('gforma'),emb:busca&&!torn&&algos[0]==='linear'&&$('#gemb').checked,alvo:busca&&at!==''&&!isNaN(+at)?parseInt(at,10):''};
 const c={...novoConjunto(g),busca,algo:algos[0],gerA:g,barras:!busca&&radio('gvis')==='linhas',desafio:!torn&&$('#gdesafio').checked,degrade:!busca&&radio('gvis')==='linhas'&&$('#gdegrade').checked};
 if(torn){c.comp=true;c.zera=$('#tzera').checked;c.torneio={lista:algos,i:0,r:0,rod:Math.max(1,Math.min(10,parseInt($('#trod').value)||1)),play:true,fim:false,regs:[],map:{},acc:{},tm:null}}
 inicia(c);
};
function inicia(c){setTimeout(atividade,0);c.dir=dirAtual();DIR=c.dir;
 if(c.comp&&c.zera){ranking=ranking.filter(r=>r.tipo!==(c.busca?'buscar':'ordenar'));guarda()}
 cfg=c;mostra('sandbox');montaMesa()}
function mostra(id){document.querySelectorAll('.tela').forEach(t=>t.classList.toggle('ativa',t.id===id))}
$('#btnVoltar').onclick=()=>{stopAuto();cancelaComp();$('#ap').hidden=true;$('#sp').hidden=true;mostra('gerenciador')};
$('#btnReiniciar').onclick=()=>montaMesa();
