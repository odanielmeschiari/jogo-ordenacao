/* Temas de cor. Carregado no <head>, antes do CSS, para pintar certo desde o primeiro quadro. */
/* ===== Temas de cor (definidos no <head> para pintar certo desde o primeiro quadro) ===== */
const TEMAS={
 marrom:{nome:'Marrom',v:{t1:'#f7e6bd',t2:'#f2dcab',t3:'#e0bd80',tinta:'#4a2a10',edge:'#a8793a',ein:'140,90,30',gr:'150,100,40',
  vi1:'#d6b27a',vi2:'#bf9558',vi3:'#a47a40',vedge:'#7e5a27',vein:'90,50,10',vgr:'90,50,10',
  dk:'40,16,6',dk2:'25,9,3',ln:'255,214,150',h:'#f2dcab',x2:'#d9b57e',x3:'#c9a572',x4:'#e7c78f',dim:'#a98456',
  b1:'#f2dcab',b2:'#e0bd80',be:'#9c6f33',bi:'#4a2a10',vaga:'rgba(20,6,0,.32)',alvo:'rgba(255,225,150,.28)',alvoln:'rgba(255,230,170,.8)',
  fundo:'#3b1a0c',onwall:'rgba(255,226,170,.8)',halo:'#000',well:'rgba(0,0,0,.3)',inbg:'rgba(0,0,0,.35)',brilho:'#ffe9b8'}},
 azul:{nome:'Azul',v:{t1:'#e6f2ff',t2:'#cde3fb',t3:'#8fbdee',tinta:'#0f2a4d',edge:'#4b78ad',ein:'40,90,150',gr:'40,90,150',
  vi1:'#5f93d0',vi2:'#4a7dbb',vi3:'#36629c',vedge:'#274a78',vein:'10,30,70',vgr:'10,30,70',
  dk:'8,22,48',dk2:'4,12,30',ln:'140,190,255',h:'#d7e9ff',x2:'#9fc4f0',x3:'#8bb2e0',x4:'#b9d6f8',dim:'#6d93c4',
  b1:'#cfe4fb',b2:'#8fbdee',be:'#4b78ad',bi:'#0f2a4d',vaga:'rgba(0,10,40,.35)',alvo:'rgba(160,205,255,.3)',alvoln:'rgba(190,225,255,.85)',
  fundo:'#0b1f3d',onwall:'rgba(205,228,255,.85)',halo:'#000',well:'rgba(0,0,0,.3)',inbg:'rgba(0,0,0,.35)',brilho:'#dcecff'}},
 verde:{nome:'Verde',v:{t1:'#e6f8de',t2:'#c9ecbb',t3:'#8fd17f',tinta:'#11401c',edge:'#4f9540',ein:'30,100,40',gr:'30,100,40',
  vi1:'#5eb36a',vi2:'#479a55',vi3:'#2f7d3f',vedge:'#1f5a2b',vein:'5,50,15',vgr:'5,50,15',
  dk:'6,34,16',dk2:'3,22,9',ln:'150,235,150',h:'#d6f5cf',x2:'#9fd997',x3:'#88c581',x4:'#b8e8b0',dim:'#6aa164',
  b1:'#c9ecbb',b2:'#8fd17f',be:'#4f9540',bi:'#11401c',vaga:'rgba(0,25,5,.35)',alvo:'rgba(170,240,160,.3)',alvoln:'rgba(200,255,190,.85)',
  fundo:'#0b2e14',onwall:'rgba(210,250,200,.85)',halo:'#000',well:'rgba(0,0,0,.3)',inbg:'rgba(0,0,0,.35)',brilho:'#dcf8d4'}},
 vermelho:{nome:'Vermelho',v:{t1:'#ffeadf',t2:'#fbcdbb',t3:'#ee9a82',tinta:'#4d1410',edge:'#b4583f',ein:'150,50,30',gr:'160,50,30',
  vi1:'#d1624f',vi2:'#b64838',vi3:'#983429',vedge:'#6c2018',vein:'70,10,5',vgr:'70,10,5',
  dk:'46,10,10',dk2:'28,5,5',ln:'255,170,150',h:'#ffd9cc',x2:'#e8a898',x3:'#d89888',x4:'#f3bfb0',dim:'#b07062',
  b1:'#fbcdbb',b2:'#ee9a82',be:'#b4583f',bi:'#4d1410',vaga:'rgba(30,0,0,.35)',alvo:'rgba(255,190,170,.3)',alvoln:'rgba(255,210,195,.85)',
  fundo:'#4a0d0d',onwall:'rgba(255,215,200,.85)',halo:'#000',well:'rgba(0,0,0,.3)',inbg:'rgba(0,0,0,.35)',brilho:'#ffe3d8'}},
 preto:{nome:'Preto',v:{t1:'#5d616a',t2:'#4b4e56',t3:'#383b42',tinta:'#f4f5f7',edge:'#0b0c0e',ein:'0,0,0',gr:'255,255,255',
  vi1:'#25272c',vi2:'#1b1d21',vi3:'#131417',vedge:'#050506',vein:'0,0,0',vgr:'255,255,255',
  dk:'16,16,19',dk2:'6,6,8',ln:'200,205,215',h:'#eceef2',x2:'#b5bac4',x3:'#a0a6b1',x4:'#cfd3db',dim:'#7b818c',
  b1:'#eceef2',b2:'#b9bec8',be:'#7a808b',bi:'#14161a',vaga:'rgba(0,0,0,.45)',alvo:'rgba(255,255,255,.14)',alvoln:'rgba(255,255,255,.7)',
  fundo:'#0c0d0f',onwall:'rgba(235,238,245,.85)',halo:'#000',well:'rgba(255,255,255,.07)',inbg:'rgba(0,0,0,.45)',brilho:'#eef0f4'}},
 branco:{nome:'Branco',v:{t1:'#ffffff',t2:'#f4f2ed',t3:'#dcd8cf',tinta:'#2a2d33',edge:'#a39d90',ein:'120,110,90',gr:'120,110,90',
  vi1:'#cbc7bd',vi2:'#b6b2a7',vi3:'#9f9b90',vedge:'#7a766b',vein:'70,65,55',vgr:'70,65,55',
  dk:'250,249,246',dk2:'236,234,229',ln:'40,44,52',h:'#20232a',x2:'#454a54',x3:'#5a606b',x4:'#30343c',dim:'#7f8590',
  b1:'#4a4f5a',b2:'#2c3037',be:'#14161a',bi:'#ffffff',vaga:'rgba(0,0,0,.2)',alvo:'rgba(0,0,0,.12)',alvoln:'rgba(30,34,42,.7)',
  fundo:'#2a2c31',onwall:'rgba(235,238,245,.88)',halo:'#000',well:'rgba(0,0,0,.06)',inbg:'rgba(255,255,255,.75)',brilho:'#20232a'}}
};
let visual={tema:'marrom',wall:'mesavermelha'};
try{Object.assign(visual,JSON.parse(localStorage.getItem('mesa-visual')||'{}'))}catch(e){}
if(!TEMAS[visual.tema])visual.tema='marrom';
function aplicaTema(){const r=document.documentElement.style,v=TEMAS[visual.tema].v;for(const k in v)r.setProperty('--'+k,v[k])}
aplicaTema();
