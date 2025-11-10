# 🚀 Deploy no AWS Elastic Beanstalk - Guia Atualizado (2025)

## ⚠️ Problemas Identificados e Corrigidos

### Erro 1: npm workspaces
❌ AWS EB não suporta npm workspaces  
✅ **Solução**: Removido do package.json

### Erro 2: NodeCommand e NodeVersion deprecados
❌ `NodeCommand` e `NodeVersion` não funcionam mais (deprecados desde Node.js 12)  
✅ **Solução**: Usar platform hooks modernos

## ✅ Configuração Moderna (2025)

### Arquivos Criados

```
.
├── .platform/
│   └── hooks/
│       └── prebuild/
│           └── 01_install_dependencies.sh  ← Instala deps e faz build
├── .ebextensions/
│   └── environment.config                  ← Variáveis de ambiente
├── .npmrc                                  ← Config npm
├── Procfile                                ← Comando de start
└── package.json                            ← Sem workspaces
```

### 1. `.platform/hooks/prebuild/01_install_dependencies.sh`
```bash
#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd /var/app/staging/backend
npm install --omit=dev

echo "Installing frontend dependencies..."
cd /var/app/staging/frontend
npm install

echo "Building frontend..."
npm run build

echo "Done!"
```

**O que faz**: Instala dependências e faz build do frontend antes do deploy.

### 2. `.ebextensions/environment.config`
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

**O que faz**: Define NODE_ENV como production.

### 3. `Procfile`
```
web: cd backend && npx sequelize-cli db:migrate && node src/server.js
```

**O que faz**: Executa migrações e inicia o servidor.

### 4. `package.json` (raiz)
```json
{
  "scripts": {
    "start": "cd backend && npm start"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

**O que faz**: AWS EB usa o script `start` automaticamente.

## 🚀 Deploy Passo a Passo

### 1. Commit das Alterações
```bash
git add .
git commit -m "fix: AWS EB configuração moderna"
```

### 2. Configurar Banco de Dados

**Opção A: RDS PostgreSQL (AWS)**
```bash
# Via Console AWS
# RDS → Create Database → PostgreSQL → Free Tier
# Anote o endpoint
```

**Opção B: Banco Externo (Mais Fácil)** ⭐
```bash
# Use Render.com, Supabase ou ElephantSQL
# Copie a DATABASE_URL
```

### 3. Configurar Variáveis de Ambiente
```bash
eb setenv NODE_ENV=production
eb setenv DATABASE_URL=postgresql://user:pass@host:5432/db
eb setenv JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
```

### 4. Deploy
```bash
# Se já tem ambiente
eb deploy

# Se precisa criar
eb create production-env
```

### 5. Verificar
```bash
# Ver logs
eb logs

# Abrir app
eb open

# Health check
curl https://seu-app.elasticbeanstalk.com/health
```

## 🔍 Verificar se Funcionou

### Logs Devem Mostrar:
```
✅ Installing backend dependencies...
✅ Installing frontend dependencies...
✅ Building frontend...
✅ Done!
✅ Starting application...
✅ Server running on port 8080
✅ Database connection established
```

### Endpoints Devem Funcionar:
```bash
# Health check
curl https://seu-app.elasticbeanstalk.com/health
# Deve retornar: {"message": "Sistema de Doações API está funcionando"}

# API
curl https://seu-app.elasticbeanstalk.com/api/campanhas
# Deve retornar: []

