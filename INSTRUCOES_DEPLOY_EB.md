# Instruções para Deploy no Elastic Beanstalk

## 🔧 Pré-requisitos (Instalar Primeiro)

### 1. Instalar Python
O EB CLI requer Python. Baixe e instale:
- **Windows:** https://www.python.org/downloads/
- Durante a instalação, marque "Add Python to PATH"
- Reinicie o terminal após a instalação

### 2. Instalar EB CLI
Após instalar Python, execute:
```bash
pip install awsebcli --upgrade --user
```

### 3. Verificar Instalação
```bash
eb --version
```

### 4. Configurar AWS Credentials (se ainda não configurou)
```bash
aws configure
```
Ou crie manualmente: `~/.aws/credentials`
```ini
[default]
aws_access_key_id = SUA_ACCESS_KEY
aws_secret_access_key = SUA_SECRET_KEY
region = us-east-1
```

## ✅ Correções Já Aplicadas

As seguintes correções foram aplicadas e commitadas:

1. ✅ **Procfile simplificado** - Removidas migrations do processo web
2. ✅ **backend/package.json corrigido** - Removido postinstall com migrations
3. ✅ **Hook postdeploy criado** - Migrations agora rodam após deploy de forma segura
4. ✅ **Duplicação removida** - server.js não duplica mais a lógica do app.js
5. ✅ **Frontend servido pelo backend** - app.js já serve o frontend em produção

## 🚀 Passos para Deploy

### Passo 1: Configurar Variáveis de Ambiente no EB

**IMPORTANTE:** Configure estas variáveis ANTES do deploy:

```bash
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
eb setenv DATABASE_URL=postgresql://usuario:senha@host:5432/database
eb setenv PORT=8080
```

Ou configure via Console AWS:
1. Acesse Elastic Beanstalk Console
2. Selecione seu ambiente
3. Configuration → Software → Environment properties
4. Adicione as variáveis acima

### Passo 2: Build do Frontend (Local)

```bash
cd frontend
npm install
npm run build
cd ..
```

Verifique se `frontend/dist/index.html` foi criado.

### Passo 3: Verificar Status Atual

```bash
eb status
```

Se houver erros, colete logs:
```bash
eb logs --all
```

### Passo 4: Deploy

```bash
# Deploy simples
eb deploy

# Ou com staging (recomendado)
eb deploy --staged
```

### Passo 5: Monitorar Deploy

Em outro terminal, acompanhe os eventos:
```bash
eb events --follow
```

### Passo 6: Verificar Saúde

```bash
eb health
```

Deve mostrar: `Ok` ou `Green`

### Passo 7: Testar Aplicação

```bash
# Pegar URL
eb status | findstr "CNAME"

# Testar health check
curl https://seu-ambiente.elasticbeanstalk.com/health

# Testar frontend
curl https://seu-ambiente.elasticbeanstalk.com/
```

## 🔍 Verificações Importantes

### Verificar Variáveis de Ambiente
```bash
eb printenv
```

### Verificar Logs em Tempo Real
```bash
eb logs --stream
```

### Verificar Versões Deployadas
```bash
eb appversion
```

## 🐛 Se o Deploy Falhar

### 1. Coletar Informações
```bash
# Status detalhado
eb status

# Eventos recentes
eb events --verbose

# Logs completos
eb logs --all --zip
```

### 2. Verificar Logs Específicos
Após baixar o zip de logs, procure por:
- `eb-engine.log` - Erros do Elastic Beanstalk
- `web.stdout.log` - Output da aplicação
- `npm-debug.log` - Erros do npm

### 3. Rollback para Versão Anterior
```bash
# Listar versões
eb appversion

# Deploy versão específica
eb deploy --version nome-da-versao
```

### 4. Rebuild Completo (Último Recurso)
Via Console AWS:
1. Elastic Beanstalk → Seu Ambiente
2. Actions → Rebuild Environment

Ou via CLI:
```bash
aws elasticbeanstalk rebuild-environment --environment-name seu-ambiente
```

## 📊 Estrutura do Deploy

O deploy seguirá este fluxo:

1. **Upload do código** para S3
2. **Prebuild Hook** (`.platform/hooks/prebuild/01_install_dependencies.sh`)
   - Instala dependências do backend
   - Instala dependências do frontend
   - Builda o frontend
3. **Inicia aplicação** via Procfile: `web: cd backend && node src/server.js`
4. **Postdeploy Hook** (`.platform/hooks/postdeploy/01_run_migrations.sh`)
   - Roda migrations do Sequelize

## 📝 Arquivos Importantes

### Procfile
```
web: cd backend && node src/server.js
```

### .ebextensions/environment.config
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

### .platform/hooks/prebuild/01_install_dependencies.sh
Instala dependências e builda frontend

### .platform/hooks/postdeploy/01_run_migrations.sh
Roda migrations após deploy

## ⚠️ Problemas Comuns

### "Port already in use"
- O EB define a variável PORT automaticamente
- Certifique-se de usar `process.env.PORT` no código

### "Cannot find module"
- Verifique se todas as dependências estão em `dependencies` (não `devDependencies`)
- O hook prebuild instala com `--omit=dev`

### "Migration failed"
- Verifique se DATABASE_URL está configurado corretamente
- Verifique logs em `eb logs --all`
- O hook postdeploy não falha o deploy se migrations falharem

### "Frontend não carrega"
- Verifique se `frontend/dist` existe após o build
- Verifique se `app.js` tem a configuração de servir arquivos estáticos
- Verifique se NODE_ENV=production está configurado

## 📞 Próximos Passos

1. **Instale Python e EB CLI** (se ainda não instalou)
2. **Configure variáveis de ambiente** no EB
3. **Execute `eb deploy`**
4. **Monitore com `eb events --follow`**
5. **Teste a aplicação** após deploy bem-sucedido
6. **Colete logs** se houver problemas: `eb logs --all --zip`

## 📋 Checklist de Deploy

- [ ] Python instalado
- [ ] EB CLI instalado (`pip install awsebcli`)
- [ ] AWS credentials configuradas
- [ ] Variáveis de ambiente configuradas no EB
- [ ] Frontend buildado localmente (teste)
- [ ] Commit das correções feito
- [ ] `eb status` executado (verificar estado atual)
- [ ] `eb deploy` executado
- [ ] `eb health` mostra OK
- [ ] Aplicação testada e funcionando

## 🎯 Resultado Esperado

Após seguir todos os passos:
- ✅ Deploy concluído sem erros
- ✅ Health status: Green/OK
- ✅ Frontend acessível na URL do EB
- ✅ API respondendo em `/api/*`
- ✅ Health check respondendo em `/health`
- ✅ Migrations executadas automaticamente
- ✅ Todas as instâncias rodando a mesma versão

---

**Dúvidas?** Consulte o arquivo `CORRECOES_EB_DEPLOY.md` para detalhes técnicos das correções aplicadas.
