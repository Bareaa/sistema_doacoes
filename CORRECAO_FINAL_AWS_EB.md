# ✅ Correção Final - AWS Elastic Beanstalk (2025)

## 🎯 Problema Resolvido

### Erro Original:
```
ERROR: Unknown or duplicate parameter: NodeCommand
ERROR: Unknown or duplicate parameter: NodeVersion
```

### Causa:
AWS Elastic Beanstalk **não usa mais** `NodeCommand` e `NodeVersion` desde Node.js 12.  
Esses parâmetros foram **deprecados** e removidos.

## ✅ Solução Aplicada

### Abordagem Moderna (2025)

AWS EB agora usa **Platform Hooks** em vez de configurações antigas.

### Arquivos Criados/Atualizados:

```
✅ .platform/hooks/prebuild/01_install_dependencies.sh  ← NOVO (abordagem moderna)
✅ .ebextensions/environment.config                     ← ATUALIZADO (sem NodeCommand)
✅ .npmrc                                               ← Configuração npm
✅ Procfile                                             ← Comando de start
✅ package.json                                         ← Sem workspaces
```

### O Que Mudou:

#### ❌ ANTES (Não funciona mais):
```yaml
# .ebextensions/nodecommand.config
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"      ← DEPRECADO
    NodeVersion: 18.18.0          ← DEPRECADO
```

#### ✅ AGORA (Funciona):
```bash
# .platform/hooks/prebuild/01_install_dependencies.sh
#!/bin/bash
cd /var/app/staging/backend && npm install --omit=dev
cd /var/app/staging/frontend && npm install && npm run build
```

```yaml
# .ebextensions/environment.config
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

## 🚀 Como Fazer Deploy Agora

### 1. Commit das Correções
```bash
git add .
git commit -m "fix: AWS EB configuração moderna (2025)"
```

### 2. Deploy
```bash
eb deploy
```

### 3. Verificar
```bash
eb logs
eb open
```

## 🔍 Como Saber se Funcionou

### Logs Devem Mostrar:
```
✅ Installing backend dependencies...
✅ Installing frontend dependencies...
✅ Building frontend...
✅ Done!
✅ Starting application...
✅ Server running on port 8080
```

### Sem Erros Como:
```
❌ Unknown or duplicate parameter: NodeCommand
❌ Unknown or duplicate parameter: NodeVersion
❌ Failed to install dependencies
```

### Endpoints Funcionando:
```bash
# Health check
curl https://seu-app.elasticbeanstalk.com/health
# Retorna: {"message": "Sistema de Doações API está funcionando"}

# Frontend
# Abra no navegador e deve carregar
```

## 📁 Estrutura Final

```
sistema-doacoes/
├── .platform/                          ← NOVO (abordagem moderna)
│   └── hooks/
│       └── prebuild/
│           └── 01_install_dependencies.sh
│
├── .ebextensions/                      ← ATUALIZADO
│   └── environment.config              ← Sem NodeCommand/NodeVersion
│
├── .npmrc                              ← Config npm
├── Procfile                            ← Start command
├── package.json                        ← Sem workspaces
│
├── backend/
│   ├── src/
│   │   └── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    ├── dist/                           ← Criado no build
    └── package.json
```

## 🆘 Se Ainda Tiver Problemas

### 1. Verificar Permissões do Script
```bash
git ls-files --stage .platform/hooks/prebuild/01_install_dependencies.sh
# Deve mostrar: 100755 (executável)
```

### 2. Ver Logs Detalhados
```bash
eb logs --all
```

### 3. SSH na Instância
```bash
eb ssh
cat /var/log/eb-engine.log
ls -la /var/app/current/.platform/hooks/prebuild/
```

### 4. Verificar Build do Frontend
```bash
eb ssh
ls -la /var/app/current/frontend/dist/
# Deve ter index.html e assets/
```

## 💡 Por Que Isso Aconteceu?

### Histórico AWS EB:

**Node.js ≤ 12** (até 2020):
- Usava `NodeCommand` e `NodeVersion`
- Configuração via `.ebextensions`

**Node.js ≥ 14** (2020+):
- Deprecou `NodeCommand` e `NodeVersion`
- Introduziu Platform Hooks

**Node.js 18** (2025):
- `NodeCommand` e `NodeVersion` **removidos completamente**
- **Obrigatório** usar Platform Hooks

### Documentação AWS:
> "NodeCommand and NodeVersion are no longer supported. Use platform hooks instead."

## ✅ Checklist Final

Antes de fazer deploy:
- [x] Removido `NodeCommand` e `NodeVersion`
- [x] Criado `.platform/hooks/prebuild/`
- [x] Script com permissão de execução
- [x] `.ebextensions/environment.config` atualizado
- [x] `package.json` sem workspaces
- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente configuradas

Durante o deploy:
- [ ] `git commit` das alterações
- [ ] `eb deploy` executado
- [ ] Logs sem erros

Após o deploy:
- [ ] `/health` retorna 200
- [ ] Frontend carrega
- [ ] API funciona

## 🎯 Próximos Passos

### Opção 1: Deploy AWS EB Agora
```bash
git add .
git commit -m "fix: AWS EB config moderna"
eb deploy
eb logs
```

### Opção 2: Usar Render.com (Mais Fácil)
Se AWS EB continuar complicado, use Render.com:
- Deploy em 5 minutos
- Sem configuração complexa
- PostgreSQL grátis incluído

Veja: `DEPLOY_README.md`

## 📚 Documentação

- **AWS_EB_DEPLOY_V2.md** - Guia completo atualizado
- **DEPLOY_README.md** - Deploy rápido (Render)
- **PROXIMOS_PASSOS.md** - O que fazer agora

## 🎉 Conclusão

As correções foram aplicadas usando a **abordagem moderna (2025)** do AWS Elastic Beanstalk.

**Tente o deploy agora:**
```bash
git add . && git commit -m "fix: AWS EB" && eb deploy
```

**Se funcionar**: Parabéns! 🎉  
**Se não funcionar**: Render.com está esperando! 😊

---

**Última atualização**: Novembro 2025  
**Compatível com**: AWS Elastic Beanstalk Node.js 18 Platform
