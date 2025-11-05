# Design Document - Sistema de Doações API

## Overview

The Sistema de Doações API is a Node.js/Express REST API that provides a complete donation management platform. The system uses PostgreSQL (NeonDB) for data persistence, Sequelize ORM for database operations, JWT for authentication, and follows RESTful principles with comprehensive validation, error handling, and documentation.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    Client[Client Applications] --> API[Express API Server]
    API --> Auth[JWT Authentication]
    API --> Valid[Input Validation]
    API --> Ctrl[Controllers]
    Ctrl --> Svc[Business Logic]
    Svc --> ORM[Sequelize ORM]
    ORM --> DB[(NeonDB PostgreSQL)]
    API --> Docs[Swagger Documentation]
    API --> Tests[Jest Test Suite]
```

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (NeonDB Cloud)
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Testing**: Jest + Supertest
- **Deployment**: Render

### Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js             # Server startup
├── config/
│   ├── swaggerConfig.js  # Swagger documentation setup
│   └── database.js       # Database configuration
├── controllers/          # Request/response handling
│   ├── authController.js
│   ├── usuarioController.js
│   ├── categoriaController.js
│   ├── campanhaController.js
│   ├── doacaoController.js
│   └── comentarioController.js
├── middlewares/          # Custom middleware functions
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── loggingMiddleware.js
│   ├── requestIdMiddleware.js
│   └── validationMiddleware.js
├── models/              # Sequelize models (auto-generated)
├── routes/              # Route definitions
│   ├── authRoutes.js
│   ├── usuarioRoutes.js
│   ├── categoriaRoutes.js
│   ├── campanhaRoutes.js
│   ├── doacaoRoutes.js
│   └── comentarioRoutes.js
├── validators/          # Input validation schemas
│   ├── authValidator.js
│   ├── usuarioValidator.js
│   ├── categoriaValidator.js
│   ├── campanhaValidator.js
│   ├── doacaoValidator.js
│   └── comentarioValidator.js
├── utils/              # Utility functions
│   └── validators.js   # Business logic validators
└── tests/              # Test suites
    ├── unit/           # Unit tests
    └── integration/    # Integration tests
```

## Components and Interfaces

### Database Models and Relationships

#### Entity Relationship Diagram

```mermaid
erDiagram
    Usuario ||--o{ Campanha : creates
    Usuario ||--o{ Doacao : makes
    Usuario ||--o{ Comentario : writes
    Categoria ||--o{ Campanha : categorizes
    Campanha ||--o{ Doacao : receives
    Campanha ||--o{ Comentario : has

    Usuario {
        int id PK
        string nome
        string email UK
        string senha_hash
        timestamp createdAt
        timestamp updatedAt
    }

    Categoria {
        int id PK
        string nome UK
        string descricao
        timestamp createdAt
        timestamp updatedAt
    }

    Campanha {
        int id PK
        string titulo
        text descricao
        decimal meta_arrecadacao
        decimal valor_atual
        date data_limite
        string status
        int usuario_id FK
        int categoria_id FK
        timestamp createdAt
        timestamp updatedAt
    }

    Doacao {
        int id PK
        decimal valor
        date data
        string mensagem_apoio
        int usuario_id FK
        int campanha_id FK
        timestamp createdAt
        timestamp updatedAt
    }

    Comentario {
        int id PK
        string texto
        date data
        int usuario_id FK
        int campanha_id FK
        timestamp createdAt
        timestamp updatedAt
    }
```

### API Endpoints Design

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

#### Resource Endpoints (RESTful)
- `GET /api/usuarios` - List users (protected)
- `GET /api/usuarios/:id` - Get user by ID (protected)
- `PUT /api/usuarios/:id` - Update user (protected, own profile only)

- `GET /api/categorias` - List categories (public)
- `POST /api/categorias` - Create category (protected)
- `GET /api/categorias/:id` - Get category by ID (public)
- `PUT /api/categorias/:id` - Update category (protected)
- `DELETE /api/categorias/:id` - Delete category (protected)

