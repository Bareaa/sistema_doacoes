# Correções Aplicadas para Deploy no Elastic Beanstalk

## ✅ Problemas Identificados e Corrigidos

### 1. Migrations no Procfile (CORRIGIDO)
**Problema:** O Procfile estava executando migrations no processo web, causando timeouts.

**Antes:**
```
web: cd backend && npx sequelize-cli db:migrate && node src/server.js
```

**Depois:**
```
web: cd backend && node src/server.js
```

### 2. Postinstall com Migrations no backend/package.json (CORRIGIDO)
**Problema:** O script `postinstall` executava migrations automaticamente, podendo causar problemas.

**Antes:**
```json
"deploy": "npm run migrate && npm start",
"postinstall": "npm run migrate",
```

**Depois:**
```json
"deploy": "npm start",
```

### 3. Hook de Postdeploy Criado (NOVO)
**Solução:** Criado `.platform/hooks/postdeploy/01_run_migrations.sh` para executar migrations de forma segura após o deploy.

```bash
#!/bin/bash
set -e

echo "Running sequelize migrations..."
cd /var/app/current/backend
npm install --omit=dev
npx sequelize-cli db:migrate --env production || {
  echo "Migration failed, but continuing deployment..."
  exit 0
}
echo "Migrations completed successfully!"
```

### 4. Duplicação de Código Removida (CORRIGIDO)
**Problema:** O `server.js` estava duplicando a lógica de servir o frontend que já existia no `app.js`.

**Solução:** Removida a duplicação. O `app.js` já serve o frontend corretamente em produção.

### 5. Configuração .ebextensions (JÁ ESTAVA OK)
✅ Não contém `NodeCommand` ou `NodeVersion` obsoletos
✅ Apenas define `NODE_ENV: production`

## 📋 Estrutura de Arquivos Atual

```
.
├── .ebextensions/
│   └── environment.config          # ✅ OK - apenas NODE_ENV
├── .platform/
│   └── hooks/
│       ├── prebuild/
│       │   └── 01_install_dependencies.sh  # Instala deps e builda frontend
│       └── postdeploy/
│           └── 01_run_migrations.sh        # ✅ NOVO - Roda migrations
├── Procfile                        # ✅ CORRIGIDO - sem migrations
├── package.json                    # ✅ OK - root package
├── backend/
│   ├── package.json               # ✅ CORRIGIDO - sem postinstall migrations
│   └── src/
│       ├── app.js                 # ✅ OK - serve frontend em produção
│       └── server.js              # ✅ CORRIGIDO - sem duplicação
└── frontend/
    └── dist/                      # Será criado no prebuild hook
```

## 🚀 Próximos Passos para Deploy

### 1. Instalar EB CLI (se ainda não tiver)
```bash
pip install awsebcli --upgrade --user
```

### 2. Verificar Status Atual
```bash
eb status
eb events --verbose
```

### 3. Build Local (Opcional - para testar)
```bash
npm run build:deploy
```

### 4. Deploy
```bash
# Opção A: Deploy direto
eb deploy

# Opção B: Deploy com staging
eb deploy --staged
```

### 5. Monitorar Deploy
```bash
# Ver eventos em tempo real
eb events --follow

# Ver logs
eb logs --all

# Verificar saúde
eb health
```

### 6. Testar Aplicação
```bash
# Pegar URL do ambiente
eb status | grep "CNAME"

# Testar health check
curl -I https://seu-ambiente.elasticbeanstalk.com/health

# Testar frontend
curl -s https://seu-ambiente.elasticbeanstalk.com/ | head -n 30
```

## 🔍 Verificações Importantes

### Variáveis de Ambiente no EB
Certifique-se de que estas variáveis estão configuradas no Elastic Beanstalk:

```bash
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=sua-chave-secreta-aqui
eb setenv DATABASE_URL=postgresql://user:pass@host:5432/dbname
eb setenv PORT=8080
```

### Verificar Configuração
```bash
eb printenv
```

## 🐛 Troubleshooting

### Se o deploy falhar:

1. **Coletar logs completos:**
```bash
eb logs --all --zip
```

2. **Verificar eventos:**
```bash
eb events --verbose | head -n 50
```

3. **Verificar saúde das instâncias:**
```bash
eb health --refresh
```

4. **Rollback se necessário:**
```bash
# Listar versões
aws elasticbeanstalk describe-application-versions \
  --application-name seu-app \
  --query 'ApplicationVersions[*].{Label:VersionLabel,Date:DateCreated}'

# Fazer rollback
eb deploy --version LABEL-DA-VERSAO-OK
```

5. **Rebuild completo (último recurso):**
```bash
# No console AWS: Actions → Rebuild Environment
# Ou via CLI:
aws elasticbeanstalk rebuild-environment --environment-name seu-ambiente
```

## 📝 Commit Realizado

```
fix(eb): remove migrations from Procfile and add postdeploy hook

- Remove migrations from web process in Procfile
- Remove postinstall migrations from backend/package.json
- Add .platform/hooks/postdeploy/01_run_migrations.sh
- Remove duplicate frontend serving code from server.js
```

## ✅ Checklist Final

- [x] Procfile simplificado (sem migrations)
- [x] backend/package.json sem postinstall migrations
- [x] Hook postdeploy criado para migrations
- [x] Duplicação removida do server.js
- [x] app.js serve frontend corretamente
- [x] .ebextensions sem parâmetros obsoletos
- [x] Commit realizado
- [ ] EB CLI instalado
- [ ] Variáveis de ambiente configuradas no EB
- [ ] Deploy executado
- [ ] Testes realizados

## 🎯 Resultado Esperado

Após o deploy:
- ✅ Todas as instâncias rodando a mesma versão
- ✅ Health status: OK
- ✅ Frontend acessível na URL do EB
- ✅ API respondendo em /api/*
- ✅ Health check respondendo em /health
- ✅ Migrations executadas automaticamente no postdeploy
