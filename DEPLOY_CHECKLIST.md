# ✅ Checklist de Deploy - Sistema de Doações

Use este checklist para garantir que tudo está configurado corretamente antes do deploy.

## 📋 Pré-Deploy

### Código e Repositório
- [ ] Código commitado e pushed para o repositório
- [ ] Branch principal (main/master) está atualizada
- [ ] Sem arquivos .env commitados
- [ ] .gitignore configurado corretamente
- [ ] Procfile existe na raiz do projeto

### Build Local
- [ ] Executar `node build-for-deploy.js` sem erros
- [ ] Frontend buildado em `frontend/dist/`
- [ ] Arquivo `frontend/dist/index.html` existe
- [ ] Dependências do backend instaladas

### Testes
- [ ] Todos os testes do backend passando (`npm test`)
- [ ] API funcionando localmente
- [ ] Frontend funcionando localmente

## 🗄️ Banco de Dados

### PostgreSQL
- [ ] Banco de dados PostgreSQL criado
- [ ] URL de conexão (DATABASE_URL) obtida
- [ ] Banco acessível pela plataforma de deploy
- [ ] Credenciais seguras e anotadas

### Migrações
- [ ] Migrações testadas localmente
- [ ] Seeders preparados (se necessário)
- [ ] Backup do banco (se já existir dados)

## 🔐 Variáveis de Ambiente

### Obrigatórias
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` configurado
- [ ] `JWT_SECRET` gerado (use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] `PORT` (geralmente automático)

### Opcionais
- [ ] `CORS_ORIGIN` (se necessário restringir)
- [ ] `JWT_EXPIRES_IN` (padrão: 24h)

## 🚀 Plataforma de Deploy

### Render.com
- [ ] Conta criada e verificada
- [ ] PostgreSQL database criado
- [ ] Web Service criado
- [ ] Repositório conectado
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Variáveis de ambiente configuradas
- [ ] Auto-deploy habilitado (opcional)

### Railway.app
- [ ] Conta criada e verificada
- [ ] Projeto criado do GitHub
- [ ] PostgreSQL service adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy automático configurado

### Heroku
- [ ] Heroku CLI instalado
- [ ] App criado (`heroku create`)
- [ ] PostgreSQL addon adicionado
- [ ] Variáveis configuradas (`heroku config:set`)
- [ ] Git remote heroku configurado

### AWS Elastic Beanstalk
- [ ] EB CLI instalado
- [ ] Projeto inicializado (`eb init`)
- [ ] Ambiente criado (`eb create`)
- [ ] RDS PostgreSQL configurado
- [ ] Variáveis de ambiente configuradas

## 🔍 Pós-Deploy

### Verificação Básica
- [ ] Deploy concluído sem erros
- [ ] Aplicação está rodando
- [ ] URL da aplicação acessível
- [ ] Sem erros 500/503

### Testes de Funcionalidade
- [ ] Health check: `GET /health` retorna 200
- [ ] API Docs: `/api-docs` carrega corretamente
- [ ] Frontend carrega na raiz `/`
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Criação de campanha funciona
- [ ] Doação funciona

### Banco de Dados
- [ ] Migrações executadas com sucesso
- [ ] Tabelas criadas corretamente
- [ ] Conexão estável
- [ ] Sem erros de conexão nos logs

### Segurança
- [ ] HTTPS habilitado (geralmente automático)
- [ ] JWT_SECRET não exposto
- [ ] DATABASE_URL não exposto
- [ ] CORS configurado adequadamente
- [ ] Rate limiting considerado (futuro)

### Performance
- [ ] Tempo de resposta aceitável (<2s)
- [ ] Sem memory leaks
- [ ] Logs sem erros críticos
- [ ] Recursos (CPU/RAM) dentro do limite

## 📊 Monitoramento

### Logs
- [ ] Logs acessíveis na plataforma
- [ ] Sem erros críticos nos logs
- [ ] Logs de startup corretos
- [ ] Conexão com DB confirmada nos logs

### Métricas
- [ ] Uptime monitorado
- [ ] Tempo de resposta monitorado
- [ ] Uso de recursos monitorado
- [ ] Alertas configurados (opcional)

## 📝 Documentação

### Atualizar
- [ ] README.md com URL de produção
- [ ] Documentação da API atualizada
- [ ] Variáveis de ambiente documentadas
- [ ] Processo de deploy documentado

### Compartilhar
- [ ] URL de produção compartilhada com equipe
- [ ] Credenciais de admin criadas (se necessário)
- [ ] Documentação acessível
- [ ] Guia de uso disponível

## 🔄 Manutenção

### Backup
- [ ] Backup automático do banco configurado
- [ ] Processo de restore testado
- [ ] Backup de variáveis de ambiente

### Atualizações
- [ ] Processo de deploy de updates definido
- [ ] Rollback strategy definida
- [ ] Downtime minimizado

## 🆘 Troubleshooting

### Se algo der errado:

1. **Verificar Logs**
   ```bash
   # Render: Dashboard → Logs
   # Heroku: heroku logs --tail
   # Railway: Dashboard → Deployments → Logs
   # AWS EB: eb logs
   ```

2. **Variáveis de Ambiente**
   - Confirme que todas estão configuradas
   - Verifique se não há espaços extras
   - Confirme DATABASE_URL está correto

3. **Banco de Dados**
   - Teste conexão manualmente
   - Verifique se migrações rodaram
   - Confirme que o banco está acessível

4. **Build**
   - Verifique logs de build
   - Confirme que frontend foi buildado
   - Teste build localmente

5. **Rollback**
   - Render: Deploy anterior no dashboard
   - Heroku: `heroku rollback`
   - Railway: Redeploy commit anterior
   - AWS EB: `eb deploy` com versão anterior

## ✨ Sucesso!

Se todos os itens estão marcados, seu deploy está completo! 🎉

### Próximos Passos:
1. Monitore a aplicação nas primeiras horas
2. Teste todas as funcionalidades críticas
3. Configure alertas de uptime
4. Documente qualquer problema encontrado
5. Compartilhe com a equipe

---

**Dica**: Salve este checklist e use-o em cada deploy para garantir consistência.
