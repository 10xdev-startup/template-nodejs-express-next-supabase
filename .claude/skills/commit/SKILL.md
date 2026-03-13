---
name: commit
description: "Fluxo padrao para organizar commits e push com quality gate integrado. Use quando o usuario pedir para commitar, subir, ou fazer push."
---

# Git Commit & Push Workflow

**Nunca commite automaticamente.** So commite quando o usuario pedir explicitamente (ex: "commita", "pode subir", "sobe", "commit", "push").
Quando o usuario pedir, siga este fluxo. Se pedir para pular o quality gate ("pula", "skip", "so commita"), va direto para a etapa 3.

## 1. Analisar alteracoes pendentes

- Rode `git status` e `git diff --stat` para listar todos os arquivos modificados
- Rode `git diff` por grupo de arquivos para entender cada mudanca

## 2. Quality Gate (lint + build)

### Lint (sempre)

```bash
npm run lint
```

- **Sempre roda**, independente do tamanho da mudanca
- Se falhar, corrija os erros e rode novamente. Nao prossiga ate passar.

### Build (condicional)

```bash
npm run build
```

Rode **apenas** se: 3+ arquivos alterados, **ou** mudancas em `types/`, `tsconfig`, `package.json`, arquivos de config.
Se falhar, corrija e rode novamente. Nao prossiga ate passar.

## 3. Agrupar por responsabilidade

Separe as alteracoes em commits logicos, cada um com **uma unica responsabilidade**:
- Agrupe arquivos que fazem parte da mesma feature/fix/refactor
- Nunca misture alteracoes de backend com frontend se forem de funcionalidades diferentes
- Nunca misture performance com feature nova

## 4. Apresentar commits para aprovacao

Apresente titulo + corpo de cada commit antes de executar:

---
**#N** — `tipo: titulo`
**Arquivos:** `arquivo1.ts`, `arquivo2.ts`
> Corpo descritivo em 2-3 linhas explicando o que foi feito e o motivo.

---

Aguarde o "ok" do usuario antes de executar os commits.

## 5. Executar commits na ordem

Cada commit usa HEREDOC com titulo + corpo descritivo:

```bash
git add arquivo1 arquivo2 && git commit -m "$(cat <<'EOF'
tipo: titulo curto em portugues

Descricao detalhada em 2-3 linhas explicando
o que foi feito e o motivo da alteracao.
EOF
)"
```

## 6. Verificar e fazer push

- Rode `git status` + `git log --oneline` para confirmar
- **Faca o push automaticamente** logo apos os commits
- Sempre perguntar antes de fazer `push --force`

## Regras

- Titulos de commit em **portugues**, lowercase, sem ponto final
- Corpo do commit em **portugues** com contexto util
- Titulo deve ser o **mais descritivo possivel** dentro do limite de ~72 caracteres
  - Bom: `feat: adicionar filtro por data no relatorio de vendas`
  - Ruim: `feat: adicionar filtro`
- Sempre perguntar antes de fazer `push --force`

**Tipos de commit:** `feat`, `fix`, `perf`, `style`, `refactor`, `docs`, `chore`, `test`
