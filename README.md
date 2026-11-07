# Mesa de Ordenação

Jogo didático de ordenação e busca binária (e outros algoritmos). Abra `index.html` no navegador — funciona direto, sem servidor.

## Estrutura

```
index.html          marcação das telas (menus iniciais, mesa, painéis); as linhas de opção ficam em #estoque
css/                estilos (carregados em ordem; a ordem importa na cascata)
js/                 scripts (carregados em ordem, compartilham o escopo global)
assets/walls/       papéis de parede em WebP, ~2560 px de largura (antes embutidos em base64 no HTML); assets/walls/thumbs/ guarda as miniaturas 400x225 do seletor. Para incluir um novo, ponha a imagem aqui (de preferência com 2560x1440 ou mais, para não perder qualidade em telas grandes), gere a miniatura com o mesmo nome em thumbs/ e registre em `js/paredes.js` e `js/aparencia.js`
```

### JS (ordem de carregamento)

| arquivo | conteúdo |
|---|---|
| `temas.js` | paletas de cor (no `<head>`, para pintar certo no 1º quadro) |
| `paredes.js` | id → arquivo de cada papel de parede (carregado no `<head>`; já pede o papel escolhido ao navegador) |
| `estado.js` | constantes, estado global e utilitários |
| `som.js` | sons sintetizados (Web Audio) |
| `aparencia.js` | tema de cor e papel de parede |
| `gerenciador.js` | opções do jogo e do simulador, início da partida |
| `mesa.js` | medidas, desenho das peças, contadores |
| `pecas.js` | ordem, sobreposição, encaixe, arraste |
| `algoritmos.js` | ordenações e buscas (geradores passo a passo) |
| `execucao.js` | execução automática, histórico, torneio |
| `competicao.js` | cronômetro, ranking (com várias rodadas por competidor), CSV |
| `feira.js` | modo feira (reinício por inatividade) |
| `seletor.js` | seletor personalizado |
| `som-ui.js` | painel de som |
| `ajuda.js` | janela de ajuda |
| `interface.js` | texto de passo, toast, degradê |
| `desafio.js` | modo desafio |
| `grafico.js` | gráfico de custo |
| `atalhos.js` | atalhos de teclado |
| `menus.js` | menus da tela inicial: Início → Jogo/Simulador → Rodada única/Torneio → opções (move as linhas de `#estoque` para a etapa certa; layouts na tabela `LAYOUT`) |
| `mobile.js` | celular: menu ⋮ da barra, folha do ranking, medição das áreas fixas |
| `iniciar.js` | inicialização |

Observação: são scripts clássicos (não ES modules) de propósito — assim o jogo continua abrindo com duplo clique (`file://`), onde `import` é bloqueado pelo navegador. O comportamento é idêntico ao do arquivo único.

### Competição entre jogadores

No **Jogo → Torneio** (cronômetro e ranking de competidores):

- **Passagem automática**: escolha se a nova rodada e o próximo competidor começam sozinhos (contagem de 3 s e 4 s no botão do ranking; tocar adianta) ou só pelo botão. No Simulador, a competição de algoritmos também pode esperar o botão entre rodadas.
- **Detalhes**: tocar num nome do ranking abre o resumo e, por rodada, a lista usada e as jogadas (até 100 por rodada) em ordem.

- **Rodadas por competidor** (1 a 20, padrão 1): o competidor joga todas as rodadas seguidas e entra no ranking com a média de tempo e de movimentos (ou viradas). Cada registro guarda também o resultado de cada rodada; o ranking mostra os valores e o CSV traz uma coluna por rodada. Com peças sorteadas, cada rodada tem uma lista nova; com lista manual embaralhada, todos jogam a mesma sequência de listas.
- **Ranking por configuração**: cada registro guarda a configuração (peças, direção, ordem inicial, alvo, rodadas). O ranking mostra só a configuração em jogo; "Ver todas as configurações" mostra tudo, inclusive registros antigos (sem configuração). "Limpar ranking" apaga o que está à mostra.
- **Mesmo nome**: o jogo avisa antes de começar; ao terminar, só o melhor resultado do nome fica (um resultado parcial nunca substitui um completo).
- **Sair no meio das rodadas** (Voltar ou Reiniciar): pergunta se salva a média parcial, descarta ou continua; o cronômetro fica parado enquanto a pergunta está aberta. O modo feira volta ao início sem perguntar.

### Celular

`css/mobile.css` (carregado por último) vale para telas de até 620px, ou celular deitado, e não altera o desktop. No celular: painel inicial em tela cheia com rodapé fixo; barra da mesa com **Voltar**, contador e menu **⋮** (Reiniciar, Som, Aparência, Custo, Ajuda); controles de execução, ranking e desafio ficam em painéis na base da tela; Aparência e Som viram folhas; Ajuda e Custo ocupam a tela toda. `js/mobile.js` mede esses painéis e a mesa se ajusta ao espaço que sobra.
