/* Texto de passo, aviso (toast), passo anterior e degradê de cores */
const txt=s=>{const e=$('#passoTxt');e.textContent=s;e.hidden=!s};
let toastT;function toast(s){const t=$('#toast');t.textContent=s;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),1200)}
$('#btnAnt').onclick=()=>{if(!auto||cfg.desafio)return;auto.play=false;if(cfg.torneio)cfg.torneio.play=false;clearTimeout(auto.timer);$('#btnPlay').textContent='Continuar';volta()};
const corVal=v=>{const f=(v-G.vmin)/((G.vmax-G.vmin)||1),h=Math.round(260*(1-f));return`linear-gradient(180deg,hsl(${h} 85% 64%),hsl(${h} 85% 44%))`};
$('#btnCor').onclick=()=>{cfg.degrade=!cfg.degrade;desenha();barra()};
