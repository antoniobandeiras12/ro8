# Configuração do Banco de Dados Railway

## URL de Conexão Fornecida pelo Railway

```
mysql://root:sua_senha@ballast.proxy.rlwy.net:29419/railway
```

## Como Configurar no Railway

### 1. Adicionar Variável de Ambiente

No painel do Railway, vá para **Variables** e adicione:

```
DATABASE_URL=mysql://root:sua_senha@ballast.proxy.rlwy.net:29419/railway
```

**Substitua `sua_senha` pela senha real fornecida pelo Railway.**

### 2. Outras Variáveis Obrigatórias

Adicione também:

```
JWT_SECRET=gere_uma_chave_segura_aqui
VITE_APP_ID=seu_app_id_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_open_id_manus
OWNER_NAME=Seu Nome Completo
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api_manus
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend_manus
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_ANALYTICS_ENDPOINT=seu_endpoint_analytics
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
VITE_APP_TITLE=Sistema RSO
VITE_APP_LOGO=/brasao.png
NODE_ENV=production
```

### 3. Executar Migrations

Após o deploy bem-sucedido:

```bash
# Via Railway CLI
railway connect MySQL
pnpm db:push
```

Ou via painel do Railway (terminal):

```bash
pnpm db:push
```

## ✅ Checklist

- [ ] DATABASE_URL configurada com a URL do Railway
- [ ] JWT_SECRET definido
- [ ] Variáveis de OAuth configuradas
- [ ] Variáveis de API Manus configuradas
- [ ] NODE_ENV=production
- [ ] Deploy iniciado
- [ ] Migrations executadas com sucesso

## 🔗 Teste de Conexão

Para testar a conexão com o banco:

```bash
mysql -h ballast.proxy.rlwy.net -u root -p sua_senha --port 29419 --protocol=TCP railway
```

Se conectar com sucesso, o banco está pronto!

## ⚠️ Importante

- A senha está visível na URL. Certifique-se de que é segura.
- Não compartilhe a URL de conexão publicamente.
- Sempre use HTTPS em produção.
- Mantenha as variáveis de ambiente seguras no Railway.
