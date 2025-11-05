# API Examples - Sistema de Doações API

This document provides comprehensive examples of how to use the Sistema de Doações API endpoints with real request/response examples.

## 🔗 Base URLs

- **Development**: `http://localhost:3000`
- **Production**: `https://your-deployment-url.render.com`
- **API Documentation**: `/api-docs`

## 🔐 Authentication Flow

### Register New User

**Endpoint**: `POST /api/auth/register`

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "senha": "MinhaSenh@123"
  }'
```

**Response** (201 Created):
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "createdAt": "2024-11-05T10:30:00.000Z"
  }
}
```

**Password Requirements**:
- Minimum 6 characters
- At least one lowercase letter
- At least one uppercase letter  
- At least one number

### User Login

**Endpoint**: `POST /api/auth/login`

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "senha": "MinhaSenh@123"
  }'
```

**Response** (200 OK):
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk5MjAwMDAwLCJleHAiOjE2OTkyMjg4MDB9.signature",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z"
  }
}
```

## 🏷️ Category Management

### List All Categories (Public)

**Endpoint**: `GET /api/categorias`

**Request**:
```bash
curl -X GET http://localhost:3000/api/categorias
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "nome": "Saúde",
    "descricao": "Campanhas relacionadas à saúde e bem-estar",
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z"
  },
  {
    "id": 2,
    "nome": "Educação",
    "descricao": "Campanhas para apoio educacional e escolar",
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z"
  }
]
```

### Create New Category (Auth Required)

**Endpoint**: `POST /api/categorias`

**Request**:
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nome": "Meio Ambiente",
    "descricao": "Campanhas para preservação ambiental e sustentabilidade"
  }'
```

**Response** (201 Created):
```json
{
  "message": "Categoria criada com sucesso",
  "categoria": {
    "id": 3,
    "nome": "Meio Ambiente",
    "descricao": "Campanhas para preservação ambiental e sustentabilidade",
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z"
  }
}
```

### Get Category by ID (Public)

**Endpoint**: `GET /api/categorias/:id`

**Request**:
```bash
curl -X GET http://localhost:3000/api/categorias/1
```

**Response** (200 OK):
```json
{
  "id": 1,
  "nome": "Saúde",
  "descricao": "Campanhas relacionadas à saúde e bem-estar",
  "createdAt": "2024-11-05T10:30:00.000Z",
  "updatedAt": "2024-11-05T10:30:00.000Z"
}
```

## 📋 Campaign Management

### List Campaigns with Filters (Public)

**Endpoint**: `GET /api/campanhas`

**Query Parameters**:
- `categoria_id`: Filter by category ID
- `status`: Filter by status (ativa, concluida, cancelada)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Request**:
```bash
# List all active campaigns
curl -X GET "http://localhost:3000/api/campanhas?status=ativa"

# List campaigns by category
curl -X GET "http://localhost:3000/api/campanhas?categoria_id=1"

