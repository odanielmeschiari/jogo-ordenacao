/* Atalhos de teclado */
const sbAtivo=()=>$('#sandbox').classList.contains('ativa')&&$('#aj').hidden&&$('#gf').hidden;
document.addEventListener('keydown',e=>{
 if(e.key==='Escape')$('#gf').hidden=true;
 if(!sbAtivo()||e.ctrlKey||e.metaKey||e.altKey)return;
 const t=e.target.tagName,k=e.key;if(t==='INPUT'||t==='SELECT'||t==='TEXTAREA'||cfg.desafio||(!auto&&!emTorneio()))return;
 if(k===' '||k==='ArrowRight'||k==='ArrowLeft'){e.preventDefault();if(t==='BUTTON')e.target.blur();$(k===' '?'#btnPlay':k==='ArrowRight'?'#btnPasso':'#btnAnt').click()}
 else if(k==='+'||k==='='||k==='-'||k==='_'){const v=$('#vel');v.value=+v.value+(k==='-'||k==='_'?-1:1);v.dispatchEvent(new Event('input'));toast('Velocidade '+v.value+' de 14')}
});
document.addEventListener('keyup',e=>{if(e.key===' '&&sbAtivo()&&(auto||emTorneio()))e.preventDefault()});
