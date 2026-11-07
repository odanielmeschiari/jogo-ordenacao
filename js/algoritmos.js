/* Algoritmos (geradores passo a passo): ordenação e busca */
/* ===== Gerador automático: ordenação ===== */
function gera(nome,vals){const a=vals.map((_,i)=>i);return{a,it:alg(nome,vals,a)}}
function* alg(nome,vals,a){ // cada yield: [destaques, pivô, posições alteradas]
 const n=vals.length,v=i=>+vals[i],sw=(i,j)=>{[a[i],a[j]]=[a[j],a[i]]};
 const gt=(x,y)=>DIR*(v(x)-v(y))>0; // x deve ficar depois de y
 const rg=(l,h)=>Array.from({length:h-l+1},(_,i)=>l+i);
 if(nome==='bolha')for(let i=0;i<n-1;i++)for(let j=0;j<n-1-i;j++){yield[[j,j+1]];if(gt(a[j],a[j+1])){sw(j,j+1);yield[[j,j+1],-1,[j,j+1]]}}
 if(nome==='selecao')for(let i=0;i<n-1;i++){let m=i;
  for(let j=i+1;j<n;j++){yield[[j],m];if(gt(a[m],a[j]))m=j}
  if(m!==i){sw(i,m);yield[[i,m],-1,[i,m]]}}
 if(nome==='insercao')for(let i=1;i<n;i++)for(let j=i;j>0;j--){yield[[j-1,j]];if(gt(a[j-1],a[j])){sw(j-1,j);yield[[j-1,j],-1,[j-1,j]]}else break}
 if(nome==='shell')for(let gp=n>>1;gp>0;gp>>=1)for(let i=gp;i<n;i++)for(let j=i;j>=gp;j-=gp){yield[[j-gp,j]];if(gt(a[j-gp],a[j])){sw(j-gp,j);yield[[j-gp,j],-1,[j-gp,j]]}else break}

 if(nome==='gnome'){let i=1;while(i<n){yield[[i-1,i]];if(gt(a[i-1],a[i])){sw(i-1,i);yield[[i-1,i],-1,[i-1,i]];if(i>1)i--}else i++}}
 if(nome==='cocktail'){let lo=0,hi=n-1,tr=true;while(tr&&lo<hi){tr=false;
  for(let j=lo;j<hi;j++){yield[[j,j+1]];if(gt(a[j],a[j+1])){sw(j,j+1);tr=true;yield[[j,j+1],-1,[j,j+1]]}}hi--;if(!tr)break;tr=false;
  for(let j=hi;j>lo;j--){yield[[j-1,j]];if(gt(a[j-1],a[j])){sw(j-1,j);tr=true;yield[[j-1,j],-1,[j-1,j]]}}lo++}}
 if(nome==='comb'){let g=n,tr=true;while(g>1||tr){g=Math.max(1,Math.floor(g/1.3));tr=false;
  for(let i=0;i+g<n;i++){yield[[i,i+g]];if(gt(a[i],a[i+g])){sw(i,i+g);tr=true;yield[[i,i+g],-1,[i,i+g]]}}}}
 if(nome==='tim'){const R=Math.max(4,Math.min(32,Math.ceil(n/8)));
  for(let lo=0;lo<n;lo+=R){const hi=Math.min(lo+R,n)-1;for(let i=lo+1;i<=hi;i++)for(let j=i;j>lo;j--){yield[[j-1,j]];if(gt(a[j-1],a[j])){sw(j-1,j);yield[[j-1,j],-1,[j-1,j]]}else break}}
  for(let sz=R;sz<n;sz*=2)for(let l=0;l+sz<n;l+=2*sz){const m=l+sz-1,h=Math.min(l+2*sz-1,n-1),r=rg(l,h),old=a.slice(l,h+1),Lf=old.slice(0,m+1-l),Rt=old.slice(m+1-l);
   yield[r,-1,[],0,1];let i=0,j=0,k=l,cm=0;
   while(i<Lf.length||j<Rt.length){if(i<Lf.length&&j<Rt.length)cm++;a[k++]=(j>=Rt.length||(i<Lf.length&&DIR*(v(Lf[i])-v(Rt[j]))<=0))?Lf[i++]:Rt[j++]}
   let mv=0;for(let q=l;q<=h;q++)if(a[q]!==old[q-l])mv++;yield[r,-1,r,mv,0,cm]}}
 if(nome==='bogo'){const all=rg(0,n-1);let t=0;const ok=()=>a.every((x,i)=>!i||DIR*(v(a[i-1])-v(x))<=0);
  while(!ok()){t++;for(let i=n-1;i>0;i--)sw(i,Math.floor(Math.random()*(i+1)));
   yield[all,-1,all,n,0,0,`Tentativa ${t}: embaralhou tudo`];
   yield[all,-1,[],0,0,n-1,ok()?`Tentativa ${t}: ordenou! Foi só sorte.`:`Tentativa ${t}: ainda desordenado… embaralha de novo`]}}
 if(nome==='contagem'||nome==='radix'){ // não comparam valores: leem, contam e posicionam
  const vs=Array.from({length:n},(_,i)=>v(i)),mn=Math.min(...vs),mx=Math.max(...vs),where=a.map((_,i)=>i);
  const coloca=function*(out){ // leva cada peça ao lugar definido em out (a posição k recebe out[k])
   for(let k=0;k<n;k++){const s=where[out[k]];
    if(s===k){yield[[k],-1,[],0,1];continue}
    sw(k,s);where[a[k]]=k;where[a[s]]=s;yield[[k,s],-1,[k,s]]}};
  const ordena=function*(chave,K){ // ordenação estável por contagem; chave(peça) devolve de 0 a K-1
   const cnt=new Array(K).fill(0),atual=a.slice();
   for(let i=0;i<n;i++){yield[[i],-1,[],0,1];cnt[chave(a[i])]++}
   for(let k=1;k<K;k++)cnt[k]+=cnt[k-1];
   const out=new Array(n);for(let i=n-1;i>=0;i--)out[--cnt[chave(atual[i])]]=atual[i];
   yield*coloca(out)};
  if(nome==='contagem')yield*ordena(p=>DIR>0?v(p)-mn:mx-v(p),mx-mn+1);
  else for(let e=1;;e*=10){yield*ordena(p=>{const d=Math.floor((v(p)-mn)/e)%10;return DIR>0?d:9-d},10);if(e*10>mx-mn)break}
 }
 if(nome==='quick'){const q=function*(lo,hi){if(lo>=hi)return;const pv=v(a[hi]);let i=lo;
  for(let j=lo;j<hi;j++){yield[[j],hi];if(DIR*(v(a[j])-pv)<0){if(i!==j){sw(i,j);yield[[i,j],hi,[i,j]]}i++}}
  if(i!==hi){sw(i,hi);yield[[i],i,[i,hi]]}yield*q(lo,i-1);yield*q(i+1,hi)};yield*q(0,n-1)}
 if(nome==='merge'){const m=function*(lo,hi){if(hi<=lo)return;const mid=(lo+hi)>>1;yield*m(lo,mid);yield*m(mid+1,hi);
  const r=rg(lo,hi),old=a.slice(lo,hi+1),L=old.slice(0,mid+1-lo),R=old.slice(mid+1-lo);yield[r,-1,[],0,1];let i=0,j=0,k=lo,cm=0;
  while(i<L.length||j<R.length){if(i<L.length&&j<R.length)cm++;a[k++]=(j>=R.length||(i<L.length&&DIR*(v(L[i])-v(R[j]))<=0))?L[i++]:R[j++]}let mv=0;for(let q=lo;q<=hi;q++)if(a[q]!==old[q-lo])mv++;yield[r,-1,r,mv,0,cm]};yield*m(0,n-1)}
 if(nome==='heap'){const sift=function*(i,e){for(;;){const l=2*i+1,r=l+1;let m=i;
   if(l<e&&gt(a[l],a[m]))m=l;if(r<e&&gt(a[r],a[m]))m=r;yield[[i,m]];if(m===i)break;sw(i,m);yield[[i,m],-1,[i,m]];i=m}};
  for(let i=(n>>1)-1;i>=0;i--)yield*sift(i,n);for(let e=n-1;e>0;e--){sw(0,e);yield[[0,e],-1,[0,e]];yield*sift(0,e)}}
}

