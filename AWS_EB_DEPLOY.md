# 🚀 Deploy no AWS Elastic Beanstalk - Guia Corrigido

## ⚠️ Problema Identificado

O erro que você teve foi causado por:
1. **Workspaces do npm** - AWS EB não suporta bem workspaces
2. **Versão do Node.js** - Não estava usando a versão especificada

## ✅ Correções Aplicadas

### 1. Removido Workspaces
- Removido `"workspaces"` do `package.json`
- Instalação manual de backend e frontend

### 2. Versão Específica do Node.js
- Especificado Node.js 18.x no `package.json`
- Configurado no `.ebextensions/nodecommand.config`

### 3. Configuração AWS EB
- Criado `.ebextensions/nodecommand.config`
- Criado `.ebextensions/npm.config`
- Criado `.npmrc`

### 4. Procfile Atualizado
- Comando direto sem usar `npm run`
- Mais compatível com AWS EB

## 🔧 Arquivos Criados/Modificados

```
.
├── .ebextensions/
│   ├── nodecommand.config    ← Configuração Node.js
│   └── npm.config            ← Instalação customizada
├── .npmrc                    ← Configuração npm
├── Procfile                  ← Atualizado
└── package.json              ← Sem workspaces
```

## 🚀 Deploy Passo a Passo

### 1. Limpar Deploy Anterior (se necessário)

```bash
# Terminar ambiente com problema
eb terminate teste-env

# Ou apenas fazer novo deploy
eb deploy
```

### 2. Commit das Alterações

```bash
git add .
git commit -m "fix: configuração AWS EB corrigida"
```

### 3. Deploy

```bash
# Se já tem ambiente criado
eb deploy

# Se precisa criar novo ambiente
eb create production-env
```

### 4. Configurar Variáveis de Ambiente

```bash
# Configurar variáveis essenciais
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
eb setenv DATABASE_URL=postgresql://user:pass@host:5432/database
```

### 5. Verificar Deploy

```bash
# Ver logs
eb logs

# Abrir aplicação
eb open

# Ver status
eb status
```

## 🗄️ Configurar Banco de Dados

### Opção 1: RDS PostgreSQL (Recomendado)

1. **Criar RDS via Console AWS**:
   - Serviço: RDS
   - Engine: PostgreSQL
   - Template: Free tier
   - DB instance identifier: `sistema-doacoes-db`
   - Master username: `postgres`
   - Master password: [sua senha]
   - Public access: Yes (para desenvolvimento)

2. **Obter Endpoint**:
   - Copie o endpoint do RDS
   - Formato: `sistema-doacoes-db.xxxxx.us-east-1.rds.amazonaws.com`

3. **Configurar DATABASE_URL**:
   ```bash
   eb setenv DATABASE_URL=postgresql://postgres:senha@endpoint:5432/postgres
   ```

### Opção 2: Banco Externo (Mais Fácil)

Use um banco PostgreSQL externo como:
- **Render.com** (grátis)
- **Supabase** (grátis)
- **ElephantSQL** (grátis)

```bash
# Criar banco no Render.com
# Copiar Internal Database URL
eb setenv DATABASE_URL=postgresql://...
```

## 🔍 Verificar se Funcionou

### 1. Health Check
```bash
curl https://seu-app.elasticbeanstalk.com/health
```

Deve retornar:
```json
{
  "message": "Sistema de Doações API está funcionando",
  "timestamp": "...",
  "requestId": "..."
}
```

### 2. API Docs
```bash
curl https://seu-app.elasticbeanstalk.com/api-docs
```

### 3. Frontend
Abra no navegador:
```
https://seu-app.elasticbeanstalk.com
```

## 🆘 Troubleshooting

### Erro: "npm install failed"

**Solução 1**: Verificar logs detalhados
```bash
eb logs --all
```

**Solução 2**: SSH na instância
```bash
eb ssh
cd /var/app/current
ls -la
cat /var/log/eb-engine.log
```

