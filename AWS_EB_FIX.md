# 🔧 Correções para AWS Elastic Beanstalk

## ❌ Problema Original

```
ERROR: 'npm' failed to install dependencies that you defined in 'package.json'
WARNING: The deployment used the default Node.js version
```

## ✅ Correções Aplicadas

### 1. Removido Workspaces do npm
**Antes** (`package.json`):
```json
{
  "workspaces": ["backend", "frontend"]
}
```

**Depois**:
```json
{
  // workspaces removido
}
```

**Por quê?** AWS EB não suporta bem npm workspaces.

---

### 2. Versão Específica do Node.js
**Antes** (`package.json`):
```json
{
  "engines": {
    "node": ">=16.0.0"
  }
}
```

**Depois**:
```json
{
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

**Por quê?** AWS EB precisa de versão específica, não range.

---

### 3. Criado `.ebextensions/nodecommand.config`
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: 18.18.0
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

**Por quê?** Força uso da versão correta do Node.js.

---

### 4. Criado `.ebextensions/npm.config`
```yaml
commands:
  01_install_backend:
    command: "cd backend && npm install --production"
  02_install_frontend:
    command: "cd frontend && npm install"
  03_build_frontend:
    command: "cd frontend && npm run build"
```

**Por quê?** Instala dependências manualmente sem workspaces.

---

### 5. Criado `.npmrc`
```
legacy-peer-deps=true
engine-strict=false
```

**Por quê?** Evita conflitos de dependências.

---

### 6. Atualizado `Procfile`
**Antes**:
```
web: cd backend && npm run migrate && npm start
```

**Depois**:
```
web: cd backend && npx sequelize-cli db:migrate && node src/server.js
```

**Por quê?** Comando direto é mais confiável no AWS EB.

---

## 📁 Arquivos Criados

```
.
├── .ebextensions/
│   ├── nodecommand.config    ← Novo
│   └── npm.config            ← Novo
├── .npmrc                    ← Novo
├── AWS_EB_DEPLOY.md          ← Novo (guia completo)
├── AWS_EB_FIX.md             ← Este arquivo
├── Procfile                  ← Modificado
└── package.json              ← Modificado
```

## 🚀 Como Fazer Deploy Agora

### 1. Commit das Alterações
```bash
git add .
git commit -m "fix: configuração AWS EB corrigida"
```

### 2. Deploy
```bash
# Se já tem ambiente
eb deploy

# Se precisa criar novo
eb create production-env
```

### 3. Configurar Variáveis
```bash
eb setenv NODE_ENV=production
eb setenv DATABASE_URL=postgresql://...
eb setenv JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
```

### 4. Verificar
```bash
eb logs
eb open
```

## 🔍 Verificar se Funcionou

### Logs Devem Mostrar:
```
✅ Successfully installed backend dependencies
✅ Successfully installed frontend dependencies
✅ Successfully built frontend
✅ Starting application...
✅ Server running on port 8080
```

### Endpoints Devem Funcionar:
```bash
# Health check
curl https://seu-app.elasticbeanstalk.com/health

# API
curl https://seu-app.elasticbeanstalk.com/api/campanhas

# Frontend
# Abra no navegador
```

## 🆘 Se Ainda Tiver Problemas

### 1. Ver Logs Completos
```bash
eb logs --all
```

### 2. SSH na Instância
```bash
eb ssh
cd /var/app/current
ls -la
cat /var/log/eb-engine.log
```

### 3. Verificar Instalação
```bash
eb ssh
node --version  # Deve ser 18.x
npm --version   # Deve ser 9.x
cd /var/app/current/backend
ls node_modules  # Deve ter dependências
cd /var/app/current/frontend
ls dist  # Deve ter build
```

### 4. Limpar e Recriar
```bash
eb terminate teste-env
eb create production-env
```

## 💡 Alternativa Mais Fácil

Se AWS EB continuar dando problemas, **use Render.com**:

```bash
# Muito mais simples!
# 1. Conecte GitHub no Render.com
# 2. Crie PostgreSQL database
# 3. Crie Web Service
# 4. Configure variáveis
# 5. Deploy automático!
```

Veja: **[DEPLOY_README.md](./DEPLOY_README.md)**

## 📊 Comparação

| Aspecto | AWS EB | Render.com |
|---------|--------|------------|
| **Facilidade** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Configuração** | Complexa | Simples |
| **Tempo Setup** | 30-60 min | 5 min |
| **Custo** | ~$23/mês* | Grátis |
| **Escalabilidade** | Excelente | Boa |
| **Controle** | Total | Limitado |

*Após free tier de 12 meses

## ✅ Checklist

Antes de tentar deploy novamente:
- [ ] Commit das alterações
- [ ] `.ebextensions/` existe
- [ ] `.npmrc` existe
- [ ] `package.json` sem workspaces
- [ ] Versão Node.js específica (18.x)
- [ ] Procfile atualizado
- [ ] DATABASE_URL pronto
- [ ] JWT_SECRET gerado

## 📚 Documentação Adicional

- **[AWS_EB_DEPLOY.md](./AWS_EB_DEPLOY.md)** - Guia completo AWS EB
- **[DEPLOY_README.md](./DEPLOY_README.md)** - Deploy rápido (Render)
- **[DEPLOY_PLATFORMS.md](./DEPLOY_PLATFORMS.md)** - Todas as plataformas
- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - Checklist completo

---

**Resumo**: As correções foram aplicadas. Faça commit e tente `eb deploy` novamente. Se continuar com problemas, considere usar Render.com que é muito mais simples! 🚀
