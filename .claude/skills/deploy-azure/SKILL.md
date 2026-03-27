---
name: deploy-azure
description: "Guia de deploy na Azure com Container Registry + App Service. Use quando o usuario pedir para deployar, subir para Azure, ou configurar infraestrutura Azure."
---

# Deploy Azure

Quando o usuario invocar esta skill, pergunte o **slug do projeto** caso nao esteja claro pelo contexto (ex: `10xmkt`, `minhaloja`). Derive os nomes dos recursos a partir do slug e apresente a tabela de nomes antes de exibir qualquer comando.

## Regra de nomes

O slug **nao pode ter tracos** no Container Registry. Se o usuario passar `minha-loja`, normalize para `minhaloja` apenas no CR.

| Recurso | Nome |
|---|---|
| Resource Group | `resource-{slug}` |
| Container Registry | `cr{slug}` (sem tracos) |
| App Service Plan | `app-plan-{slug}` |
| Backend App | `web-backend-{slug}` |
| Frontend App | `web-frontend-{slug}` |

Apresente sempre a tabela preenchida com os nomes reais antes de comecar.

---

## 01 — Azure CLI

```bash
# Instalar (Windows)
winget install Microsoft.AzureCLI

# Verificar
az --version

# Login
az login --use-device-code
```

> Apos instalar, feche e reabra o terminal antes de continuar.

---

## 02 — Resource Group

```bash
az group create --name resource-{slug} --location "Brazil South"
```

Verificar registro do provider:
```bash
az provider show --namespace Microsoft.ContainerRegistry --query "registrationState"
# Esperado: "Registered"
```

---

## 03 — Container Registry

Antes de criar, pergunte ao usuario qual SKU do Container Registry ele quer:

| SKU | Preco/mes | Storage | Uso indicado |
|---|---|---|---|
| `Basic` | ~$5 | 10 GiB | Dev, projetos pequenos |
| `Standard` | ~$20 | 100 GiB | Producao na maioria dos casos |
| `Premium` | ~$50 | 500 GiB | Geo-replicacao, private endpoints |

```bash
# Criar (substitua {sku} pelo escolhido: Basic, Standard ou Premium)
az acr create \
  --resource-group resource-{slug} \
  --name cr{slug} \
  --sku {sku} \
  --admin-enabled true

# Build e push — Backend (roda na nuvem, sem Docker local)
az acr build \
  --registry cr{slug} \
  --image {slug}-backend:latest \
  --file backend/Dockerfile \
  backend/

# Build e push — Frontend (NEXT_PUBLIC_* embutidas no build)
az acr build \
  --registry cr{slug} \
  --image {slug}-frontend:latest \
  --file frontend/Dockerfile \
  --build-arg "NEXT_PUBLIC_API_URL=https://web-backend-{slug}.azurewebsites.net" \
  --build-arg "NEXT_PUBLIC_SUPABASE_URL=<SUPABASE_URL>" \
  --build-arg "NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>" \
  frontend/
```

Registrar provider Microsoft.Web:
```bash
az provider register --namespace Microsoft.Web
az provider show --namespace Microsoft.Web --query "registrationState"
# Esperado: "Registered"
```

---

## 04 — App Service Plan

Antes de criar, pergunte ao usuario qual SKU ele quer:

| SKU | Preco/mes | Limitacoes |
|---|---|---|
| `F1` | Gratuito | 60 min CPU/dia, sem custom domain, sem SSL — so para testes |
| `B1` | ~$13 | Dedicated, custom domain + SSL — minimo recomendado para producao |
| `B2` | ~$26 | 2x CPU/RAM do B1 |
| `S1` | ~$70 | Auto-scale, staging slots |

```bash
# Substitua {sku} pelo escolhido: F1, B1, B2, S1...
az appservice plan create \
  --name app-plan-{slug} \
  --resource-group resource-{slug} \
  --is-linux \
  --sku {sku}
```

---

## 05 — App Service Backend

```bash
az webapp create \
  --resource-group resource-{slug} \
  --plan app-plan-{slug} \
  --name web-backend-{slug} \
  --deployment-container-image-name cr{slug}.azurecr.io/{slug}-backend:latest
```

---

## 06 — App Service Frontend

```bash
az webapp create \
  --resource-group resource-{slug} \
  --plan app-plan-{slug} \
  --name web-frontend-{slug} \
  --deployment-container-image-name cr{slug}.azurecr.io/{slug}-frontend:latest
```

---

## 07 — Configurar porta (obrigatorio no Azure)

```bash
# Backend (porta 8000)
az webapp config appsettings set \
  --name web-backend-{slug} \
  --resource-group resource-{slug} \
  --settings WEBSITES_PORT=8000

# Frontend (porta 8080)
az webapp config appsettings set \
  --name web-frontend-{slug} \
  --resource-group resource-{slug} \
  --settings WEBSITES_PORT=8080
```

---

## 08 — Variaveis de Ambiente — Backend

```bash
az webapp config appsettings set \
  --name web-backend-{slug} \
  --resource-group resource-{slug} \
  --settings \
    PORT=8000 \
    NODE_ENV=production \
    SUPABASE_URL=<valor> \
    SUPABASE_SERVICE_ROLE_KEY=<valor> \
    SUPABASE_ANON_KEY=<valor>
```

---

## 09 — Variaveis de Ambiente — Frontend

> As `NEXT_PUBLIC_*` ja foram embutidas no build (passo 03). As abaixo sao extras se necessario.

```bash
az webapp config appsettings set \
  --name web-frontend-{slug} \
  --resource-group resource-{slug} \
  --settings \
    NEXT_PUBLIC_API_URL=https://web-backend-{slug}.azurewebsites.net \
    NEXT_PUBLIC_SUPABASE_URL=<valor> \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<valor>
```

---

## 10 — Verificar Deploy

```bash
curl https://web-backend-{slug}.azurewebsites.net/health
```

- **Frontend:** `https://web-frontend-{slug}.azurewebsites.net`
- **Backend:** `https://web-backend-{slug}.azurewebsites.net/health`

