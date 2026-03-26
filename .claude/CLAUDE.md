# CLAUDE.md

## Projeto

**Meu Projeto** — descreva aqui o que o projeto faz.

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui (Radix) — `frontend/`
- **Backend**: Node.js, Express, TypeScript, Supabase (PostgreSQL) — `backend/`
- **Padrao backend**: Controller → Model → Database

## Comandos

### Frontend (`frontend/`)
```bash
npm run dev       # Dev server (porta 3000)
npm run build     # Build de producao
npm run lint      # ESLint
```

### Backend (`backend/`)
```bash
npm run dev       # Dev server com ts-node-dev (porta 3001)
npm run build     # Compila TypeScript para dist/
npm run lint      # ESLint
```

## Regras de codigo

### TypeScript — escreva codigo que compila sem erros

**Backend e mais estrito que o frontend.** No backend, respeite:
- `noImplicitAny` — nunca deixe tipos implicitos como `any`
- `noImplicitReturns` — toda funcao deve ter return explicito em todos os caminhos
- `noUncheckedIndexedAccess` — acesso por index retorna `T | undefined`, trate antes de usar
- `exactOptionalPropertyTypes` — propriedades opcionais nao aceitam `undefined` explicito, use omissao
- `noFallthroughCasesInSwitch` — todo `case` precisa de `break` ou `return`

**Frontend** usa `strict: true` mas sem as regras extras acima.

### ESLint — regras permissivas, mas nao ignore

- Nao crie variaveis sem uso desnecessariamente
- Prefira `const` sobre `let` quando o valor nao muda
- Use `any` somente quando realmente necessario — prefira tipos concretos

### Path aliases

- **Frontend**: `@/*` → `./*`
- **Backend**: `@/*` → `./src/*` (tambem `@/models/*`, `@/controllers/*`, `@/routes/*`, `@/middleware/*`, `@/database/*`, `@/utils/*`, `@/types/*`)

### Naming

- **Componentes/tipos**: PascalCase (`UserCard.tsx`, `UserCard`)
- **Utilitarios/hooks**: camelCase (`useAuth.ts`, `formatDate.ts`)
- **Banco**: snake_case (`user_cards`)
- **API**: kebab-case (`/user-cards`)
- **Propriedades de tipo**: camelCase

## Idioma

- Converse sempre em **portugues**
- Commits, PRs e comentarios em **portugues** (ver skills `/commit` e `/pr`)
- Codigo-fonte em **ingles** (variaveis, funcoes, tipos)

## Autenticacao

- **Provider**: Supabase Auth (Google OAuth)
- **Tokens**: JWT Bearer tokens em headers `Authorization: Bearer <token>`
- **Backend**: middleware valida tokens JWT e injeta `req.user`

## Banco de dados (Supabase PostgreSQL)

Documente aqui as tabelas principais do seu projeto conforme for criando.

## Arquivos-chave

- `frontend/app/(dashboard)/page.tsx` — pagina principal
- `frontend/components/AppSidebar.tsx` — sidebar com navegacao
- `backend/src/index.ts` — entry point do servidor
- `backend/src/database/supabase.ts` — configuracao do banco
