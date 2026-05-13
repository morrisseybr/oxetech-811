# Aula 3 — Clean Code: fundamentos e custo de manutenção

Material de apoio da **Aula 3**. Aqui ficam os exemplos demonstrados em sala
(versão "antes", com cheiros propositais) e os respectivos **gabaritos**
(versão "depois", refatorada) na pasta [temp/](temp/).

A ideia é simples:

1. Em sala, abrimos um arquivo da raiz e **refatoramos juntos**, ao vivo.
2. Em casa, o aluno compara seu resultado com o arquivo correspondente em
   [temp/](temp/).
3. O aluno entrega o **trabalho de casa** como PR semântico no repositório.

## Estrutura

```
aula-3/
├── bloco-1-nomes-e-funcoes.ts            ← demo "antes" do bloco 1
├── bloco-2-comentarios-e-formatacao.ts   ← demo "antes" do bloco 2
├── bloco-3-objetos-classes-fronteiras.ts ← demo "antes" do bloco 3
├── trabalho-de-casa.ts                   ← exercício do aluno
└── temp/                                 ← gabaritos (refatorados)
    ├── bloco-1-nomes-e-funcoes.ts
    ├── bloco-2-comentarios-e-formatacao.ts
    ├── bloco-3-objetos-classes-fronteiras.ts
    └── trabalho-de-casa.ts
```

## Pré-requisitos

- Node.js 20+
- npm

## Instalação

```bash
cd aula-3
npm install
```

## Como rodar

Cada bloco e o trabalho de casa têm um script npm:

```bash
npm run bloco1   # roda bloco-1-nomes-e-funcoes.ts
npm run bloco2   # roda bloco-2-comentarios-e-formatacao.ts
npm run bloco3   # roda bloco-3-objetos-classes-fronteiras.ts
npm run casa     # roda trabalho-de-casa.ts
npm run typecheck
```

> Os gabaritos em [temp/](temp/) também rodam com `tsx`, por exemplo:
> `npx tsx temp/bloco-1-nomes-e-funcoes.ts`. A saída no console é
> **idêntica** à da versão "antes" — é assim que o aluno valida que a
> refatoração preservou o comportamento.

## Os três blocos

### Bloco 1 — Nomes e funções que se explicam sozinhos

Arquivo: [bloco-1-nomes-e-funcoes.ts](bloco-1-nomes-e-funcoes.ts) ·
Gabarito: [temp/bloco-1-nomes-e-funcoes.ts](temp/bloco-1-nomes-e-funcoes.ts)

Cheiros plantados:

- Identificadores opacos (`P`, `calc`, `t`, `v`, `q`).
- Números mágicos (`1`, `2`, `0.05`, `0.1`).
- Função fazendo várias coisas em níveis de abstração misturados.
- **Flag argument** (`log: boolean`) misturando cálculo com efeito colateral.

O que praticamos:

- Renomear para revelar intenção (`Item`, `TipoCliente`, `calcularTotal`).
- Constantes nomeadas no lugar de números mágicos.
- **Stepdown rule**: ler de cima para baixo, do mais abstrato ao mais concreto.
- **Command/Query Separation**: separar `calcularTotal` de `imprimirRecibo`.

### Bloco 2 — Comentários sob suspeita e formatação automatizada

Arquivo: [bloco-2-comentarios-e-formatacao.ts](bloco-2-comentarios-e-formatacao.ts) ·
Gabarito: [temp/bloco-2-comentarios-e-formatacao.ts](temp/bloco-2-comentarios-e-formatacao.ts)

Cheiros plantados:

- Indentação caótica (formatador resolve isso para você).
- Comentários que apenas repetem o código (`// atribui id`).
- Cabeçalho com autoria e data ("Autor: João — 2023") — diário de mudanças
  no código fonte.
- Nomes encurtados (`nm`, `idd`) "comentados" em vez de bem nomeados.

O que praticamos:

- Rodar **Prettier** ou **Biome** com `--write` antes de pensar em qualquer
  coisa.
- Trocar comentários redundantes por **nomes melhores**.
- Manter apenas comentários legítimos: aviso, *por quê*, TODO justificado.

### Bloco 3 — Objetos, classes e fronteiras com o mundo externo

Arquivo: [bloco-3-objetos-classes-fronteiras.ts](bloco-3-objetos-classes-fronteiras.ts) ·
Gabarito: [temp/bloco-3-objetos-classes-fronteiras.ts](temp/bloco-3-objetos-classes-fronteiras.ts)

Cheiros plantados:

- **Lei de Deméter** quebrada: `cliente.endereco.cidade.estado.sigla`.
- `Pedido` mistura DTO (campos públicos) com objeto (`estaPago()`).
- Dependência direta de um `PagamentoVendorSDK` — o domínio sabe demais
  sobre o terceiro.

O que praticamos:

- Esconder a estrutura interna: `cliente.cidadeDeEntrega()`.
- Decidir: ou é objeto (comportamento + dados ocultos) **ou** é DTO
  (dados expostos, sem comportamento).
- **Adapter** sobre o SDK do vendor + erro próprio do domínio
  (`FalhaDePagamento`).

## Trabalho de casa

Arquivo: [trabalho-de-casa.ts](trabalho-de-casa.ts) ·
Gabarito sugerido: [temp/trabalho-de-casa.ts](temp/trabalho-de-casa.ts)

> Não se assuste: é **uma função pequena**. O objetivo é praticar o que
> vimos na aula, não reescrever o mundo.

Sugestão de passos:

1. Instale ESLint + Prettier (ou Biome) e deixe o formatador rodar.
2. Renomeie `Emp`, `calc`, `e`, `t`, `cat`, `v`, `m` para algo que se
   explique sozinho.
3. Substitua os números mágicos por **constantes nomeadas**.
4. Apague comentários que apenas repetem o código.
5. (Opcional) Extraia uma função pequena, se sentir vontade.

Critérios de aceite:

- `npm run casa` imprime a **mesma saída** antes e depois.
- O diff está legível.
- A descrição do PR conta **por quê** você mexeu em cada coisa.

### Como entregar

PR semântico no repositório do curso, no formato:

```
refactor(aula-3): aplica clean code no trabalho-de-casa
```

Siga o fluxo de PR aprendido na **Aula 2**.

## Dica final

> Se a próxima pessoa precisar abrir 3 arquivos para entender o que uma
> classe faz, ela é grande demais.