# Paginated results
curl -X GET "http://localhost:3000/api/campanhas?page=1&limit=5"
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "titulo": "Ajude a construir um hospital infantil",
      "descricao": "Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil na região.",
      "meta_arrecadacao": "50000.00",
      "valor_atual": "15000.00",
      "data_limite": "2024-12-31",
      "status": "ativa",
      "usuario_id": 1,
      "categoria_id": 1,
      "createdAt": "2024-11-05T10:30:00.000Z",
      "updatedAt": "2024-11-05T10:30:00.000Z",
      "usuario": {
        "id": 1,
        "nome": "João Silva",
        "email": "joao.silva@email.com"
      },
      "categoria": {
        "id": 1,
        "nome": "Saúde",
        "descricao": "Campanhas relacionadas à saúde e bem-estar"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Create New Campaign (Auth Required)

**Endpoint**: `POST /api/campanhas`

**Request**:
```bash
curl -X POST http://localhost:3000/api/campanhas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "titulo": "Reforma da escola comunitária",
    "descricao": "Precisamos reformar nossa escola comunitária para oferecer melhor educação às crianças da região.",
    "meta_arrecadacao": 25000.00,
    "data_limite": "2024-12-31",
    "categoria_id": 2
  }'
```

**Response** (201 Created):
```json
{
  "message": "Campanha criada com sucesso",
  "campanha": {
    "id": 2,
    "titulo": "Reforma da escola comunitária",
    "descricao": "Precisamos reformar nossa escola comunitária para oferecer melhor educação às crianças da região.",
    "meta_arrecadacao": "25000.00",
    "valor_atual": "0.00",
    "data_limite": "2024-12-31",
    "status": "ativa",
    "usuario_id": 1,
    "categoria_id": 2,
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z"
  }
}
```

### Get Campaign Details (Public)

**Endpoint**: `GET /api/campanhas/:id`

**Request**:
```bash
curl -X GET http://localhost:3000/api/campanhas/1
```

**Response** (200 OK):
```json
{
  "id": 1,
  "titulo": "Ajude a construir um hospital infantil",
  "descricao": "Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil na região.",
  "meta_arrecadacao": "50000.00",
  "valor_atual": "15000.00",
  "data_limite": "2024-12-31",
  "status": "ativa",
  "usuario_id": 1,
  "categoria_id": 1,
  "createdAt": "2024-11-05T10:30:00.000Z",
  "updatedAt": "2024-11-05T10:30:00.000Z",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@email.com"
  },
  "categoria": {
    "id": 1,
    "nome": "Saúde",
    "descricao": "Campanhas relacionadas à saúde e bem-estar"
  }
}
```

### Update Campaign (Auth Required - Owner Only)

**Endpoint**: `PUT /api/campanhas/:id`

**Request**:
```bash
curl -X PUT http://localhost:3000/api/campanhas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "titulo": "Ajude a construir um hospital infantil - URGENTE",
    "descricao": "Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil na região. Precisamos da sua ajuda urgentemente!",
    "meta_arrecadacao": 60000.00
  }'
```

**Response** (200 OK):
```json
{
  "message": "Campanha atualizada com sucesso",
  "campanha": {
    "id": 1,
    "titulo": "Ajude a construir um hospital infantil - URGENTE",
    "descricao": "Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil na região. Precisamos da sua ajuda urgentemente!",
    "meta_arrecadacao": "60000.00",
    "valor_atual": "15000.00",
    "data_limite": "2024-12-31",
    "status": "ativa",
    "usuario_id": 1,
    "categoria_id": 1,
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:35:00.000Z"
  }
}
```

## 💰 Donation Management

### Make Donation (Auth Required)

**Endpoint**: `POST /api/campanhas/:id/doacoes`

**Request**:
```bash
curl -X POST http://localhost:3000/api/campanhas/1/doacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "valor": 100.00,
    "mensagem_apoio": "Espero que esta doação ajude muitas crianças! Parabéns pela iniciativa."
  }'
```

**Response** (201 Created):
```json
{
  "message": "Doação realizada com sucesso",
  "doacao": {
    "id": 1,
    "valor": "100.00",
    "data": "2024-11-05T10:30:00.000Z",
    "mensagem_apoio": "Espero que esta doação ajude muitas crianças! Parabéns pela iniciativa.",
    "usuario_id": 1,
    "campanha_id": 1,
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z"
  },
  "campanha_atualizada": {
    "id": 1,
    "valor_atual": "15100.00",
    "meta_arrecadacao": "50000.00"
  }
}
```

### List Campaign Donations (Public)

**Endpoint**: `GET /api/campanhas/:id/doacoes`

**Request**:
```bash
curl -X GET http://localhost:3000/api/campanhas/1/doacoes
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "valor": "100.00",
    "data": "2024-11-05T10:30:00.000Z",
    "mensagem_apoio": "Espero que esta doação ajude muitas crianças! Parabéns pela iniciativa.",
    "usuario_id": 1,
    "campanha_id": 1,
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z",
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao.silva@email.com"
    }
  }
]
```

### Get Donation Details (Auth Required - Owner Only)

**Endpoint**: `GET /api/doacoes/:id`

**Request**:
```bash
curl -X GET http://localhost:3000/api/doacoes/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "valor": "100.00",
  "data": "2024-11-05T10:30:00.000Z",
  "mensagem_apoio": "Espero que esta doação ajude muitas crianças! Parabéns pela iniciativa.",
  "usuario_id": 1,
  "campanha_id": 1,
  "createdAt": "2024-11-05T10:30:00.000Z",
  "updatedAt": "2024-11-05T10:30:00.000Z",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@email.com"
  },
  "campanha": {
    "id": 1,
    "titulo": "Ajude a construir um hospital infantil",
    "status": "ativa"
  }
}
```

## 💬 Comment System

### Add Comment to Campaign (Auth Required)

**Endpoint**: `POST /api/campanhas/:id/comentarios`

**Request**:
```bash
curl -X POST http://localhost:3000/api/campanhas/1/comentarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "texto": "Excelente iniciativa! Parabéns pelo projeto. Vou divulgar para meus amigos também."
  }'
```

**Response** (201 Created):
```json
{
  "message": "Comentário adicionado com sucesso",
  "comentario": {
    "id": 1,
    "texto": "Excelente iniciativa! Parabéns pelo projeto. Vou divulgar para meus amigos também.",
    "data": "2024-11-05T10:30:00.000Z",
    "usuario_id": 1,
    "campanha_id": 1,
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z"
  }
}
```

### List Campaign Comments (Public)

**Endpoint**: `GET /api/campanhas/:id/comentarios`

**Request**:
```bash
curl -X GET http://localhost:3000/api/campanhas/1/comentarios
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "texto": "Excelente iniciativa! Parabéns pelo projeto. Vou divulgar para meus amigos também.",
    "data": "2024-11-05T10:30:00.000Z",
    "usuario_id": 1,
    "campanha_id": 1,
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:30:00.000Z",
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao.silva@email.com"
    }
  }
]
```

### Update Comment (Auth Required - Owner Only)

**Endpoint**: `PUT /api/comentarios/:id`

**Request**:
```bash
curl -X PUT http://localhost:3000/api/comentarios/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "texto": "Excelente iniciativa! Parabéns pelo projeto. Já divulguei para meus amigos e família."
  }'
```

**Response** (200 OK):
```json
{
  "message": "Comentário atualizado com sucesso",
  "comentario": {
    "id": 1,
    "texto": "Excelente iniciativa! Parabéns pelo projeto. Já divulguei para meus amigos e família.",
    "data": "2024-11-05T10:30:00.000Z",
    "usuario_id": 1,
    "campanha_id": 1,
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2024-11-05T10:35:00.000Z"
  }
}
```

### Delete Comment (Auth Required - Owner Only)

**Endpoint**: `DELETE /api/comentarios/:id`

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/comentarios/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "message": "Comentário removido com sucesso"
}
```

## 🔍 Health Check

### API Health Status

**Endpoint**: `GET /health`

**Request**:
```bash
curl -X GET http://localhost:3000/health
```

**Response** (200 OK):
```json
{
  "message": "Sistema de Doações API está funcionando",
  "timestamp": "2024-11-05T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

## 🚨 Error Responses

### Validation Error (400)
```json
{
  "message": "Dados de entrada inválidos",
  "errors": [
    {
      "field": "email",
      "message": "Email deve ser válido"
    },
    {
      "field": "senha",
      "message": "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número"
    }
  ],
  "requestId": "req_123456789"
}
```

### Unauthorized Error (401)
```json
{
  "message": "Token de acesso requerido",
  "requestId": "req_123456789"
}
```

### Forbidden Error (403)
```json
{
  "message": "Acesso negado",
  "requestId": "req_123456789"
}
```

### Not Found Error (404)
```json
{
  "message": "Recurso não encontrado",
  "requestId": "req_123456789"
}
```

### Conflict Error (409)
```json
{
  "message": "Email já está em uso",
  "requestId": "req_123456789"
}
```

### Internal Server Error (500)
```json
{
  "message": "Erro interno do servidor",
  "requestId": "req_123456789"
}
```

## 🔧 JavaScript/Node.js Examples

### Complete Authentication Flow
```javascript
const API_BASE_URL = 'http://localhost:3000';

class DoacaoAPIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  async register(userData) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  }

  async login(credentials) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    this.token = response.token;
    return response;
  }

  async getCategorias() {
    return this.request('/api/categorias');
  }

  async createCategoria(categoria) {
    return this.request('/api/categorias', {
      method: 'POST',
      body: JSON.stringify(categoria)
    });
  }

  async getCampanhas(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = `/api/campanhas${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async createCampanha(campanha) {
    return this.request('/api/campanhas', {
      method: 'POST',
      body: JSON.stringify(campanha)
    });
  }

  async makeDonation(campanhaId, doacao) {
    return this.request(`/api/campanhas/${campanhaId}/doacoes`, {
      method: 'POST',
      body: JSON.stringify(doacao)
    });
  }

  async addComment(campanhaId, comentario) {
    return this.request(`/api/campanhas/${campanhaId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify(comentario)
    });
  }
}

// Usage example
async function example() {
  const client = new DoacaoAPIClient();

  try {
    // Register new user
    await client.register({
      nome: 'Maria Santos',
      email: 'maria@example.com',
      senha: 'MinhaSenh@123'
    });

    // Login
    await client.login({
      email: 'maria@example.com',
      senha: 'MinhaSenh@123'
    });

    // Get categories
    const categorias = await client.getCategorias();
    console.log('Categories:', categorias);

    // Create campaign
    const campanha = await client.createCampanha({
      titulo: 'Ajuda para animais abandonados',
      descricao: 'Campanha para ajudar animais abandonados na região',
      meta_arrecadacao: 10000.00,
      data_limite: '2024-12-31',
      categoria_id: 1
    });

    // Make donation
    await client.makeDonation(campanha.campanha.id, {
      valor: 50.00,
      mensagem_apoio: 'Amo animais! Espero ajudar.'
    });

    // Add comment
    await client.addComment(campanha.campanha.id, {
      texto: 'Que iniciativa linda! Parabéns!'
    });

  } catch (error) {
    console.error('API Error:', error.message);
  }
}
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

function useDoacaoAPI() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const api = async (endpoint, options = {}) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  };

  const login = async (credentials) => {
    const response = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    setToken(response.token);
    setUser(response.usuario);
    localStorage.setItem('token', response.token);
    
    return response;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return {
    token,
    user,
    login,
    logout,
    api
  };
}

// Usage in component
function CampaignList() {
  const { api } = useDoacaoAPI();
  const [campanhas, setCampanhas] = useState([]);

  useEffect(() => {
    api('/api/campanhas')
      .then(setCampanhas)
      .catch(console.error);
  }, []);

  return (
    <div>
      {campanhas.data?.map(campanha => (
        <div key={campanha.id}>
          <h3>{campanha.titulo}</h3>
          <p>{campanha.descricao}</p>
          <p>Meta: R$ {campanha.meta_arrecadacao}</p>
          <p>Arrecadado: R$ {campanha.valor_atual}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📱 Mobile App Examples (React Native)

```javascript
// API service for React Native
class MobileDoacaoAPI {
  constructor() {
    this.baseURL = 'https://your-api-url.com';
    this.token = null;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async login(email, senha) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
    
    this.token = response.token;
    return response;
  }

  async getCampanhas(filters = {}) {
    const queryString = Object.keys(filters)
      .map(key => `${key}=${encodeURIComponent(filters[key])}`)
      .join('&');
    
    return this.request(`/api/campanhas${queryString ? `?${queryString}` : ''}`);
  }
}

// Usage in React Native component
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const api = new MobileDoacaoAPI();

function CampaignScreen() {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampanhas();
  }, []);

  const loadCampanhas = async () => {
    try {
      const response = await api.getCampanhas({ status: 'ativa' });
      setCampanhas(response.data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCampanha = ({ item }) => (
    <TouchableOpacity style={styles.campaignCard}>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.description}>{item.descricao}</Text>
      <Text style={styles.goal}>
        Meta: R$ {parseFloat(item.meta_arrecadacao).toFixed(2)}
      </Text>
      <Text style={styles.current}>
        Arrecadado: R$ {parseFloat(item.valor_atual).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Text>Carregando campanhas...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={campanhas}
        renderItem={renderCampanha}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}
```

## 🧪 Testing Examples

### Unit Test Example (Jest)
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'TestPassword123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('senha');
    });

    it('should return validation error for invalid password', async () => {
      const userData = {
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'weak'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Dados de entrada inválidos');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'senha',
            message: expect.stringContaining('Senha deve conter')
          })
        ])
      );
    });
  });
});
```

---

**📚 Additional Resources**

- **Interactive Documentation**: Visit `/api-docs` on your running server
- **Postman Collection**: Import the OpenAPI spec into Postman for easy testing
- **Environment Variables**: See `ENVIRONMENT.md` for configuration details
- **Deployment Guide**: See `DEPLOYMENT.md` for production setup

**🆘 Need Help?**

If you encounter any issues with these examples, check:
1. Server is running on the correct port
2. Database is connected and migrations are applied
3. JWT token is valid and not expired
4. Request headers and body format are correct
5. User has proper permissions for protected endpoints