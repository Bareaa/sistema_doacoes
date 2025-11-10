# Guia de Deploy - Sistema de Doações

## 📋 Pré-requisitos

- Conta em uma plataforma de deploy (Render, Heroku, AWS Elastic Beanstalk, etc.)
- Banco de dados PostgreSQL configurado
- Variáveis de ambiente configuradas

## 🚀 Configuração do Deploy

### 1. Procfile

O projeto já inclui um `Procfile` na raiz que define como a aplicação deve ser iniciada:

```
web: cd backend && npm run migrate && npm start
```

Este comando:
- Navega para o diretório backend
- Executa as migrações do banco de dados
- Inicia o servidor Node.js

### 2. Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente na sua plataforma de deploy:

#### Obrigatórias:
- `NODE_ENV=production`
- `PORT` (geralmente definido automaticamente pela plataforma)
- `DATABASE_URL` - URL de conexão do PostgreSQL
- `JWT_SECRET` - Chave secreta para tokens JWT (use uma string aleatória segura)

#### Opcionais:
- `CORS_ORIGIN` - Origem permitida para CORS (deixe vazio para permitir todas)
- `JWT_EXPIRES_IN` - Tempo de expiração do token (padrão: 24h)

### 3. Processo de Build

O projeto está configurado para:

1. **Instalar dependências**: `npm install` (instala backend e frontend via postinstall)
2. **Build do frontend**: Automaticamente executado após instalação
3. **Servir aplicação**: Backend serve os arquivos estáticos do frontend em produção

### 4. Deploy em Diferentes Plataformas

#### Render.com
1. Conecte seu repositório GitHub
2. Crie um novo Web Service
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Adicione as variáveis de ambiente
5. Adicione um PostgreSQL database

#### Heroku
```bash
# Login no Heroku
heroku login

# Criar aplicação
heroku create nome-da-sua-app

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=sua-chave-secreta-aqui

# Deploy
git push heroku main
```

#### AWS Elastic Beanstalk
1. Instale o EB CLI: `pip install awsebcli`
2. Inicialize: `eb init`
3. Crie ambiente: `eb create production`
4. Configure variáveis: `eb setenv NODE_ENV=production JWT_SECRET=sua-chave`
5. Deploy: `eb deploy`

### 5. Verificação Pós-Deploy

Após o deploy, verifique:

1. **Health Check**: Acesse `https://sua-app.com/health`
   - Deve retornar status 200 com mensagem de sucesso

2. **API Documentation**: Acesse `https://sua-app.com/api-docs`
   - Documentação Swagger da API

3. **Frontend**: Acesse `https://sua-app.com`
   - Aplicação React deve carregar normalmente

## 🔧 Troubleshooting

### Erro: "Port already in use"
- A plataforma define automaticamente a variável `PORT`
- Não defina manualmente a porta em produção

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está configurado corretamente
- Formato: `postgresql://user:password@host:port/database`

### Erro: "JWT_SECRET is required"
- Configure a variável `JWT_SECRET` nas configurações da plataforma

### Frontend não carrega
- Verifique se `NODE_ENV=production` está configurado
- Confirme que o build do frontend foi executado com sucesso
- Verifique os logs: `npm run logs` (ou comando específico da plataforma)

### Migrações não executam
- Verifique se o banco de dados está acessível
- Execute manualmente: `npm run migrate` (via console da plataforma)

## 📊 Monitoramento

### Logs
- Render: Dashboard → Logs
- Heroku: `heroku logs --tail`
- AWS EB: `eb logs`

### Métricas
- Monitore uso de CPU e memória
- Acompanhe tempo de resposta das requisições
- Configure alertas para erros

## 🔄 Atualizações

Para atualizar a aplicação:

1. Faça commit das alterações
2. Push para o repositório
3. A plataforma fará deploy automático (se configurado)

Ou manualmente:
- Render: Deploy manual via dashboard
- Heroku: `git push heroku main`
- AWS EB: `eb deploy`

## 📝 Notas Importantes

- O backend serve o frontend em produção (aplicação monolítica)
- Migrações são executadas automaticamente no start
- Certifique-se de ter backups do banco de dados
- Use HTTPS em produção (geralmente configurado automaticamente)
- Configure rate limiting para APIs públicas
