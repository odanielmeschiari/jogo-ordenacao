# Mesa de Ordenação

Jogo didático de ordenação e busca binária (e outros algoritmos). Abra `index.html` no navegador — funciona direto, sem servidor.

## Estrutura

```
index.html          marcação das telas (gerenciador, sandbox, painéis)
css/                estilos (carregados em ordem; a ordem importa na cascata)
js/                 scripts (carregados em ordem, compartilham o escopo global)
assets/walls/       papéis de parede (antes embutidos em base64 no HTML); para incluir um novo, ponha a imagem aqui e registre em `js/paredes.js` e `js/aparencia.js`
```

### JS (ordem de carregamento)

| arquivo | conteúdo |
|---|---|
| `temas.js` | paletas de cor (no `<head>`, para pintar certo no 1º quadro) |
| `paredes.js` | id → arquivo de cada papel de parede |
| `estado.js` | constantes, estado global e utilitários |
| `som.js` | sons sintetizados (Web Audio) |
| `aparencia.js` | tema de cor e papel de parede |
| `gerenciador.js` | tela inicial: jogo, simulador, início |
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
| `mobile.js` | celular: menu ⋮ da barra, folha do ranking, medição das áreas fixas |
| `iniciar.js` | inicialização |

Observação: são scripts clássicos (não ES modules) de propósito — assim o jogo continua abrindo com duplo clique (`file://`), onde `import` é bloqueado pelo navegador. O comportamento é idêntico ao do arquivo único.

### Celular

`css/mobile.css` (carregado por último) vale para telas de até 620px, ou celular deitado, e não altera o desktop. No celular: painel inicial em tela cheia com rodapé fixo; barra da mesa com **Voltar**, contador e menu **⋮** (Reiniciar, Som, Aparência, Custo, Ajuda); controles de execução, ranking e desafio ficam em painéis na base da tela; Aparência e Som viram folhas; Ajuda e Custo ocupam a tela toda. `js/mobile.js` mede esses painéis e a mesa se ajusta ao espaço que sobra.
