# Aula 6 — Base de Back-end, Docker e Segurança Aplicada

Material de apoio da **Aula 6**. Este é o `codebase-base` que será evoluído nas próximas aulas do Módulo 3, usando Node.js, Express, TypeScript, Docker Compose, Postgres, autenticação simples, validação com Zod e testes automatizados.

Nas aulas 3, 4 e 5 praticamos legibilidade, refatoração e SOLID em exemplos menores. Aqui a ideia é ver essas decisões aparecendo em uma API mais próxima de um projeto real, com camadas, ambiente padronizado e cuidados básicos de segurança.

## Estrutura

```text
aula-6/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── domain/
│   ├── errors/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   └── services/
├── scripts/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

## Pré-requisitos

- Node.js 20+
- npm
- Docker e Docker Compose

## Instalação local

```bash
cd aula-6
npm install
cp .env.example .env
```

No Windows PowerShell, se preferir:

```powershell
Copy-Item .env.example .env
```

## Como rodar com Docker Compose

```bash
docker compose up --build
```

Em outro terminal:

```bash
npm run migrate
npm run seed
```

Endpoints úteis:

```bash
curl http://localhost:3000/api/health

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@aula6.local","password":"senha-aula-6"}'
```

Para derrubar o ambiente:

```bash
docker compose down
```

Para apagar também os dados do banco local:

```bash
docker compose down -v
```

## Como rodar sem container da API

Também é possível deixar só o Postgres no Docker e rodar a API pelo Node local:

```bash
docker compose up postgres
npm run migrate
npm run seed
npm run dev
```

## Scripts

```bash
npm run dev        # inicia a API em modo watch
npm run migrate    # cria a tabela users
npm run seed       # cria usuario de exemplo
npm run test       # roda testes automatizados
npm run typecheck  # valida tipos TypeScript
npm run lint       # roda Biome
npm run build      # compila para dist/
```

## Mapa para a prática curta

Fluxo de cadastro:

```text
POST /api/auth/register
  -> routes/auth-routes.ts
  -> controllers/auth-controller.ts
  -> services/auth-service.ts
  -> repositories/postgres-user-repository.ts
  -> tabela users no Postgres
```

Fluxo de rota protegida:

```text
GET /api/me
  -> middlewares/authenticate.ts
  -> routes/user-routes.ts
  -> controllers/user-controller.ts
  -> services/user-service.ts
  -> repositories/postgres-user-repository.ts
  -> tabela users no Postgres
```

Responsabilidades principais:

- **Route:** declara URL, método HTTP e middlewares usados.
- **Controller:** traduz request/response e escolhe o status code.
- **Service:** concentra regra de negócio e decisões do caso de uso.
- **Repository:** isola acesso a dados.
- **Middleware:** aplica autenticação, validação, logs e tratamento transversal.
- **Schema/DTO:** valida entrada antes da regra de negócio.

## Bloco 1 — Anatomia de uma API Node.js/TypeScript

Abra o fluxo de cadastro e responda:

1. Qual arquivo conhece o Express diretamente?
2. Qual arquivo decide que senha deve virar hash?
3. Qual arquivo sabe que o banco usa uma tabela chamada `users`?
4. Que responsabilidade poderia virar débito técnico se o projeto crescesse?

Discussão esperada: a separação ajuda SRP, mas `AuthService` pode crescer demais se login, cadastro, recuperação de senha, refresh token e autorização forem todos colocados no mesmo lugar.

## Bloco 2 — Ambiente local confiável com Docker Compose

Leia [Dockerfile](Dockerfile) e [docker-compose.yml](docker-compose.yml). Depois execute:

```bash
docker compose up --build
curl http://localhost:3000/api/health
```

Conceitos para localizar nos arquivos:

- **Imagem:** `node:22-alpine` e `postgres:17-alpine`.
- **Container:** serviços `api` e `postgres`.
- **Volume:** `postgres_data` e `node_modules`.
- **Network:** comunicação da API com o banco pelo nome `postgres`.
- **Env vars:** `.env` e `DATABASE_URL`.

## Bloco 3 — Segurança essencial

Pontos implementados nesta base:

- Senha é armazenada como hash com `bcryptjs`.
- Segredo do JWT vem de variável de ambiente.
- `helmet` adiciona headers HTTP de proteção básica.
- `validateRequest` usa Zod antes de chamar o controller.
- `authenticate` protege rotas com token Bearer.
- `logger` mascara chaves sensíveis antes de escrever logs.
- Respostas públicas de usuário não incluem `passwordHash`.

Cenários para testar:

```bash
npm run test
```

Os testes cobrem requisição válida, requisição inválida e rota protegida sem autenticação.

## Próxima aula

Na Aula 7, este codebase será usado para aplicar padrões criacionais e estruturais, como Factory, Builder, Adapter, Facade, Decorator e Repository, sempre avaliando se o padrão simplifica o código ou se cria abstração prematura.
