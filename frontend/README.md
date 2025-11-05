# Frontend - Sistema de Doações

Interface web para o Sistema de Doações desenvolvida em React.js.

## 🚧 Status: Em Desenvolvimento

O frontend está sendo planejado e será desenvolvido em breve.

## 🎯 Tecnologias Planejadas

- **Framework**: React.js 18+
- **Build Tool**: Vite
- **Styling**: CSS Modules ou Styled Components
- **State Management**: Context API ou Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router
- **UI Components**: Material-UI ou Ant Design
- **Forms**: React Hook Form
- **Testing**: Jest + React Testing Library

## 📋 Funcionalidades Planejadas

### 🔐 Autenticação
- [ ] Página de login
- [ ] Página de registro
- [ ] Recuperação de senha
- [ ] Perfil do usuário

### 🏠 Páginas Principais
- [ ] Home com campanhas em destaque
- [ ] Lista de campanhas com filtros
- [ ] Detalhes da campanha
- [ ] Dashboard do usuário

### 📋 Gerenciamento de Campanhas
- [ ] Criar nova campanha
- [ ] Editar campanha (proprietário)
- [ ] Visualizar estatísticas da campanha
- [ ] Gerenciar categorias

### 💰 Sistema de Doações
- [ ] Interface para fazer doações
- [ ] Histórico de doações
- [ ] Comprovantes de doação
- [ ] Integração com gateway de pagamento

### 💬 Interação Social
- [ ] Sistema de comentários
- [ ] Compartilhamento em redes sociais
- [ ] Avaliações e feedback

### 📱 Responsividade
- [ ] Design responsivo para mobile
- [ ] PWA (Progressive Web App)
- [ ] Modo offline básico

## 🏗️ Estrutura Planejada

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── common/         # Componentes comuns (Header, Footer, etc.)
│   │   ├── forms/          # Componentes de formulário
│   │   └── ui/             # Componentes de interface
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home/
│   │   ├── Auth/
│   │   ├── Campaigns/
│   │   ├── Profile/
│   │   └── Dashboard/
│   ├── hooks/              # Custom hooks
│   ├── services/           # Serviços de API
│   ├── utils/              # Utilitários
│   ├── styles/             # Estilos globais
│   ├── contexts/           # Context providers
│   ├── types/              # TypeScript types (se usar TS)
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🔗 Integração com Backend

O frontend consumirá a API REST desenvolvida no backend através dos seguintes endpoints:

- **Autenticação**: `/api/auth/*`
- **Campanhas**: `/api/campanhas/*`
- **Categorias**: `/api/categorias/*`
- **Doações**: `/api/doacoes/*`
- **Comentários**: `/api/comentarios/*`

## 🎨 Design System

### Cores Principais
- **Primary**: #007bff (Azul)
- **Secondary**: #28a745 (Verde)
- **Success**: #28a745 (Verde)
- **Warning**: #ffc107 (Amarelo)
- **Danger**: #dc3545 (Vermelho)
- **Info**: #17a2b8 (Azul claro)

### Tipografia
- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Poppins, sans-serif

## 🚀 Como Executar (Quando Disponível)

```bash
# Navegar para a pasta frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testes (Planejados)

- **Unit Tests**: Componentes individuais
- **Integration Tests**: Fluxos completos
- **E2E Tests**: Cypress para testes end-to-end

## 🔄 Estado da Aplicação

### Context Providers Planejados
- **AuthContext**: Gerenciamento de autenticação
- **CampaignContext**: Estado das campanhas
- **ThemeContext**: Tema da aplicação
- **NotificationContext**: Notificações e alertas

## 📦 Dependências Principais (Planejadas)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "react-hook-form": "^7.43.0",
    "@mui/material": "^5.11.0",
    "react-query": "^3.39.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "jest": "^29.4.0",
    "@testing-library/react": "^14.0.0",
    "cypress": "^12.6.0"
  }
}
```

## 🤝 Contribuição

Quando o desenvolvimento começar:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Siga os padrões de código estabelecidos
4. Adicione testes para novas funcionalidades
5. Submeta um Pull Request

## 📄 Licença

Este projeto segue a mesma licença MIT do projeto principal.

---

**🔗 Links Relacionados**

- [Backend API](../backend/README.md)
- [Documentação da API](../backend/API_EXAMPLES.md)
- [Especificações do Projeto](../.kiro/specs/donation-system-api/)

**📞 Contato**

Para sugestões sobre o frontend, abra uma issue no repositório principal.