# Aula 4 — Code Smells, Anti-patterns e Refatoração

Material de apoio da **Aula 4**. Este é um codebase pequeno de Node.js +
Express + TypeScript, feito para praticar refatoração sem mudar comportamento.

A dinâmica é a mesma da aula anterior:

1. Em sala, abrimos um arquivo da raiz e encontramos os smells juntos.
2. Refatoramos em passos pequenos, rodando o arquivo depois de cada mudança.
3. Comparamos com uma resposta possível na pasta [temp/](temp/).

## Estrutura

```
aula-4/
├── bloco-1-smells-em-funcoes.ts
├── bloco-2-smells-em-classes-e-modulos.ts
├── bloco-3-antipatterns-refatoracao-segura.ts
├── trabalho-de-casa.ts
└── temp/
    ├── bloco-1-smells-em-funcoes.ts
    ├── bloco-2-smells-em-classes-e-modulos.ts
    ├── bloco-3-antipatterns-refatoracao-segura.ts
    └── trabalho-de-casa.ts
```

## Pré-requisitos

- Node.js 20+
- npm

## Instalação

```bash
cd aula-4
npm install
```

## Como rodar

```bash
npm run bloco1
npm run bloco2
npm run bloco3
npm run casa
npm run typecheck
```

Os arquivos usam Express para parecerem uma API real, mas as práticas rodam no
console. A ideia é facilitar a validação: a versão da raiz e a versão em
[temp/](temp/) devem imprimir a mesma saída.

Exemplo:

```bash
npm run bloco1
npx tsx temp/bloco-1-smells-em-funcoes.ts
```

## Blocos

### Bloco 1 — Smells mais comuns em funções

Arquivo: [bloco-1-smells-em-funcoes.ts](bloco-1-smells-em-funcoes.ts) ·
Gabarito: [temp/bloco-1-smells-em-funcoes.ts](temp/bloco-1-smells-em-funcoes.ts)

Cheiros plantados:

- **Long Function**: cálculo, cupom, frete, imposto e arredondamento no mesmo lugar.
- **Long Parameter List**: muitos parâmetros soltos em `calculateOrderTotal`.
- **Magic Numbers / Magic Strings**: percentuais e cupons espalhados.
- Comentários redundantes explicando o que o código já diz.

Prática sugerida:

1. Extraia variáveis com nomes claros.
2. Substitua números e strings mágicas por constantes.
3. Agrupe parâmetros relacionados em um objeto.
4. Extraia 2 ou 3 funções pequenas.

### Bloco 2 — Smells em classes e módulos

Arquivo: [bloco-2-smells-em-classes-e-modulos.ts](bloco-2-smells-em-classes-e-modulos.ts) ·
Gabarito: [temp/bloco-2-smells-em-classes-e-modulos.ts](temp/bloco-2-smells-em-classes-e-modulos.ts)

Cheiros plantados:

- **God Class / Large Class**: `UserService` valida, salva, calcula regra e envia e-mail.
- **Feature Envy**: método do serviço mexe demais nos dados do repositório.
- **Primitive Obsession**: `email` é apenas `string`, mesmo sendo um conceito importante.
- **Divergent Change**: o mesmo arquivo muda por motivos muito diferentes.

Prática sugerida:

1. Separe validação, persistência e envio de e-mail.
2. Mova para o repositório o comportamento que usa dados do repositório.
3. Crie um conceito simples para `Email`.
4. Mantenha a saída no console igual.

### Bloco 3 — Anti-patterns e refatoração segura

Arquivo: [bloco-3-antipatterns-refatoracao-segura.ts](bloco-3-antipatterns-refatoracao-segura.ts) ·
Gabarito: [temp/bloco-3-antipatterns-refatoracao-segura.ts](temp/bloco-3-antipatterns-refatoracao-segura.ts)

Cheiros plantados:

- **Spaghetti Code**: muitos `if/else` aninhados.
- **Copy-Paste Programming**: a mesma regra de status aparece em dois lugares.
- **Lava Flow / Dead Code**: função antiga que ninguém usa.

Prática sugerida:

1. Rode o arquivo e anote a saída esperada.
2. Extraia a regra repetida para `getOrderStatus`.
3. Substitua os blocos duplicados pela função extraída.
4. Remova código morto apenas quando tiver certeza.

## Trabalho de casa

Arquivo: [trabalho-de-casa.ts](trabalho-de-casa.ts) ·
Gabarito sugerido: [temp/trabalho-de-casa.ts](temp/trabalho-de-casa.ts)

Entrega: PR semântico até a véspera da Aula 5.

O aluno deve:

1. Mapear de 3 a 5 smells em uma tabela simples:

```md
| smell | evidência | impacto | refatoração sugerida |
| --- | --- | --- | --- |
```

2. Aplicar uma refatoração pequena e segura.
3. Validar que o comportamento continua igual.
4. Explicar no PR o que mudou, por que mudou e como validou.

Sugestão de título do PR:

```text
refactor(aula-4): melhora cálculo de ingressos
```

## Dica final

Refatoração boa para iniciante é pequena, óbvia e validável. Se a saída mudou
sem querer, volte um passo e reduza o tamanho da mudança.
