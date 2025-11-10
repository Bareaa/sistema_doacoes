# Guia de Deploy por Plataforma

## 🎯 Render.com (Recomendado - Mais Fácil)

### Passo a Passo:

1. **Criar conta no Render**
   - Acesse https://render.com
   - Faça login com GitHub

2. **Criar PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Nome: `sistema-doacoes-db`
   - Plano: Free
   - Copie a "Internal Database URL"

3. **Criar Web Service**
   - Dashboard → New → Web Service
   - Conecte seu repositório GitHub
   - Configure:
     ```
     Name: sistema-doacoes
     Environment: Node
     Build Command: npm install
     Start Command: npm start
     ```

4. **Configurar Variáveis de Ambiente**
   - Environment → Add Environment Variable
   ```
   NODE_ENV=production
   DATABASE_URL=[Cole a Internal Database URL do passo 2]
   JWT_SECRET=[Gere uma chave aleatória]
   ```

5. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde o build e deploy (5-10 minutos)
   - Acesse a URL fornecida

### Gerar JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🟣 Heroku

### Passo a Passo:

1. **Instalar Heroku CLI**
   ```bash
   # Windows (com Chocolatey)
   choco install heroku-cli
   
   # Ou baixe em: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login e Criar App**
   ```bash
   heroku login
   heroku create sistema-doacoes-app
   ```

3. **Adicionar PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

4. **Configurar Variáveis**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Verificar**
   ```bash
   heroku open
   heroku logs --tail
   ```

---

## 🟠 AWS Elastic Beanstalk

⚠️ **IMPORTANTE**: AWS EB requer configuração especial. Veja **[AWS_EB_DEPLOY.md](./AWS_EB_DEPLOY.md)** para guia completo.

### Passo a Passo:

1. **Instalar EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Commit Alterações** (correções para AWS EB já aplicadas)
   ```bash
   git add .
   git commit -m "fix: configuração AWS EB"
   ```

3. **Inicializar Projeto**
   ```bash
   eb init -p node.js sistema-doacoes
   ```

4. **Criar Ambiente**
   ```bash
   eb create production-env
   ```

5. **Configurar RDS PostgreSQL** (ou use banco externo)
   - Console AWS → RDS → Create Database
   - PostgreSQL, Free Tier
   - Anote o endpoint e credenciais
   - **OU** use Render.com/Supabase (mais fácil)

6. **Configurar Variáveis**
   ```bash
   eb setenv NODE_ENV=production
   eb setenv DATABASE_URL=postgresql://user:pass@endpoint:5432/dbname
   eb setenv JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   ```

7. **Deploy**
   ```bash
   eb deploy
   ```

8. **Verificar**
   ```bash
   eb logs
   eb open
   ```

**Problemas?** Consulte **[AWS_EB_DEPLOY.md](./AWS_EB_DEPLOY.md)** para troubleshooting detalhado.

---

## 🔵 Railway.app

### Passo a Passo:

1. **Criar conta no Railway**
   - Acesse https://railway.app
   - Login com GitHub

2. **Novo Projeto**
   - New Project → Deploy from GitHub repo
   - Selecione seu repositório

3. **Adicionar PostgreSQL**
   - Add Service → Database → PostgreSQL

4. **Configurar Variáveis**
   - Settings → Variables
   ```
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=[Gere uma chave]
   ```

5. **Deploy Automático**
   - Railway faz deploy automaticamente
   - Acesse a URL gerada

---

## 🟢 Vercel (Alternativa - Requer Adaptação)

**Nota**: Vercel é otimizado para frontend. Para full-stack, use Render ou Railway.

Se quiser usar Vercel apenas para o frontend:

1. **Deploy Frontend Separado**
   ```bash
   cd frontend
   vercel
   ```

2. **Backend em Outra Plataforma**
   - Use Render/Railway para o backend
   - Configure VITE_API_URL no Vercel apontando para o backend

---

## 📊 Comparação de Plataformas

| Plataforma | Facilidade | Plano Grátis | PostgreSQL | Auto Deploy |
|------------|-----------|--------------|------------|-------------|
| **Render** | ⭐⭐⭐⭐⭐ | ✅ 750h/mês | ✅ Incluído | ✅ |
| **Railway** | ⭐⭐⭐⭐⭐ | ✅ $5 crédito | ✅ Incluído | ✅ |
| **Heroku** | ⭐⭐⭐⭐ | ❌ Pago | ✅ Add-on | ✅ |
| **AWS EB** | ⭐⭐⭐ | ✅ 12 meses | ⚠️ Separado | ⚠️ Manual |
| **Vercel** | ⭐⭐⭐⭐⭐ | ✅ Ilimitado | ❌ | ✅ |

### Recomendação:
- **Iniciantes**: Render.com ou Railway.app
- **Produção**: AWS Elastic Beanstalk ou Heroku
- **Frontend Only**: Vercel

---

## 🔍 Verificação Pós-Deploy

Após deploy em qualquer plataforma, teste:

1. **Health Check**
   ```bash
   curl https://sua-app.com/health
   ```

2. **API Documentation**
   - Acesse: `https://sua-app.com/api-docs`

3. **Frontend**
   - Acesse: `https://sua-app.com`
   - Teste login e funcionalidades

4. **Logs**
   - Verifique logs da plataforma para erros

---

## 🆘 Problemas Comuns

### "Application Error" ou "503"
- Verifique logs da plataforma
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique se o banco de dados está acessível

### "Cannot connect to database"
- Verifique DATABASE_URL
- Confirme que o banco está no mesmo datacenter (para Render, use Internal URL)
- Teste conexão manualmente

### "Build Failed"
- Verifique se package.json está correto
- Confirme que todas as dependências estão listadas
- Veja logs de build para erros específicos

### Frontend não carrega
- Confirme NODE_ENV=production
- Verifique se o build do frontend foi executado
- Veja logs do servidor

---

## 📞 Suporte

- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app
- **Heroku**: https://devcenter.heroku.com
- **AWS**: https://docs.aws.amazon.com/elasticbeanstalk
