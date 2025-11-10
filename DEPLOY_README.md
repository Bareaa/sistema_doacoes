# 🚀 Deploy Rápido - Sistema de Doações

Guia simplificado para fazer deploy do seu sistema de doações em minutos.

## ⚡ Deploy em 5 Minutos (Render.com)

### 1️⃣ Preparar o Código
```bash
# Build local para testar
npm run build:deploy
```

### 2️⃣ Criar Conta no Render
- Acesse: https://render.com
- Faça login com GitHub

### 3️⃣ Criar Banco de Dados
1. Dashboard → **New** → **PostgreSQL**
2. Nome: `sistema-doacoes-db`
3. Plano: **Free**
4. Clique em **Create Database**
5. Copie a **Internal Database URL**

### 4️⃣ Criar Web Service
1. Dashboard → **New** → **Web Service**
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `sistema-doacoes`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 5️⃣ Configurar Variáveis de Ambiente
Em **Environment** → **Add Environment Variable**:

```
NODE_ENV=production
DATABASE_URL=[Cole a Internal Database URL do passo 3]
JWT_SECRET=[Gere uma chave - veja abaixo]
```

**Gerar JWT_SECRET:**
```bash
npm run generate:jwt
```

### 6️⃣ Deploy!
- Clique em **Create Web Service**
- Aguarde 5-10 minutos
- Acesse a URL fornecida

### 7️⃣ Verificar
- Health: `https://sua-app.onrender.com/health`
- API Docs: `https://sua-app.onrender.com/api-docs`
- Frontend: `https://sua-app.onrender.com`

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **[DEPLOY.md](./DEPLOY.md)** - Guia completo de deploy
- **[DEPLOY_PLATFORMS.md](./DEPLOY_PLATFORMS.md)** - Instruções por plataforma
- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - Checklist completo
- **[QUICK_COMMANDS.md](./QUICK_COMMANDS.md)** - Comandos úteis

---

## 🎯 Outras Plataformas

### Railway.app (Também Muito Fácil)
1. Acesse https://railway.app
2. New Project → Deploy from GitHub
3. Add Service → PostgreSQL
4. Configure variáveis de ambiente
5. Deploy automático!

### Heroku
```bash
heroku create sistema-doacoes-app
heroku addons:create heroku-postgresql:essential-0
heroku config:set NODE_ENV=production JWT_SECRET=$(npm run generate:jwt --silent)
git push heroku main
```

---

## ✅ Checklist Rápido

- [ ] Código commitado no GitHub
- [ ] `npm run build:deploy` executado sem erros
- [ ] Banco PostgreSQL criado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] `/health` retorna 200
- [ ] Frontend carrega
- [ ] API funciona

---

## 🆘 Problemas?

### "Application Error"
- Verifique se todas as variáveis de ambiente estão configuradas
- Veja os logs da plataforma

### "Cannot connect to database"
- Use a **Internal Database URL** (não a External)
- Verifique se o banco está no mesmo datacenter

### "Build Failed"
- Execute `npm run build:deploy` localmente
- Verifique os logs de build

### Frontend não carrega
- Confirme `NODE_ENV=production`
- Verifique se `frontend/dist/` foi criado

---

## 💡 Dicas

- **Render Free Tier**: 750 horas/mês grátis
- **Railway**: $5 de crédito inicial
- **Heroku**: Requer cartão de crédito
- **Sempre use HTTPS em produção**
- **Monitore os logs após deploy**

---

## 🎉 Pronto!

Seu sistema de doações está no ar! 

Próximos passos:
1. Teste todas as funcionalidades
2. Crie um usuário admin
3. Configure monitoramento
4. Compartilhe com sua equipe

**URL da sua aplicação**: `https://sua-app.onrender.com`

---

**Precisa de ajuda?** Consulte a documentação completa ou abra uma issue no GitHub.
