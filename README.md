# Mesa de Ordenação

Jogo didático de ordenação e busca binária (e outros algoritmos). Abra `index.html` no navegador — funciona direto, sem servidor.

## Estrutura

```
index.html          marcação das telas (gerenciador, sandbox, painéis)
css/                estilos (carregados em ordem; a ordem importa na cascata)
js/                 scripts (carregados em ordem, compartilham o escopo global)
assets/walls/       papéis de parede (antes embutidos em base64 no HTML)
```

### JS (ordem de carregamento)

| arquivo | conteúdo |
|---|---|
| `temas.js` | paletas de cor (no `<head>`, para pintar certo no 1º quadro) |
| `paredes.js` | id → arquivo de cada papel de parede |
| `estado.js` | constantes, estado global e utilitários |
| `som.js` | sons sintetizados (Web Audio) |
| `aparencia.js` | tema de cor e papel de parede |
| `gerenciador.js` | tela inicial: peças, gerador, início do jogo |
| `mesa.js` | medidas, desenho das peças, contadores |
| `pecas.js` | ordem, sobreposição, encaixe, arraste |
| `algoritmos.js` | ordenações e buscas (geradores passo a passo) |
| `execucao.js` | execução automática, histórico, torneio |
| `competicao.js` | cronômetro, ranking, CSV |
| `feira.js` | modo feira (reinício por inatividade) |
| `seletor.js` | seletor personalizado |
| `som-ui.js` | painel de som |
| `ajuda.js` | janela de ajuda |
| `interface.js` | texto de passo, toast, degradê |
| `desafio.js` | modo desafio |
| `grafico.js` | gráfico de custo |
| `atalhos.js` | atalhos de teclado |
| `iniciar.js` | inicialização |

Observação: são scripts clássicos (não ES modules) de propósito — assim o jogo continua abrindo com duplo clique (`file://`), onde `import` é bloqueado pelo navegador. O comportamento é idêntico ao do arquivo único.
