# 🚀 Guia de Deploy

## ⚠️ AWS Elastic Beanstalk NÃO É RECOMENDADO

O AWS EB está dando problemas complexos. **Use Render.com** (muito mais simples).

---

## ✅ Render.com (RECOMENDADO)

### Deploy em 5 Minutos

1. **Acesse** https://render.com e faça login com GitHub

2. **Crie PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Nome: `sistema-doacoes-db`
   - Plano: Free
   - Copie a **Internal Database URL**

3. **Crie Web Service**
   - Dashboard → New → Web Service
   - Conecte seu repositório GitHub
   - Configure:
     - Name: `sistema-doacoes`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`

4. **Configure Variáveis de Ambiente**
   - Environment → Add Environment Variable:
   ```
   NODE_ENV=production
   DATABASE_URL=[Cole a Internal Database URL]
   JWT_SECRET=[Gere com: npm run generate:jwt]
   ```

5. **Deploy!**
   - Clique em "Create Web Service"
   - Aguarde 5-10 minutos
   - Acesse a URL fornecida

### Verificar
- Health: `https://sua-app.onrender.com/health`
- API Docs: `https://sua-app.onrender.com/api-docs`
- Frontend: `https://sua-app.onrender.com`

---

## 🔧 Comandos Úteis

```bash
# Gerar JWT_SECRET
npm run generate:jwt

# Build local para testar
npm run build:deploy

# Testar localmente em produção
cd backend
NODE_ENV=production npm start
```

---

## 🆘 Problemas?

### "Application Error"
- Verifique se todas as variáveis de ambiente estão configuradas
- Veja os logs no dashboard do Render

### "Cannot connect to database"
- Use a **Internal Database URL** (não a External)
- Verifique se o banco está no mesmo datacenter

### Frontend não carrega
- Confirme `NODE_ENV=production`
- Verifique se o build foi executado

---

## 📁 Arquivos Importantes

- `Procfile` - Define como iniciar a aplicação
- `package.json` - Scripts e dependências
- `.env.example` - Exemplo de variáveis de ambiente
- `build-for-deploy.js` - Script de build automatizado

---

## 💡 Por Que Render.com?

✅ Deploy em 5 minutos  
✅ PostgreSQL grátis incluído  
✅ Sem configuração complexa  
✅ 750 horas/mês grátis  
✅ Auto-deploy do GitHub  
✅ Funciona de primeira  

---

**Boa sorte com o deploy!** 🚀