- `GET /api/campanhas` - List campaigns with filters (public)
- `POST /api/campanhas` - Create campaign (protected)
- `GET /api/campanhas/:id` - Get campaign details (public)
- `PUT /api/campanhas/:id` - Update campaign (protected, owner only)
- `DELETE /api/campanhas/:id` - Delete campaign (protected, owner only)

- `GET /api/campanhas/:id/doacoes` - List campaign donations (public)
- `POST /api/campanhas/:id/doacoes` - Make donation (protected)
- `GET /api/doacoes/:id` - Get donation details (protected, owner only)

- `GET /api/campanhas/:id/comentarios` - List campaign comments (public)
- `POST /api/campanhas/:id/comentarios` - Add comment (protected)
- `PUT /api/comentarios/:id` - Update comment (protected, owner only)
- `DELETE /api/comentarios/:id` - Delete comment (protected, owner only)

### Middleware Pipeline

#### Request Processing Flow

```mermaid
sequenceDiagram
    participant Client
    participant Express
    participant Logging
    participant RequestId
    participant Auth
    participant Validation
    participant Controller
    participant ErrorHandler

    Client->>Express: HTTP Request
    Express->>Logging: Log request
    Logging->>RequestId: Add unique ID
    RequestId->>Auth: Check JWT (if protected)
    Auth->>Validation: Validate input
    Validation->>Controller: Process request
    Controller-->>ErrorHandler: Handle errors
    ErrorHandler->>Client: Response
```

#### Middleware Functions

1. **express.json()** - Parse JSON request bodies
2. **loggingMiddleware** - Log all requests with timestamp
3. **requestIdMiddleware** - Assign unique ID to each request
4. **authMiddleware** - Verify JWT tokens for protected routes
5. **validationMiddleware** - Validate request data using express-validator
6. **errorMiddleware** - Centralized error handling (must be last)

## Data Models

### Sequelize Model Definitions

#### Usuario Model
```javascript
{
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: STRING, allowNull: false },
  email: { type: STRING, allowNull: false, unique: true },
  senha_hash: { type: STRING, allowNull: false }
}
```

#### Categoria Model
```javascript
{
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: STRING, allowNull: false, unique: true },
  descricao: { type: STRING, allowNull: false }
}
```

#### Campanha Model
```javascript
{
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: STRING, allowNull: false },
  descricao: { type: TEXT, allowNull: false },
  meta_arrecadacao: { type: DECIMAL(10,2), allowNull: false },
  valor_atual: { type: DECIMAL(10,2), defaultValue: 0 },
  data_limite: { type: DATE, allowNull: false },
  status: { type: ENUM('ativa', 'concluida', 'cancelada'), defaultValue: 'ativa' },
  usuario_id: { type: INTEGER, references: { model: 'Usuario', key: 'id' } },
  categoria_id: { type: INTEGER, references: { model: 'Categoria', key: 'id' } }
}
```

#### Doacao Model
```javascript
{
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  valor: { type: DECIMAL(10,2), allowNull: false },
  data: { type: DATE, defaultValue: NOW },
  mensagem_apoio: { type: STRING, allowNull: true },
  usuario_id: { type: INTEGER, references: { model: 'Usuario', key: 'id' } },
  campanha_id: { type: INTEGER, references: { model: 'Campanha', key: 'id' } }
}
```

#### Comentario Model
```javascript
{
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  texto: { type: STRING, allowNull: false },
  data: { type: DATE, defaultValue: NOW },
  usuario_id: { type: INTEGER, references: { model: 'Usuario', key: 'id' } },
  campanha_id: { type: INTEGER, references: { model: 'Campanha', key: 'id' } }
}
```

### Business Logic Rules

#### Campaign Status Management
- New campaigns start with status 'ativa'
- Status changes to 'concluida' when meta_arrecadacao is reached
- Status can be manually set to 'cancelada' by campaign owner
- Donations are only allowed for 'ativa' campaigns

