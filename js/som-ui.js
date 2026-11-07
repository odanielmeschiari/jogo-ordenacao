/* Painel de som (efeitos liga/desliga e teste) */
const salvaSons=()=>{try{localStorage.setItem('mesa-som',som?'1':'0');localStorage.setItem('mesa-sons',JSON.stringify(sons))}catch(e){}};
const atualizaSom=()=>{document.querySelectorAll('.btnSom').forEach(b=>b.textContent=som?'Som: ligado':'Som: desligado');
 $('#somMestre').checked=som;$('#spLista').classList.toggle('mudo',!som)};
function montaSom(){
 $('#spLista').innerHTML=EFEITOS.map(([k,n])=>`<div class="srow"><div class="seg"><label><input type="checkbox" data-k="${k}"${sons[k]!==false?' checked':''}><span>${n}</span></label></div><button type="button" class="sec" data-t="${k}" aria-label="Ouvir: ${n}">▶</button></div>`).join('');
 $('#spLista').addEventListener('change',e=>{const k=e.target.dataset.k;if(!k)return;sons[k]=e.target.checked;salvaSons();if(e.target.checked)testa(k)});
 $('#spLista').addEventListener('click',e=>{const b=e.target.closest('button[data-t]');if(b)testa(b.dataset.t)});
 $('#somMestre').onchange=e=>{som=e.target.checked;salvaSons();atualizaSom();if(som)testa('mover')};
 document.querySelectorAll('.btnSom').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();abreAp(b,$('#sp'))}));
 atualizaSom();
}
montaSom();
