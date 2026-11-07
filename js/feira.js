/* Modo feira: volta ao início após inatividade */
/* ===== Modo feira ===== */
const IDLE=180000;let idleT=null;
function atividade(){
 clearTimeout(idleT);
 if($('#feira').checked&&$('#sandbox').classList.contains('ativa')&&!auto&&!emTorneio())idleT=setTimeout(()=>{saidaForcada=true;$('#btnVoltar').click();irInicio()},IDLE);
}
['pointerdown','pointermove','keydown'].forEach(t=>document.addEventListener(t,atividade));
$('#feira').onchange=atividade;
$('#btnVoltar').addEventListener('click',()=>clearTimeout(idleT));
