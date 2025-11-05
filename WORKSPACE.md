# Workspace - Sistema de Doações

Este é um projeto monorepo que contém tanto o backend quanto o frontend do Sistema de Doações.

## 🏗️ Estrutura do Workspace

```
sistema-doacoes/
├── backend/                 # API REST em Node.js + Express
├── frontend/               # Interface web em React (em desenvolvimento)
├── .kiro/                  # Especificações e configurações do Kiro
├── package.json            # Scripts globais do workspace
├── .gitignore             # Arquivos ignorados pelo Git
└── README.md              # Documentação principal
```

## 🚀 Scripts Globais

Execute estes comandos na raiz do projeto:

### Desenvolvimento
```bash
# Instalar dependências de ambos os projetos
npm run install:all

# Executar backend e frontend simultaneamente
npm run dev

# Executar apenas o backend
npm run dev:backend

# Executar apenas o frontend (quando disponível)
npm run dev:frontend
```

### Instalação
```bash
# Instalar dependências do backend
npm run install:backend

# Instalar dependências do frontend
npm run install:frontend

# Instalar dependências de ambos
npm run install:all
```

### Build
```bash
# Build de ambos os projetos
npm run build

# Build apenas do backend
npm run build:backend

# Build apenas do frontend
npm run build:frontend
```

### Testes
```bash
# Executar testes de ambos os projetos
npm test

# Testes apenas do backend
npm run test:backend

# Testes apenas do frontend
npm run test:frontend
```

### Banco de Dados
```bash
# Executar migrações
npm run migrate

# Desfazer última migração
npm run migrate:undo

# Executar seeders
npm run seed

# Reset completo do banco
npm run db:reset
```

### Limpeza
```bash
# Limpar node_modules de ambos os projetos
npm run clean

# Limpar apenas backend
npm run clean:backend

# Limpar apenas frontend
npm run clean:frontend
```

## 🔧 Configuração do Ambiente

### 1. Configuração Inicial
```bash
# Clone o repositório
git clone <repository-url>
cd sistema-doacoes

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Configure as variáveis no arquivo .env
```

### 2. Backend
```bash
# Navegue para o backend
cd backend

# Copie o arquivo de exemplo
cp .env.example .env

# Configure as variáveis específicas do backend
# Instale as dependências
npm install

# Execute as migrações
npm run migrate

# Inicie o servidor de desenvolvimento
npm run dev
```

### 3. Frontend (Quando Disponível)
```bash
# Navegue para o frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🌐 URLs de Desenvolvimento

- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Frontend**: http://localhost:5173 (quando disponível)

## 📦 Dependências Compartilhadas

### Desenvolvimento
- **concurrently**: Para executar múltiplos comandos simultaneamente

## 🔄 Workflow de Desenvolvimento

### 1. Desenvolvimento Local
```bash
# Na raiz do projeto
npm run install:all
npm run dev
```

### 2. Testes
```bash
# Executar todos os testes
npm test

# Ou testar individualmente
npm run test:backend
npm run test:frontend
```

### 3. Build para Produção
```bash
# Build completo
npm run build

# Ou build individual
npm run build:backend
npm run build:frontend
```

## 🚀 Deploy

### Backend
- **Plataforma**: Render
- **Database**: NeonDB (PostgreSQL)
- **Documentação**: [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md)

### Frontend (Planejado)
- **Plataforma**: Vercel ou Netlify
- **Build**: Vite
- **Deploy automático**: Via Git integration

## 🤝 Contribuição

### Estrutura de Branches
- `main`: Branch principal (produção)
- `develop`: Branch de desenvolvimento
- `feature/*`: Features específicas
- `hotfix/*`: Correções urgentes

### Workflow
1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Faça suas alterações
4. Execute os testes: `npm test`
5. Commit: `git commit -m 'Adiciona nova feature'`
6. Push: `git push origin feature/nova-feature`
7. Abra um Pull Request

### Padrões de Código
- **Backend**: ESLint + Prettier
- **Frontend**: ESLint + Prettier (quando implementado)
- **Commits**: Conventional Commits
- **Testes**: Obrigatórios para novas features

## 📋 Checklist de Setup

### Backend ✅
- [x] Estrutura do projeto
- [x] Configuração do banco de dados
- [x] Autenticação JWT
- [x] CRUD completo
- [x] Testes unitários e integração
- [x] Documentação da API
- [x] Deploy configurado

### Frontend 🚧
- [ ] Estrutura do projeto
- [ ] Configuração do React
- [ ] Integração com API
- [ ] Componentes principais
- [ ] Autenticação
- [ ] Testes
- [ ] Deploy

## 🆘 Troubleshooting

### Problemas Comuns

#### Porta em uso
```bash
# Verificar processos na porta 3000
lsof -ti:3000

# Matar processo
kill -9 <PID>
```

#### Problemas de dependências
```bash
# Limpar e reinstalar
npm run clean
npm run install:all
```

#### Problemas de banco
```bash
# Reset do banco
npm run db:reset
```

## 📞 Suporte

- **Issues**: Use o sistema de issues do GitHub
- **Documentação**: Consulte os READMEs específicos
- **API**: Acesse `/api-docs` para documentação interativa

---

**Status**: Backend completo ✅ | Frontend em desenvolvimento 🚧