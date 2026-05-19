# Aula 5 — Princípios SOLID

Material de apoio da **Aula 5**. Este é um codebase pequeno de Node.js +
Express + TypeScript, feito para praticar SOLID como lente de design, não como
checklist obrigatório.

A dinâmica segue a Aula 4:

1. Em sala, abrimos um arquivo da raiz e identificamos o smell que dispara a discussão.
2. Refatoramos em passos pequenos, preservando a saída do console.
3. Comparamos com uma resposta possível na pasta [temp/](temp/).

## Estrutura

```text
aula-5/
├── bloco-1-srp-responsabilidade-unica.ts
├── bloco-2-ocp-lsp-extensao-substituicao.ts
├── bloco-3-isp-dip-dependencias-invertidas.ts
├── trabalho-de-casa.ts
└── temp/
    ├── bloco-1-srp-responsabilidade-unica.ts
    ├── bloco-2-ocp-lsp-extensao-substituicao.ts
    ├── bloco-3-isp-dip-dependencias-invertidas.ts
    └── trabalho-de-casa.ts
```

## Pré-requisitos

- Node.js 20+
- npm

## Instalação

```bash
cd aula-5
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
console. A versão da raiz e a versão em [temp/](temp/) devem imprimir a mesma
saída.

Exemplo:

```bash
npm run bloco1
npx tsx temp/bloco-1-srp-responsabilidade-unica.ts
```

## Blocos

### Bloco 1 — SRP: responsabilidade única

Arquivo: [bloco-1-srp-responsabilidade-unica.ts](bloco-1-srp-responsabilidade-unica.ts) ·
Gabarito: [temp/bloco-1-srp-responsabilidade-unica.ts](temp/bloco-1-srp-responsabilidade-unica.ts)

Smells plantados:

- **God Class**: `UserService` valida, persiste, calcula trial e envia e-mail.
- **Divergent Change**: validação, banco e comunicação mudam pelo mesmo arquivo.
- **Responsabilidades misturadas**: é preciso dizer que a classe valida e salva e envia.

Prática sugerida:

1. Extraia `UserValidator`.
2. Extraia `UserRepository`.
3. Extraia `EmailService`.
4. Mantenha `UserService` apenas orquestrando a criação.

### Bloco 2 — OCP e LSP: extensão e substituição

Arquivo: [bloco-2-ocp-lsp-extensao-substituicao.ts](bloco-2-ocp-lsp-extensao-substituicao.ts) ·
Gabarito: [temp/bloco-2-ocp-lsp-extensao-substituicao.ts](temp/bloco-2-ocp-lsp-extensao-substituicao.ts)

Smells plantados:

- **Switch por tipo**: `if/else if` cresce a cada novo tipo de cliente.
- **OCP violado**: adicionar desconto exige editar a função existente.
- **Risco de LSP**: políticas futuras precisam honrar o mesmo contrato sem surpresa.

Prática sugerida:

1. Crie a interface `DiscountPolicy`.
2. Implemente `VipDiscountPolicy` e `PartnerDiscountPolicy`.
3. Faça `OrderPriceCalculator` depender apenas de `DiscountPolicy`.
4. Valide que todas as políticas recebem um pedido e devolvem um desconto válido.

### Bloco 3 — ISP e DIP: interfaces pequenas e dependências invertidas

Arquivo: [bloco-3-isp-dip-dependencias-invertidas.ts](bloco-3-isp-dip-dependencias-invertidas.ts) ·
Gabarito: [temp/bloco-3-isp-dip-dependencias-invertidas.ts](temp/bloco-3-isp-dip-dependencias-invertidas.ts)

Smells plantados:

- **Acoplamento direto a ORM/SDK**: `OrderService` conhece o cliente concreto.
- **DIP violado**: regra de negócio depende de detalhe de infraestrutura.
- **Teste difícil**: sem abstração, a regra fica presa ao banco ou a um cliente grande.

Prática sugerida:

1. Crie a interface pequena `OrderRepository`.
2. Faça `OrderService` depender da interface.
3. Mova o detalhe concreto para `PrismaOrderRepository`.
4. Use `FakeOrderRepository` para validar a regra sem banco real.

## Trabalho de casa

Arquivo: [trabalho-de-casa.ts](trabalho-de-casa.ts) ·
Gabarito sugerido: [temp/trabalho-de-casa.ts](temp/trabalho-de-casa.ts)

Entrega: PR semântico até a véspera da Aula 6.

O aluno deve:

1. Escolher um princípio SOLID violado.
2. Explicar qual smell serviu de gatilho.
3. Aplicar uma refatoração pequena e segura.
4. Validar que o comportamento continua igual.

Sugestão de título do PR:

```text
refactor(aula-5): aplica solid em assinaturas
```

## Dica final

SOLID não é obrigação estética. Use quando houver uma dor concreta de manutenção:
classe com motivos demais para mudar, `if/else` crescendo, interface grande ou regra
presa a detalhes de infraestrutura.
