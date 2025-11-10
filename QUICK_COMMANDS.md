# 🚀 Comandos Rápidos - Sistema de Doações

Referência rápida de comandos úteis para desenvolvimento e deploy.

## 📦 Instalação

```bash
# Instalar todas as dependências (backend + frontend)
npm run install:all

# Instalar apenas backend
npm run install:backend

# Instalar apenas frontend
npm run install:frontend
```

## 🛠️ Desenvolvimento

```bash
# Iniciar backend e frontend simultaneamente
npm run dev

# Iniciar apenas backend (porta 3000)
npm run dev:backend

# Iniciar apenas frontend (porta 5173)
npm run dev:frontend
```

## 🏗️ Build

```bash
# Build do frontend
npm run build

# Build completo para deploy (recomendado)
npm run build:deploy

# Ou manualmente:
node build-for-deploy.js
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes do backend
npm run test:backend

# Testes com coverage
cd backend && npm run test:ci
```

## 🗄️ Banco de Dados

```bash
# Executar migrações
npm run migrate

# Reverter última migração
npm run migrate:undo

# Popular banco com dados de teste
npm run seed

# Resetar banco (undo + migrate + seed)
npm run db:reset
```

## 🔐 Segurança

```bash
# Gerar JWT_SECRET seguro
npm run generate:jwt

# Ou diretamente:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚀 Deploy

### Preparação
```bash
# 1. Build para deploy
npm run build:deploy

# 2. Testar localmente em modo produção
cd backend
NODE_ENV=production npm start

# 3. Verificar health
curl http://localhost:3000/health
```

### Render.com
```bash
# Não precisa de comandos - deploy automático via GitHub
# Configure no dashboard:
# - Build Command: npm install
# - Start Command: npm start
```

### Heroku
```bash
# Login
heroku login

# Criar app
heroku create sistema-doacoes-app

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:essential-0

# Configurar variáveis
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(npm run generate:jwt --silent)

# Deploy
git push heroku main

# Ver logs
heroku logs --tail

# Abrir app
heroku open
```

### Railway
```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar
railway init

# Deploy
railway up

# Ver logs
railway logs
```

### AWS Elastic Beanstalk
```bash
# Instalar CLI
pip install awsebcli

# Inicializar
eb init -p node.js sistema-doacoes

# Criar ambiente
eb create production

# Configurar variáveis
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=$(npm run generate:jwt --silent)
eb setenv DATABASE_URL=postgresql://...

# Deploy
eb deploy

# Ver logs
eb logs

# Abrir app
eb open
```

## 🔍 Verificação

```bash
# Health check local
curl http://localhost:3000/health

# Health check produção
curl https://sua-app.com/health

# Testar API local
curl http://localhost:3000/api/categorias

# Testar API produção
curl https://sua-app.com/api/categorias
```

## 📊 Monitoramento

```bash
# Ver logs - Heroku
heroku logs --tail

# Ver logs - Railway
railway logs

# Ver logs - AWS EB
eb logs

# Ver logs - Render
# Use o dashboard web
```

## 🧹 Limpeza

```bash
# Limpar node_modules e package-lock
npm run clean

# Limpar apenas backend
npm run clean:backend

# Limpar apenas frontend
npm run clean:frontend

# Limpar build do frontend
rm -rf frontend/dist
```

## 🔄 Manutenção

```bash
# Atualizar dependências
npm update
cd backend && npm update
cd frontend && npm update

# Verificar dependências desatualizadas
npm outdated
cd backend && npm outdated
cd frontend && npm outdated

# Audit de segurança
npm audit
npm audit fix
```

## 🆘 Troubleshooting

```bash
# Verificar versões
node --version
npm --version

# Verificar portas em uso (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Matar processo na porta (Windows)
# Encontre o PID com netstat e:
taskkill /PID <PID> /F

# Verificar variáveis de ambiente
echo %NODE_ENV%
echo %DATABASE_URL%

# Testar conexão com banco
cd backend
node -e "require('./src/config/connection').authenticate().then(() => console.log('OK')).catch(e => console.error(e))"
```

## 📝 Git

```bash
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: adiciona funcionalidade X"

# Push
git push origin main

# Ver histórico
git log --oneline

# Criar branch
git checkout -b feature/nova-feature

# Voltar para main
git checkout main
```

## 🎯 Workflow Completo de Deploy

```bash
# 1. Preparar código
git add .
git commit -m "feat: preparar para deploy"
git push origin main

# 2. Build local
npm run build:deploy

# 3. Testar localmente
cd backend
NODE_ENV=production npm start
# Abra http://localhost:3000

# 4. Gerar JWT_SECRET
npm run generate:jwt

# 5. Deploy (escolha uma plataforma)
# Render: Automático via GitHub
# Heroku: git push heroku main
# Railway: railway up
# AWS EB: eb deploy

# 6. Verificar
curl https://sua-app.com/health
curl https://sua-app.com/api-docs

# 7. Monitorar logs
# Use o comando específico da plataforma
```

## 💡 Dicas

### Desenvolvimento
- Use `npm run dev` para desenvolvimento local
- Backend roda em `http://localhost:3000`
- Frontend roda em `http://localhost:5173`
- API docs em `http://localhost:3000/api-docs`

### Deploy
- Sempre teste localmente antes de fazer deploy
- Use `npm run build:deploy` para verificar o build
- Configure todas as variáveis de ambiente
- Monitore logs após o deploy

### Segurança
- Nunca commite arquivos `.env`
- Use JWT_SECRET forte em produção
- Configure CORS adequadamente
- Use HTTPS em produção

### Performance
- Minimize dependências desnecessárias
- Use índices no banco de dados
- Configure cache quando apropriado
- Monitore uso de recursos

---

**Atalhos Úteis:**
- `npm run dev` - Desenvolvimento
- `npm run build:deploy` - Preparar deploy
- `npm run generate:jwt` - Gerar secret
- `npm test` - Executar testes
- `npm run migrate` - Migrar banco
