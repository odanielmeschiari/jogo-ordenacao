/* Constantes, estado global e utilitários compartilhados */
const MAX=20,MAXG=1000,PASSO_MS=1,$=s=>document.querySelector(s),mesa=$('#mesa');
let DIG=2,mov=0,comps=0,valores=[],pecas=[],vagasEl=[],idxEl=[],cfg=null,G={},z=10,jaOrd=false,auto=null,DIR=1;
const NOMES={bolha:'Bubble sort',selecao:'Selection sort',insercao:'Insertion sort',quick:'Quick sort',merge:'Merge sort',heap:'Heap sort',shell:'Shell sort',contagem:'Counting sort',radix:'Radix sort',gnome:'Gnome sort',cocktail:'Cocktail sort',comb:'Comb sort',tim:'Tim sort',bogo:'Bogo sort (de brincadeira)'};
const BUSCAS={linear:'Busca linear',binaria:'Busca binária',ternaria:'Busca ternária',interp:'Busca por interpolação',salto:'Busca por salto (jump)',expo:'Busca exponencial',fib:'Busca de Fibonacci'};
const NOME={...NOMES,...BUSCAS};
const embaralha=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const radio=n=>document.querySelector(`input[name=${n}]:checked`).value;
const dirAtual=()=>radio('dir')==='desc'?-1:1;
const nomeDir=()=>DIR>0?'crescente':'decrescente';
