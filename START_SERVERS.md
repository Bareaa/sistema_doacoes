# Como Iniciar o Sistema de Doações

## ✅ Servidores Ativos

Os servidores estão rodando e prontos para uso:

### 🔧 Backend API
- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Documentação API**: http://localhost:3000/api-docs
- **Porta**: 3000
- **Status**: ✅ Rodando
- **Banco de Dados**: PostgreSQL (Neon) - Conectado

### 🎨 Frontend (React + Tailwind CSS)
- **URL**: http://localhost:5173
- **Porta**: 5173
- **Status**: ✅ Rodando
- **Framework**: React 18 + TypeScript + Tailwind CSS

## 🚀 Acesso Rápido

1. **Abra o navegador** e acesse: http://localhost:5173
2. A aplicação frontend está conectada ao backend automaticamente
3. Você pode criar uma conta, fazer login e testar todas as funcionalidades

## 📋 Funcionalidades Disponíveis

- ✅ Registro e login de usuários
- ✅ Listagem de campanhas
- ✅ Criação de campanhas
- ✅ Fazer doações
- ✅ Comentários em campanhas
- ✅ Dashboard do usuário
- ✅ Edição de perfil

## 🔄 Comandos Úteis

### Parar os Servidores
Os servidores estão rodando em background. Para pará-los, use Kiro ou:

```bash
# Backend
cd backend
# Pressione Ctrl+C no terminal do backend

# Frontend
cd frontend
# Pressione Ctrl+C no terminal do frontend
```

### Reiniciar os Servidores

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Ver Logs em Tempo Real

Os logs estão sendo exibidos nos terminais de cada servidor.

## 🗄️ Banco de Dados

O backend está conectado ao banco de dados PostgreSQL (Neon):
- **Status**: ✅ Conectado
- **Database**: neondb
- **Tipo**: PostgreSQL

## 🧪 Testar a API Diretamente

Você pode testar os endpoints da API usando:

### Health Check
```bash
curl http://localhost:3000/health
```

### Listar Campanhas
```bash
curl http://localhost:3000/api/campanhas
```

### Documentação Interativa
Acesse: http://localhost:3000/api-docs

## 🐛 Troubleshooting

### Porta já em uso

Se a porta 3000 ou 5173 já estiver em uso:

**Backend (porta 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Frontend (porta 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Erro de conexão com o banco

Verifique se o arquivo `backend/.env` está configurado corretamente com a `DATABASE_URL`.

### Frontend não conecta ao backend

Verifique se o arquivo `frontend/.env` tem:
```
VITE_API_URL=http://localhost:3000/api
```

## 📚 Documentação Adicional

- **Frontend**: [frontend/README.md](frontend/README.md)
- **Backend**: [backend/README.md](backend/README.md)
- **Deployment**: [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md)
- **Troubleshooting**: [frontend/TROUBLESHOOTING.md](frontend/TROUBLESHOOTING.md)
- **User Guide**: [frontend/USER_GUIDE.md](frontend/USER_GUIDE.md)

## 🎉 Pronto para Usar!

Acesse http://localhost:5173 e comece a usar o Sistema de Doações!

---

**Última atualização**: 07/11/2024