#### Donation Processing
- Each donation updates the campaign's valor_atual
- Donation amounts must be positive decimal values
- Donation date is automatically set to current timestamp
- Optional support message can be included

## Error Handling

### Error Response Format

```javascript
{
  "message": "Human-readable error description",
  "errors": [
    {
      "field": "campo_com_erro",
      "message": "Specific field error message"
    }
  ],
  "requestId": "unique-request-identifier"
}
```

### HTTP Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error (unexpected errors)

### Error Handling Strategy

1. **Validation Errors**: Caught by express-validator, return 400 with field details
2. **Authentication Errors**: JWT verification failures, return 401
3. **Authorization Errors**: Access to forbidden resources, return 403
4. **Database Errors**: Sequelize errors, log and return 500 with generic message
5. **Business Logic Errors**: Custom errors with appropriate status codes

## Testing Strategy

### Unit Testing

#### Test Coverage Areas
- **Utility Functions**: Date validation, password hashing
- **Business Logic**: Campaign status updates, donation calculations
- **Validation Functions**: Input sanitization and validation rules

#### Example Unit Test Structure
```javascript
describe('Campaign Validation', () => {
  describe('isDataValida', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date(Date.now() + 86400000);
      expect(isDataValida(futureDate)).toBe(true);
    });
    
    it('should return false for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isDataValida(pastDate)).toBe(false);
    });
  });
});
```

### Integration Testing

#### Test Database Setup
- Use separate test database or in-memory SQLite
- Reset database state before each test suite
- Use Sequelize sync with force: true for clean state

#### API Endpoint Testing
```javascript
describe('Categoria API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  describe('POST /api/categorias', () => {
    it('should create a new category', async () => {
      const response = await request(app)
        .post('/api/categorias')
        .send({ nome: 'Saúde', descricao: 'Campanhas de saúde' });
      
      expect(response.status).toBe(201);
      expect(response.body.nome).toBe('Saúde');
    });
  });
});
```

### Authentication Testing
- Test JWT token generation and validation
- Test protected route access with and without tokens
- Test token expiration handling
- Test password hashing and verification

### End-to-End Workflow Testing
- Complete user registration and login flow
- Campaign creation, donation, and comment workflow
- Error scenarios and edge cases

## Security Considerations

### Authentication & Authorization
- JWT tokens with 8-hour expiration
- bcrypt password hashing with salt rounds = 10
- Route-level protection for sensitive operations
- User ownership validation for resource modifications

### Input Validation
- express-validator for all input sanitization
- SQL injection prevention through Sequelize ORM
- XSS prevention through input encoding
- File upload restrictions (if implemented later)

### Environment Security
- Environment variables for sensitive configuration
- Database connection with SSL for NeonDB
- CORS configuration for production deployment
- Rate limiting (can be added as additional middleware)

## Deployment Architecture

### Cloud Infrastructure

```mermaid
graph TB
    Internet[Internet] --> Render[Render Web Service]
    Render --> App[Node.js Application]
    App --> NeonDB[(NeonDB PostgreSQL)]
    
    subgraph "Render Environment"
        App
        Env[Environment Variables]
        Logs[Application Logs]
    end
    
    subgraph "NeonDB Cloud"
        NeonDB
        SSL[SSL Connection]
    end
```

### Deployment Configuration

#### Environment Variables
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@host/db?sslmode=require
JWT_SECRET=strong-secret-key
```

#### Build and Start Commands
- **Build Command**: `npm install`
- **Start Command**: `npx sequelize-cli db:migrate && node src/server.js`

#### Database Migration Strategy
- Automatic migration execution on deployment
- Version-controlled migration files
- Rollback capability through Sequelize CLI

### Monitoring and Logging
- Request logging through custom middleware
- Error logging with stack traces
- Unique request ID tracking
- Performance monitoring through Render dashboard