**Solução 3**: Limpar e redeployar
```bash
eb terminate teste-env
eb create production-env
```

### Erro: "Cannot connect to database"

**Verificar**:
1. DATABASE_URL está configurado?
   ```bash
   eb printenv
   ```

2. RDS está acessível?
   - Security Group permite conexão da instância EB
   - Public access habilitado (para teste)

3. Credenciais corretas?
   ```bash
   # Testar conexão
   eb ssh
   psql $DATABASE_URL
   ```

### Erro: "Application not responding"

**Verificar**:
1. Porta correta (AWS EB usa variável PORT)
   ```bash
   eb setenv PORT=8080
   ```

2. Logs de aplicação
   ```bash
   eb logs
   ```

3. Health check
   ```bash
   eb health
   ```

### Erro: "Node version mismatch"

**Solução**: Forçar versão no `.ebextensions/nodecommand.config`
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeVersion: 18.18.0
```

## 📊 Monitoramento

### Ver Logs em Tempo Real
```bash
eb logs --stream
```

### Ver Status
```bash
eb status
eb health --refresh
```

### Ver Métricas
```bash
# Via Console AWS
# CloudWatch → Metrics → Elastic Beanstalk
```

## 💰 Custos

### Free Tier (12 meses)
- ✅ EC2 t2.micro: 750 horas/mês
- ✅ RDS db.t2.micro: 750 horas/mês
- ✅ 20 GB storage
- ✅ 20 GB backup

### Após Free Tier
- EC2 t2.micro: ~$8/mês
- RDS db.t2.micro: ~$15/mês
- **Total**: ~$23/mês

### Alternativa Mais Barata
Use banco externo grátis (Render/Supabase):
- EC2 t2.micro: ~$8/mês
- Banco: $0
- **Total**: ~$8/mês

## 🎯 Recomendação

### Para Desenvolvimento/Teste
**Use Render.com ou Railway** (mais fácil e grátis):
- Deploy em 5 minutos
- PostgreSQL incluído
- Sem configuração complexa
- Veja: `DEPLOY_README.md`

### Para Produção Séria
**Use AWS EB** (mais controle e escalável):
- Mais configuração
- Mais controle
- Melhor para escala
- Integração com outros serviços AWS

## 📝 Comandos Úteis AWS EB

```bash
# Inicializar projeto
eb init -p node.js sistema-doacoes

# Criar ambiente
eb create production-env

# Deploy
eb deploy

# Ver logs
eb logs
eb logs --stream

# Configurar variáveis
eb setenv KEY=value

# Ver variáveis
eb printenv

# SSH na instância
eb ssh

# Status
eb status
eb health

# Abrir app
eb open

# Terminar ambiente
eb terminate production-env

# Listar ambientes
eb list

# Usar ambiente específico
eb use production-env
```

## ✅ Checklist Final

Antes de fazer deploy:
- [ ] Commit das alterações (workspaces removido)
- [ ] `.ebextensions/` criado
- [ ] `.npmrc` criado
- [ ] Procfile atualizado
- [ ] Banco de dados PostgreSQL pronto
- [ ] DATABASE_URL obtido
- [ ] JWT_SECRET gerado

Durante o deploy:
- [ ] `eb deploy` executado
- [ ] Variáveis de ambiente configuradas
- [ ] Sem erros nos logs

Após o deploy:
- [ ] `/health` retorna 200
- [ ] `/api-docs` carrega
- [ ] Frontend carrega
- [ ] API funciona

## 🎉 Próximos Passos

Se o deploy funcionar:
1. Configure domínio customizado
2. Configure HTTPS (certificado SSL)
3. Configure auto-scaling
4. Configure backups do banco
5. Configure monitoramento (CloudWatch)

Se ainda tiver problemas:
1. Veja logs: `eb logs --all`
2. SSH na instância: `eb ssh`
3. Ou considere usar Render.com (mais fácil)

---

**Dica**: Para desenvolvimento, Render.com é muito mais fácil. AWS EB é melhor para produção com necessidades específicas.
