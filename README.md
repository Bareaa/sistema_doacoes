# Sistema de Doações - Full Stack Application

Sistema completo de doações com gerenciamento de campanhas, autenticação de usuários e processamento de doações.

## 🏗️ Estrutura do Projeto

```
sistema-doacoes/
├── backend/                 # API REST em Node.js + Express
│   ├── src/                # Código fonte da API
│   ├── package.json        # Dependências do backend
│   ├── README.md          # Documentação da API
│   └── ...
├── frontend/              # Interface web (React - em desenvolvimento)
│   └── ...
├── .kiro/                 # Especificações e configurações do Kiro
├── .gitignore            # Arquivos ignorados pelo Git
└── README.md             # Este arquivo
```

## 🚀 Tecnologias

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

### Frontend (Planejado)
- **Framework**: React.js
- **Styling**: CSS Modules / Styled Components
- **State Management**: Context API / Redux
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 🔧 Como Executar

### Backend (API)

1. **Navegue para a pasta do backend**:
   ```bash
   cd backend
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Execute as migrações do banco**:
   ```bash
   npm run migrate
   ```

5. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   npm run dev:backend        -          inicia o back-end
   ```

6. **Acesse a API**:
   - API Base: `http://localhost:3000`
   - Documentação: `http://localhost:3000/api-docs`

### Frontend (Em Desenvolvimento)

O frontend será desenvolvido em React.js e estará disponível em breve.

## 📚 Documentação

### Backend
- **[README do Backend](./backend/README.md)**: Documentação completa da API
- **[Exemplos da API](./backend/API_EXAMPLES.md)**: Exemplos de uso dos endpoints
- **[Guia de Deploy](./backend/DEPLOYMENT.md)**: Instruções para deploy em produção
- **[Variáveis de Ambiente](./backend/ENVIRONMENT.md)**: Configuração de ambiente

### Especificações
- **[Requisitos](./kiro/specs/donation-system-api/requirements.md)**: Requisitos funcionais
- **[Design](./kiro/specs/donation-system-api/design.md)**: Arquitetura e design
- **[Tarefas](./kiro/specs/donation-system-api/tasks.md)**: Lista de implementação

## ✨ Funcionalidades

### ✅ Implementadas (Backend)
- 🔐 Autenticação e registro de usuários com JWT
- 🏷️ Gerenciamento de categorias de campanhas
- 📋 Criação e gerenciamento de campanhas
- 💰 Sistema de doações com atualização em tempo real
- 💬 Sistema de comentários nas campanhas
- 📚 Documentação completa da API com Swagger
- 🧪 Testes unitários e de integração
- 🔒 Validação de dados e middleware de segurança
- 📊 Logging e tratamento de erros

### 🚧 Em Desenvolvimento
- 🎨 Interface web responsiva (React)
- 📱 Aplicativo mobile (React Native)
- 📧 Sistema de notificações por email
- 💳 Integração com gateway de pagamento
- 📈 Dashboard administrativo
- 🔍 Sistema de busca avançada

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login do usuário

### Categorias
- `GET /api/categorias` - Listar categorias
- `POST /api/categorias` - Criar categoria
- `GET /api/categorias/:id` - Obter categoria
- `PUT /api/categorias/:id` - Atualizar categoria
- `DELETE /api/categorias/:id` - Deletar categoria

### Campanhas
- `GET /api/campanhas` - Listar campanhas
- `POST /api/campanhas` - Criar campanha
- `GET /api/campanhas/:id` - Obter campanha
- `PUT /api/campanhas/:id` - Atualizar campanha
- `DELETE /api/campanhas/:id` - Deletar campanha

### Doações
- `GET /api/campanhas/:id/doacoes` - Listar doações da campanha
- `POST /api/campanhas/:id/doacoes` - Fazer doação
- `GET /api/doacoes/:id` - Obter doação

### Comentários
- `GET /api/campanhas/:id/comentarios` - Listar comentários
- `POST /api/campanhas/:id/comentarios` - Adicionar comentário
- `PUT /api/comentarios/:id` - Atualizar comentário
- `DELETE /api/comentarios/:id` - Deletar comentário

## 🧪 Testes

### Backend
```bash
cd backend

# Executar todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes com coverage
npm run test:ci
```

## 🚀 Deploy

Este projeto está pronto para deploy em produção com suporte a múltiplas plataformas.

### 🎯 Início Rápido

**Primeira vez fazendo deploy?** Comece aqui:

👉 **[DEPLOY_README.md](./DEPLOY_README.md)** - Deploy em 5 minutos no Render.com

### 📚 Documentação Completa

- **[DEPLOY_INDEX.md](./DEPLOY_INDEX.md)** - Índice de toda documentação de deploy
- **[DEPLOY_README.md](./DEPLOY_README.md)** - Guia rápido (5 minutos)
- **[DEPLOY.md](./DEPLOY.md)** - Guia completo de deploy
- **[DEPLOY_PLATFORMS.md](./DEPLOY_PLATFORMS.md)** - Instruções por plataforma
- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - Checklist completo
- **[QUICK_COMMANDS.md](./QUICK_COMMANDS.md)** - Comandos úteis

### ⚡ Quick Start

```bash
# 1. Build para deploy
npm run build:deploy

# 2. Gerar JWT_SECRET
npm run generate:jwt

# 3. Seguir guia da plataforma escolhida
```

### 🌐 Plataformas Suportadas

- ✅ **Render.com** (Recomendado - mais fácil)
- ✅ **Railway.app** (Simples e rápido)
- ✅ **Heroku** (Tradicional)
- ✅ **AWS Elastic Beanstalk** (Escalável)

### 🏗️ Arquitetura de Deploy

O projeto usa uma arquitetura monolítica onde:
- Backend serve a API REST em `/api/*`
- Backend serve o frontend buildado em produção
- Migrações do banco são executadas automaticamente no start
- Um único processo gerencia toda a aplicação
- Procfile configurado para deploy automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Desenvolvimento

- **Backend**: Siga os padrões do ESLint configurado
- **Commits**: Use mensagens descritivas em português
- **Testes**: Adicione testes para novas funcionalidades
- **Documentação**: Mantenha a documentação atualizada

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Backend**: API REST completa com Node.js + Express
- **Frontend**: Interface web em desenvolvimento
- **Mobile**: Aplicativo mobile planejado

## 🔗 Links Úteis

- **API Documentation**: `/api-docs` (quando o servidor estiver rodando)
- **Backend README**: [./backend/README.md](./backend/README.md)
- **Especificações**: [./.kiro/specs/donation-system-api/](./kiro/specs/donation-system-api/)

---

**Status do Projeto**: 🟢 Backend completo | 🟡 Frontend em desenvolvimento

Para mais informações sobre o backend, consulte a [documentação específica](./backend/README.md).