/* ===== Gerador automático: busca ===== */
function* buscaGen(nome,vals,alvo){ // cada yield: [peça lida, início do intervalo, fim do intervalo]; retorna o índice achado ou -1
 const n=vals.length,t=+alvo,V=i=>+vals[i],c=x=>DIR*(x-t); // c<0: a peça vem antes do alvo; c>0: vem depois
 const ler=function*(i,lo,hi){yield[i,lo,hi];return V(i)};
 if(nome==='linear'){
  for(let i=0;i<n;i++){const x=yield*ler(i,i,n-1);if(x===t)return i}
 }
 if(nome==='binaria'){
  let lo=0,hi=n-1;
  while(lo<=hi){const m=(lo+hi)>>1,x=yield*ler(m,lo,hi),k=c(x);if(k===0)return m;if(k<0)lo=m+1;else hi=m-1}
 }
 if(nome==='ternaria'){
  let lo=0,hi=n-1;
  while(lo<=hi){
   const th=Math.floor((hi-lo)/3),m1=lo+th,m2=hi-th;
   const x1=yield*ler(m1,lo,hi),k1=c(x1);if(k1===0)return m1;
   if(k1>0){hi=m1-1;continue}
   if(m2!==m1){const x2=yield*ler(m2,lo,hi),k2=c(x2);if(k2===0)return m2;if(k2<0){lo=m2+1;continue}lo=m1+1;hi=m2-1;continue}
   lo=m1+1;
  }
 }
 if(nome==='interp'){
  let lo=0,hi=n-1;
  while(lo<=hi){
   const a=yield*ler(lo,lo,hi),b=yield*ler(hi,lo,hi);
   if(t<Math.min(a,b)||t>Math.max(a,b))return -1; // alvo fora da faixa conhecida
   if(a===t)return lo;if(b===t)return hi;
   const pos=b===a?lo:lo+Math.floor((t-a)*(hi-lo)/(b-a)),p=Math.min(hi,Math.max(lo,pos));
   const x=yield*ler(p,lo,hi),k=c(x);if(k===0)return p;if(k<0)lo=p+1;else hi=p-1;
  }
 }
 if(nome==='salto'){
  const m=Math.max(1,Math.floor(Math.sqrt(n)));let prev=0,step=m;
  for(;;){
   const e=Math.min(step,n)-1,x=yield*ler(e,prev,n-1),k=c(x);
   if(k===0)return e;
   if(k>0){for(let i=prev;i<e;i++){const y=yield*ler(i,prev,e-1);if(y===t)return i;if(c(y)>0)return -1}return -1}
   prev=step;step+=m;if(prev>=n)return -1;
  }
 }
 if(nome==='fib'){
  let f2=0,f1=1,f=1;while(f<n){f2=f1;f1=f;f=f1+f2}
  let off=-1;
  while(f>1){
   if(off+1>=n)break;
   const i=Math.min(off+f2,n-1),x=yield*ler(i,off+1,Math.min(n-1,off+f)),k=c(x);
   if(k<0){f=f1;f1=f2;f2=f-f1;off=i}
   else if(k>0){f=f2;f1=f1-f2;f2=f-f1}
   else return i;
  }
  if(f1&&off+1<n){const x=yield*ler(off+1,off+1,off+1);if(x===t)return off+1}
 }
 if(nome==='expo'){
  const x0=yield*ler(0,0,n-1);if(x0===t)return 0;
  let i=1;
  while(i<n){const x=yield*ler(i,0,n-1);if(c(x)>=0)break;i*=2}
  let lo=Math.floor(i/2),hi=Math.min(i,n-1);
  while(lo<=hi){const m=(lo+hi)>>1,x=yield*ler(m,lo,hi),k=c(x);if(k===0)return m;if(k<0)lo=m+1;else hi=m-1}
 }
 return -1;
}
