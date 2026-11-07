/* Janela de ajuda */
/* ===== Ajuda ===== */
const INFO_ORD=[
 ['bolha','Compara vizinhos e troca os que estão fora de ordem; o maior “sobe” a cada volta. Esta versão não para antes.','O(n²)','O(n²)','O(n²)'],
 ['selecao','Procura a menor peça do resto e a coloca na próxima posição.','O(n²)','O(n²)','O(n²)'],
 ['insercao','Encaixa cada peça no lugar certo entre as que já estão ordenadas. Voa em lista quase ordenada.','O(n)','O(n²)','O(n²)'],
 ['shell','Insertion sort com saltos que vão diminuindo até 1.','O(n log n)','~O(n^1,5)','O(n²)'],
 ['quick','Escolhe um pivô (última peça) e separa menores e maiores. Sofre em lista já ordenada.','O(n log n)','O(n log n)','O(n²)'],
 ['merge','Divide ao meio, ordena cada metade e intercala.','O(n log n)','O(n log n)','O(n log n)'],
 ['heap','Monta um heap (árvore de máximos) e retira o maior repetidamente.','O(n log n)','O(n log n)','O(n log n)'],
 ['contagem','Conta quantas vezes cada valor aparece e posiciona as peças, sem comparar. k = amplitude dos valores.','O(n + k)','O(n + k)','O(n + k)'],
 ['radix','Ordena dígito a dígito (unidades, dezenas…) com contagem estável. d = nº de dígitos.','O(d·n)','O(d·n)','O(d·n)'],
 ['gnome','Anda para a frente; ao achar um par fora de ordem, troca e volta um passo, como um gnomo arrumando vasos.','O(n)','O(n²)','O(n²)'],
 ['cocktail','Bubble sort nos dois sentidos: uma volta leva o maior para o fim, a seguinte leva o menor para o começo.','O(n)','O(n²)','O(n²)'],
 ['comb','Bubble sort com um salto grande que vai encolhendo (÷1,3). Tira logo as “tartarugas” do começo.','O(n log n)','~O(n²)','O(n²)'],
 ['tim','Insertion sort em blocos pequenos e depois intercala os blocos, como o Merge. É o que Python e Java usam (aqui, versão simplificada).','O(n)','O(n log n)','O(n log n)'],
 ['bogo','Embaralha tudo e confere se ficou ordenado; repete até dar certo. Ninguém usa: com n peças são n! tentativas em média (6 peças: ~720; 10: ~3,6 milhões; 20: mais que a idade do universo). Serve de piada e de lição sobre algoritmo ruim.','O(n)','O(n·n!)','sem limite']];
const INFO_BUS=[
 ['linear','Olha peça por peça. Única que aceita lista embaralhada.','Não','O(n)'],
 ['binaria','Olha o meio e descarta a metade errada.','Sim','O(log n)'],
 ['ternaria','Dois pontos dividem a lista em três partes; descarta duas.','Sim','O(log n)'],
 ['interp','Estima onde o valor está, como quem abre uma lista telefônica.','Sim','O(log log n) médio · O(n) pior'],
 ['salto','Pula de √n em √n e depois olha o bloco peça por peça.','Sim','O(√n)'],
 ['expo','Dobra o passo até passar do valor e faz busca binária ali.','Sim','O(log n)'],
 ['fib','Divide o intervalo em tamanhos de Fibonacci (só usa soma e subtração).','Sim','O(log n)']];
function montaAjuda(){
 const tr=r=>`<tr><td>${NOME[r[0]]}</td><td>${r[1]}</td>${r.slice(2).map(x=>`<td class="o">${x}</td>`).join('')}</tr>`;
 const cor=(c,t)=>`<li><span class="sq" style="--c:${c}"></span>${t}</li>`;
 $('#ajCorpo').innerHTML=`
 <h2>Cores</h2><ul>
  ${cor('#ffb347','<b>Laranja</b>: peças sendo comparadas (ordenação) ou peça que acabou de ser lida (busca).')}
  ${cor('#5ec8ff','<b>Azul</b>: pivô do Quick sort.')}
  ${cor('#3ddc84','<b>Verde</b>: tudo ordenado, ou valor encontrado.')}
  ${cor('#ff4d4d','<b>Vermelho</b>: o valor buscado não está na lista (a tela pisca).')}
  <li><span class="sq d"></span><b>Peça apagada</b>: já descartada pela busca. <span class="sq f" style="margin-left:6px"></span><b>Faixa iluminada</b>: intervalo que ainda resta.</li>
 </ul>
 <h2>Atalhos de teclado (animação automática)</h2><ul>
  <li><b>Espaço</b>: pausa e continua. <b>→</b>: avança um passo. <b>←</b>: volta um passo.</li>
  <li><b>+</b> e <b>−</b>: aumentam e diminuem a velocidade.</li></ul>
 <p class="nota">O texto no alto da tela explica cada passo. Voltar passo funciona enquanto o algoritmo roda e guarda os últimos 15 mil passos. Nas linhas verticais, o botão “Cores” liga e desliga o degradê por valor.</p>
 <h2>Algoritmos de ordenação</h2>
 <div class="tbl"><table><thead><tr><th>Nome</th><th>Como funciona</th><th>Melhor</th><th>Médio</th><th>Pior</th></tr></thead><tbody>${INFO_ORD.map(tr).join('')}</tbody></table></div>
 <p class="nota">n = quantidade de peças. Counting e Radix não comparam valores: a contagem de comparações fica em zero.</p>
 <h2>Algoritmos de busca</h2>
 <div class="tbl"><table><thead><tr><th>Nome</th><th>Como funciona</th><th>Lista ordenada?</th><th>Complexidade</th></tr></thead><tbody>${INFO_BUS.map(tr).join('')}</tbody></table></div>`;
}
montaAjuda();
const fechaAj=()=>{$('#aj').hidden=true};
document.querySelectorAll('.btnAj').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();$('#ap').hidden=true;$('#sp').hidden=true;$('#aj').hidden=false;$('#ajx').focus()}));
$('#ajx').onclick=fechaAj;$('#aj').addEventListener('click',e=>{if(e.target===$('#aj'))fechaAj()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')fechaAj()});
