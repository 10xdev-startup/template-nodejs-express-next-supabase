# Deploy Azure — Guia Passo a Passo

> Guia completo para subir o projeto na Azure usando Container Registry + App Service.
> Substitua `meu-projeto` e `crg-meu-projeto` pelos nomes do seu projeto.

---

## 01 — Azure CLI

### 1.1 Instalar
```bash
winget install Microsoft.AzureCLI
```
> Feche o terminal e o Cursor/VS Code completamente após instalar.

### 1.2 Verificar instalação
```bash
az --version
```

### 1.3 Fazer login
```bash
az login --use-device-code
```
> O terminal vai exibir um link da Microsoft e um código. Acesse o link, insira o código e autentique.

---

## 02 — Resource Group

```bash
az group create --name resource-meu-projeto --location "Brazil South"
```

> Leva alguns minutos para registrar. Verifique com:
```bash
az provider show --namespace Microsoft.ContainerRegistry --query "registrationState"
```
> Tem que retornar: `"Registered"`

---

## 03 — Container Registry

### 3.1 Criar o registry
```bash
az acr create --resource-group resource-meu-projeto --name crgmeuprojeto --sku Basic --admin-enabled true
```
> **Atenção:** o nome do registry **não pode ter traços** (`-`). Use só letras e números.

### 3.2 Login no registry
```bash
az acr login --name crgmeuprojeto
```

### 3.3 Build e push do backend
```bash
docker build -t crgmeuprojeto.azurecr.io/meu-projeto-backend:latest ./backend
docker push crgmeuprojeto.azurecr.io/meu-projeto-backend:latest
```

### 3.4 Build e push do frontend
```bash
docker build -t crgmeuprojeto.azurecr.io/meu-projeto-frontend:latest ./frontend
docker push crgmeuprojeto.azurecr.io/meu-projeto-frontend:latest
```

### 3.5 Registrar provedor Microsoft.Web
```bash
az provider register --namespace Microsoft.Web
```
> Verificar status:
```bash
az provider show --namespace Microsoft.Web --query "registrationState"
```
> Tem que retornar: `"Registered"`

---

## 04 — App Service Plan

```bash
az appservice plan create \
  --name app-plan-meu-projeto \
  --resource-group resource-meu-projeto \
  --is-linux \
  --sku B1
```

---

## 05 — App Service Backend

```bash
az webapp create \
  --resource-group resource-meu-projeto \
  --plan app-plan-meu-projeto \
  --name web-backend-meu-projeto \
  --deployment-container-image-name crgmeuprojeto.azurecr.io/meu-projeto-backend:latest
```

---

## 06 — App Service Frontend

```bash
az webapp create \
  --resource-group resource-meu-projeto \
  --plan app-plan-meu-projeto \
  --name web-frontend-meu-projeto \
  --deployment-container-image-name crgmeuprojeto.azurecr.io/meu-projeto-frontend:latest
```

---

## 07 — Variáveis de Ambiente — Backend

```bash
az webapp config appsettings set \
  --name web-backend-meu-projeto \
  --resource-group resource-meu-projeto \
  --settings \
    PORT=8000 \
    NODE_ENV=production \
    SUPABASE_URL=https://seu-projeto.supabase.co \
    SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key \
    SUPABASE_ANON_KEY=sua-anon-key
```

---

## 08 — Variáveis de Ambiente — Frontend

```bash
az webapp config appsettings set \
  --name web-frontend-meu-projeto \
  --resource-group resource-meu-projeto \
  --settings \
    NEXT_PUBLIC_API_URL=https://web-backend-meu-projeto.azurewebsites.net \
    NEXT_PUBLIC_APP_NAME="Meu Projeto" \
    NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

---

## 09 — Verificar Deploy

Após o deploy, acesse:
- **Frontend:** `https://web-frontend-meu-projeto.azurewebsites.net`
- **Backend:** `https://web-backend-meu-projeto.azurewebsites.net/health`

---

## Redeploy (atualizar versão)

Para subir uma nova versão, repita os passos de build e push:

```bash
# Backend
docker build -t crgmeuprojeto.azurecr.io/meu-projeto-backend:latest ./backend
docker push crgmeuprojeto.azurecr.io/meu-projeto-backend:latest
az webapp restart --name web-backend-meu-projeto --resource-group resource-meu-projeto

# Frontend
docker build -t crgmeuprojeto.azurecr.io/meu-projeto-frontend:latest ./frontend
docker push crgmeuprojeto.azurecr.io/meu-projeto-frontend:latest
az webapp restart --name web-frontend-meu-projeto --resource-group resource-meu-projeto
```