# Frontend
# Abra no navegador: https://seu-app.elasticbeanstalk.com
# Deve carregar a página React
```

## 🆘 Troubleshooting

### Erro: "Failed to install dependencies"

**Ver logs detalhados:**
```bash
eb logs --all
```

**SSH na instância:**
```bash
eb ssh
cd /var/app/current
ls -la
cat /var/log/eb-engine.log
```

**Verificar hook:**
```bash
eb ssh
cat /var/app/current/.platform/hooks/prebuild/01_install_dependencies.sh
ls -la /var/app/current/.platform/hooks/prebuild/
```

### Erro: "Cannot connect to database"

**Verificar variáveis:**
```bash
eb printenv
```

**Testar conexão:**
```bash
eb ssh
echo $DATABASE_URL
# Deve mostrar a URL do banco
```

**Se usar RDS, verificar Security Group:**
- EC2 → Security Groups
- Permitir conexão da instância EB para RDS (porta 5432)

### Erro: "Application not responding"

**Verificar porta:**
```bash
eb ssh
echo $PORT
# AWS EB define automaticamente
```

**Verificar processo:**
```bash
eb ssh
ps aux | grep node
# Deve mostrar o processo Node.js rodando
```

### Erro: "Frontend não carrega"

**Verificar build:**
```bash
eb ssh
ls -la /var/app/current/frontend/dist/
# Deve ter index.html e assets/
```

**Verificar NODE_ENV:**
```bash
eb ssh
echo $NODE_ENV
# Deve ser "production"
```

## 💡 Dicas Importantes

### 1. Platform Hooks vs .ebextensions

**Moderno (2025)**: `.platform/hooks/` ✅
- Mais simples
- Melhor performance
- Recomendado pela AWS

**Antigo**: `.ebextensions/commands` ❌
- Deprecado
- Mais lento
- Não usar

### 2. Permissões do Script

O script `.platform/hooks/prebuild/01_install_dependencies.sh` precisa ser executável:

```bash
# No Windows (Git Bash)
git update-index --chmod=+x .platform/hooks/prebuild/01_install_dependencies.sh

# No Linux/Mac
chmod +x .platform/hooks/prebuild/01_install_dependencies.sh
```

### 3. Ordem de Execução

```
1. AWS EB baixa código
   ↓
2. Executa .platform/hooks/prebuild/
   ├─ Instala backend
   ├─ Instala frontend
   └─ Build frontend
   ↓
3. Executa npm install (raiz)
   ↓
4. Executa Procfile (start)
   ├─ Migrações
   └─ Inicia servidor
```

## 📊 Comparação: AWS EB vs Render.com

| Aspecto | AWS EB | Render.com |
|---------|--------|------------|
| **Setup** | 30-60 min | 5 min |
| **Complexidade** | Alta | Baixa |
| **Custo** | ~$23/mês* | Grátis |
| **Controle** | Total | Limitado |
| **Recomendado para** | Produção | Dev/Teste |

*Após free tier de 12 meses

## 🎯 Recomendação Final

### Para Você Agora:

**Se AWS EB continuar dando problemas após essas correções:**
→ **Use Render.com** (veja `DEPLOY_README.md`)

**Por quê?**
- Deploy em 5 minutos
- PostgreSQL grátis incluído
- Sem configuração complexa
- Funciona de primeira

**AWS EB é melhor quando:**
- Você precisa de controle total
- Vai usar outros serviços AWS
- Tem orçamento para infraestrutura
- Precisa de alta escalabilidade

## ✅ Checklist Final

Antes de fazer deploy:
- [ ] Commit das alterações
- [ ] `.platform/hooks/prebuild/` existe
- [ ] Script tem permissão de execução
- [ ] `.ebextensions/environment.config` existe
- [ ] `package.json` sem workspaces
- [ ] Banco de dados pronto
- [ ] DATABASE_URL em mãos
- [ ] JWT_SECRET gerado

Durante o deploy:
- [ ] `eb deploy` executado
- [ ] Variáveis configuradas
- [ ] Sem erros nos logs

Após o deploy:
- [ ] `/health` retorna 200
- [ ] `/api-docs` carrega
- [ ] Frontend carrega
- [ ] API funciona

## 🚀 Comando Único

```bash
# Commit e deploy
git add . && \
git commit -m "fix: AWS EB config moderna" && \
eb deploy && \
eb logs
```

## 📞 Precisa de Ajuda?

- **Render.com (mais fácil)**: `DEPLOY_README.md`
- **Outras plataformas**: `DEPLOY_PLATFORMS.md`
- **Comandos úteis**: `QUICK_COMMANDS.md`
- **Checklist**: `DEPLOY_CHECKLIST.md`

---

**Boa sorte!** Se AWS EB não funcionar em 10 minutos, vá para Render.com. Sério. 😊
