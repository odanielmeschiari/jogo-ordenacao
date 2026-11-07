/* Papéis de parede: id -> arquivo em assets/walls/ */
const WALL_IMG={
 mesavermelha:'assets/walls/mesavermelha.webp',
 mesaverde:'assets/walls/mesaverde.webp',
 tabuas:'assets/walls/tabuas.webp',
 areia:'assets/walls/areia.webp',
 tintamarrom:'assets/walls/tintamarrom.webp',
 vilacosteira:'assets/walls/vilacosteira.webp',
 vialactea:'assets/walls/vialactea.webp',
 montanha:'assets/walls/montanha.webp',
 juta:'assets/walls/juta.webp',
 viaduto:'assets/walls/viaduto.webp',
 rochas:'assets/walls/rochas.webp',
 azulliso:'assets/walls/azulliso.webp',
 valenevado:'assets/walls/valenevado.webp',
 trilhaluz:'assets/walls/trilhaluz.webp',
 estrada:'assets/walls/estrada.webp',
 serravermelha:'assets/walls/serravermelha.webp',
 aurora:'assets/walls/aurora.webp',
 montanhanublada:'assets/walls/montanhanublada.webp',
 vale:'assets/walls/vale.webp',
 praia:'assets/walls/praia.webp',
 canion:'assets/walls/canion.webp',
 tintaazul:'assets/walls/tintaazul.webp',
 lagoturquesa:'assets/walls/lagoturquesa.webp',
 neblina:'assets/walls/neblina.webp',
 pinheiros:'assets/walls/pinheiros.webp',
 vilalago:'assets/walls/vilalago.webp',
 pagode:'assets/walls/pagode.webp',
 azulonda:'assets/walls/azulonda.webp',
 samambaias:'assets/walls/samambaias.webp',
 carro:'assets/walls/carro.webp'
};
/* Miniaturas leves (400x225) para o seletor: evita carregar 30 imagens grandes só para mostrar os quadradinhos. */
const WALL_THUMB=Object.fromEntries(Object.entries(WALL_IMG).map(([k,v])=>[k,v.replace('assets/walls/','assets/walls/thumbs/')]));
/* Começa a baixar o papel de parede escolhido já no <head>, sem esperar todos os scripts: quando aplicaWall() rodar, a imagem já está (ou quase) no cache. */
try{const u=WALL_IMG[visual.wall]||WALL_IMG.mesavermelha,l=document.createElement('link');l.rel='preload';l.as='image';l.href=u;document.head.appendChild(l)}catch(e){}
