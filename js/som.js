/* Som sintetizado (Web Audio, sem arquivos) */
/* ===== Som (sintetizado, sem arquivos) ===== */
const EFEITOS=[['mover','Peças arrastadas à mão (madeira)'],['moverAuto','Peças se movendo no gerador automático (madeira)'],['virar','Virar peça na busca'],['nota','Tom das comparações (agudo = valor maior)'],
 ['contagem','Contagem regressiva'],['vitoria','Sucesso (ordenado / encontrado)'],['erro','Erro (valor ausente)']];
let AC=null,BUS=null,som=true,sons={},ultSom=0,RUI=null;
EFEITOS.forEach(([k])=>sons[k]=k!=='moverAuto');
try{som=localStorage.getItem('mesa-som')!=='0'}catch(e){}
try{Object.assign(sons,JSON.parse(localStorage.getItem('mesa-sons')||'{}'))}catch(e){}
const on=k=>som&&sons[k]!==false;
function audio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC.state==='suspended')AC.resume();return AC}
function saida(a){ // filtro suave + compressor, para muitas batidas seguidas não estourarem
 if(!BUS){const lp=a.createBiquadFilter(),cp=a.createDynamicsCompressor(),g=a.createGain();lp.type='lowpass';lp.frequency.value=7000;g.gain.value=.9;
  lp.connect(cp);cp.connect(g);g.connect(a.destination);BUS=lp}
 return BUS;
}
function bloco(f,g=1,o={}){ // batida de madeira: estalo seco + corpo com parciais inarmônicos e decaimento muito curto
 const a=audio();if(!a)return;const t=a.currentTime;if(t-ultSom<.012)return;ultSom=t;
 const out=saida(a),br=o.br||1,dec=o.dec||.075;f*=1+(Math.random()-.5)*.07;
 if(!RUI){RUI=a.createBuffer(1,Math.floor(a.sampleRate*.02),a.sampleRate);const d=RUI.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3)}
 const ns=a.createBufferSource(),bp=a.createBiquadFilter(),gc=a.createGain();
 ns.buffer=RUI;bp.type='bandpass';bp.frequency.value=2200*br;bp.Q.value=.8;gc.gain.value=.5*g;ns.connect(bp);bp.connect(gc);gc.connect(out);ns.start(t);
 [[1,1,1],[2.4,.5,.55],[4.3,.22,.3]].forEach(([r,k,d])=>{
  const os=a.createOscillator(),gn=a.createGain(),fr=f*r,fim=t+dec*d;
  os.type='sine';os.frequency.setValueAtTime(fr*1.04,t);os.frequency.exponentialRampToValueAtTime(fr,t+.012);
  gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(.55*g*k,t+.0015);gn.gain.exponentialRampToValueAtTime(.0008,fim);
  os.connect(gn);gn.connect(out);os.start(t);os.stop(fim+.02)});
}
function tom(f,d=.12,g=.2,atraso=0,tipo='sine'){
 if(!som)return;const a=audio();if(!a)return;const t=a.currentTime+atraso,o=a.createOscillator(),gn=a.createGain();
 o.type=tipo;o.frequency.value=f;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(g,t+.01);gn.gain.exponentialRampToValueAtTime(.001,t+d);
 o.connect(gn);gn.connect(saida(a));o.start(t);o.stop(t+d+.02);
}
const sMover=(f=170,g=1,k='mover')=>{if(on(k))bloco(f*2.4,g)};
const sVirar=()=>{if(on('virar'))bloco(1150,.75,{br:1.7,dec:.05})};
const tomValor=r=>tom(200+r*900,.07,.16,0,'triangle'); // r de 0 a 1: valor maior, tom mais agudo
const nota=v=>{if(on('nota'))tomValor(Math.min(1,v/(G.vmax||1)))};
const sContagem=go=>{if(on('contagem'))tom(go?988:660,go?.35:.14,.16)};
function fanfarra(ok){
 if(ok){if(on('vitoria'))[523,659,784,1047].forEach((f,i)=>tom(f,.25,.18,i*.09,'triangle'))}
 else if(on('erro')){tom(196,.3,.2,0,'sawtooth');tom(147,.45,.2,.2,'sawtooth')}
}
function forca(k,fn){const a=sons[k],m=som;sons[k]=true;som=true;try{fn()}finally{sons[k]=a;som=m}} // toca mesmo se o efeito estiver desligado (teste)
function testa(k){
 const em=(ms,fn)=>setTimeout(()=>forca(k,fn),ms);
 if(k==='mover'||k==='moverAuto')[150,190,230,170].forEach((f,i)=>em(i*140,()=>sMover(f,1,k)));
 else if(k==='virar'){em(0,sVirar);em(260,sVirar)}
 else if(k==='nota')[.1,.4,.7,1].forEach((r,i)=>em(i*130,()=>tomValor(r)));
 else if(k==='contagem'){[0,700,1400].forEach(ms=>em(ms,()=>sContagem(false)));em(2100,()=>sContagem(true))}
 else if(k==='vitoria')em(0,()=>fanfarra(true));
 else if(k==='erro')em(0,()=>fanfarra(false));
}
