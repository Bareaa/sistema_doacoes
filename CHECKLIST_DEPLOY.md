# ✅ Checklist de Deploy - Elastic Beanstalk

## 🎯 Status das Correções

### ✅ Correções Aplicadas (Concluído)
- [x] Procfile simplificado (migrations removidas)
- [x] backend/package.json corrigido (postinstall removido)
- [x] Hook postdeploy criado para migrations
- [x] Duplicação removida do server.js
- [x] .ebextensions verificado (sem parâmetros obsoletos)
- [x] app.js serve frontend corretamente
- [x] Commits realizados
- [x] Documentação criada

---

## 📋 Pré-requisitos (Fazer Agora)

### Instalação de Ferramentas
- [ ] Python instalado (https://www.python.org/downloads/)
  - [ ] Opção "Add Python to PATH" marcada
  - [ ] Terminal reiniciado após instalação
- [ ] EB CLI instalado: `pip install awsebcli --upgrade --user`
- [ ] Verificar instalação: `eb --version`
- [ ] AWS credentials configuradas: `aws configure`

### Configuração do Ambiente EB
- [ ] Variáveis de ambiente configuradas:
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=<gerar-com-crypto>`
  - [ ] `DATABASE_URL=postgresql://...`
  - [ ] `PORT=8080`
- [ ] Verificar variáveis: `eb printenv`

### Build Local (Teste)
- [ ] Frontend buildado: `cd frontend && npm run build`
- [ ] Verificar `frontend/dist/index.html` existe
- [ ] Testar localmente: `npm start` (na raiz)

---

## 🚀 Processo de Deploy

### 1. Verificação Pré-Deploy
```bash
# Status atual
[ ] eb status

# Eventos recentes
[ ] eb events --verbose

# Coletar logs atuais (backup)
[ ] eb logs --all --zip
```

### 2. Deploy
```bash
# Opção recomendada
[ ] eb deploy --staged

# Ou deploy direto
[ ] eb deploy
```

### 3. Monitoramento
```bash
# Em outro terminal, acompanhar eventos
[ ] eb events --follow

# Verificar saúde
[ ] eb health
```

### 4. Verificação Pós-Deploy
```bash
# Pegar URL do ambiente
[ ] eb status | findstr "CNAME"

# Testar health check
[ ] curl -I https://seu-ambiente.elasticbeanstalk.com/health

# Testar frontend
[ ] curl https://seu-ambiente.elasticbeanstalk.com/

# Testar API
[ ] curl https://seu-ambiente.elasticbeanstalk.com/api/categorias
```

---

## 🔍 Verificações de Sucesso

### Health Check
- [ ] `eb health` mostra: **Green** ou **Ok**
- [ ] Todas as instâncias com status **Ok**
- [ ] Sem warnings de deployment

### Aplicação Funcionando
- [ ] Frontend carrega na URL do EB
- [ ] Página inicial renderiza corretamente
- [ ] API responde em `/api/*`
- [ ] Health endpoint responde: `/health`
- [ ] Autenticação funciona (login/registro)
- [ ] Campanhas listam corretamente

### Logs Limpos
- [ ] `eb logs` sem erros críticos
- [ ] Migrations executadas com sucesso
- [ ] Servidor iniciou sem erros

---

## 🐛 Se Houver Problemas

### Coletar Informações
```bash
[ ] eb status
[ ] eb events --verbose | head -n 100
[ ] eb logs --all --zip
[ ] eb printenv
```

### Análise de Logs
Procure por estes arquivos no zip de logs:
- [ ] `eb-engine.log` - Erros do EB
- [ ] `web.stdout.log` - Output da aplicação
- [ ] `npm-debug.log` - Erros do npm
- [ ] `01_run_migrations.sh.log` - Logs das migrations

### Ações Corretivas
- [ ] Verificar variáveis de ambiente
- [ ] Verificar DATABASE_URL está correto
- [ ] Verificar se frontend/dist existe
- [ ] Verificar se todas as dependências estão em `dependencies`

### Rollback (Se Necessário)
```bash
# Listar versões
[ ] eb appversion

# Deploy versão anterior
[ ] eb deploy --version <versao-anterior>
```

### Rebuild (Último Recurso)
```bash
# Via console AWS ou:
[ ] aws elasticbeanstalk rebuild-environment --environment-name <seu-ambiente>
```

---

## 📊 Fluxo do Deploy (Referência)

```
1. Upload do código → S3
2. Prebuild Hook
   ├── Instala deps backend
   ├── Instala deps frontend
   └── Builda frontend
3. Inicia aplicação (Procfile)
   └── web: cd backend && node src/server.js
4. Postdeploy Hook
   └── Roda migrations
5. Health check
   └── Verifica se app está respondendo
```

---

## 📝 Comandos Úteis

### Informações do Ambiente
```bash
eb status              # Status geral
eb health              # Saúde das instâncias
eb printenv            # Variáveis de ambiente
eb appversion          # Versões deployadas
```

### Logs
```bash
eb logs                # Logs recentes
eb logs --all          # Todos os logs
eb logs --stream       # Logs em tempo real
eb logs --all --zip    # Download de todos os logs
```

### Deploy
```bash
eb deploy              # Deploy normal
eb deploy --staged     # Deploy com staging
eb deploy --version X  # Deploy versão específica
```

### Configuração
```bash
eb setenv KEY=VALUE    # Definir variável
eb printenv            # Ver variáveis
eb config              # Abrir editor de config
```

---

## 🎯 Resultado Final Esperado

Após completar todos os itens:

✅ **Deploy bem-sucedido**
- Sem erros ou aborts
- Todas as instâncias rodando mesma versão
- Health status: Green

✅ **Aplicação funcionando**
- Frontend acessível
- API respondendo
- Autenticação funcionando
- Banco de dados conectado

✅ **Migrations executadas**
- Tabelas criadas
- Dados iniciais (se houver seeds)

✅ **Logs limpos**
- Sem erros críticos
- Servidor iniciado corretamente

---

## 📞 Próximo Passo

**AGORA:**
1. Instale Python e EB CLI
2. Configure variáveis de ambiente no EB
3. Execute `eb status` e `eb events --verbose`
4. Me envie os outputs para análise final

**Documentação de Referência:**
- `RESUMO_CORRECOES.md` - Resumo executivo
- `CORRECOES_EB_DEPLOY.md` - Detalhes técnicos
- `INSTRUCOES_DEPLOY_EB.md` - Passo a passo completo
- `CHECKLIST_DEPLOY.md` - Este arquivo

---

**Última atualização:** 10/11/2025
**Status:** Correções aplicadas, aguardando instalação do EB CLI para deploy
