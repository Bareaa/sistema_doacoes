const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Doações API',
      version: '1.0.0',
      description: 'REST API for donation system with campaign management, user authentication, and donation processing',
      contact: {
        name: 'API Support',
        email: 'support@sistema-doacoes.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: process.env.PRODUCTION_URL || 'https://your-deployment-url.render.com',
        description: 'Production server (Render)'
      },
      {
        url: 'https://sistema-doacoes-api.onrender.com',
        description: 'Demo server (replace with your actual deployment URL)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication. Format: Bearer <token>'
        }
      },
      schemas: {
        // Usuario schemas
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the user',
              example: 1
            },
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'User full name',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'joao.silva@email.com'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          },
          required: ['id', 'nome', 'email', 'createdAt', 'updatedAt']
        },
        UsuarioInput: {
          type: 'object',
          properties: {
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'User full name',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'joao.silva@email.com'
            },
            senha: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)',
              example: 'minhasenha123'
            }
          },
          required: ['nome', 'email', 'senha']
        },
        LoginInput: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'joao.silva@email.com'
            },
            senha: {
              type: 'string',
              description: 'User password',
              example: 'minhasenha123'
            }
          },
          required: ['email', 'senha']
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Login realizado com sucesso'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            }
          },
          required: ['message', 'token', 'usuario']
        },

        // Categoria schemas
        Categoria: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the category',
              example: 1
            },
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Category name',
              example: 'Saúde'
            },
            descricao: {
              type: 'string',
              minLength: 5,
              maxLength: 255,
              description: 'Category description',
              example: 'Campanhas relacionadas à saúde e bem-estar'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Category creation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Category last update timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          },
          required: ['id', 'nome', 'descricao', 'createdAt', 'updatedAt']
        },
        CategoriaInput: {
          type: 'object',
          properties: {
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Category name',
              example: 'Saúde'
            },
            descricao: {
              type: 'string',
              minLength: 5,
              maxLength: 255,
              description: 'Category description',
              example: 'Campanhas relacionadas à saúde e bem-estar'
            }
          },
          required: ['nome', 'descricao']
        },

        // Campanha schemas
        Campanha: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the campaign',
              example: 1
            },
            titulo: {
              type: 'string',
              minLength: 5,
              maxLength: 100,
              description: 'Campaign title',
              example: 'Ajude a construir um hospital infantil'
            },
            descricao: {
              type: 'string',
              minLength: 10,
              maxLength: 1000,
              description: 'Campaign description',
              example: 'Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil na região.'
            },
            meta_arrecadacao: {
              type: 'number',
              format: 'decimal',
              minimum: 0.01,
              description: 'Campaign fundraising goal in BRL',
              example: 50000.00
            },
            valor_atual: {
              type: 'number',
              format: 'decimal',
              minimum: 0,
              description: 'Current amount raised in BRL',
              example: 15000.00
            },
            data_limite: {
              type: 'string',
              format: 'date',
              description: 'Campaign deadline',
              example: '2024-12-31'
            },
            status: {
              type: 'string',
              enum: ['ativa', 'concluida', 'cancelada'],
              description: 'Campaign status',
              example: 'ativa'
            },
            usuario_id: {
              type: 'integer',
              description: 'ID of the user who created the campaign',
              example: 1
            },
            categoria_id: {
              type: 'integer',
              description: 'ID of the campaign category',
              example: 1
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            },
            categoria: {
              $ref: '#/components/schemas/Categoria'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Campaign creation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Campaign last update timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          },
          required: ['id', 'titulo', 'descricao', 'meta_arrecadacao', 'valor_atual', 'data_limite', 'status', 'usuario_id', 'categoria_id', 'createdAt', 'updatedAt']
        },
        CampanhaInput: {
          type: 'object',
          properties: {
            titulo: {
              type: 'string',
              minLength: 5,
              maxLength: 100,
              description: 'Campaign title',
              example: 'Ajude a construir um hospital infantil'
            },
            descricao: {
              type: 'string',
              minLength: 10,
              maxLength: 1000,
              description: 'Campaign description',
              example: 'Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil na região.'
            },
            meta_arrecadacao: {
              type: 'number',
              format: 'decimal',
              minimum: 0.01,
              description: 'Campaign fundraising goal in BRL',
              example: 50000.00
            },
            data_limite: {
              type: 'string',
              format: 'date',
              description: 'Campaign deadline (must be in the future)',
              example: '2024-12-31'
            },
            categoria_id: {
              type: 'integer',
              description: 'ID of the campaign category',
              example: 1
            }
          },
          required: ['titulo', 'descricao', 'meta_arrecadacao', 'data_limite', 'categoria_id']
        },

        // Doacao schemas
        Doacao: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the donation',
              example: 1
            },
            valor: {
              type: 'number',
              format: 'decimal',
              minimum: 0.01,
              description: 'Donation amount in BRL',
              example: 100.00
            },
            data: {
              type: 'string',
              format: 'date-time',
              description: 'Donation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            mensagem_apoio: {
              type: 'string',
              maxLength: 255,
              nullable: true,
              description: 'Optional support message from donor',
              example: 'Espero que esta doação ajude muitas crianças!'
            },
            usuario_id: {
              type: 'integer',
              description: 'ID of the user who made the donation',
              example: 1
            },
            campanha_id: {
              type: 'integer',
              description: 'ID of the campaign receiving the donation',
              example: 1
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            },
            campanha: {
              $ref: '#/components/schemas/Campanha'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Donation creation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Donation last update timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          },
          required: ['id', 'valor', 'data', 'usuario_id', 'campanha_id', 'createdAt', 'updatedAt']
        },
        DoacaoInput: {
          type: 'object',
          properties: {
            valor: {
              type: 'number',
              format: 'decimal',
              minimum: 0.01,
              description: 'Donation amount in BRL',
              example: 100.00
            },
            mensagem_apoio: {
              type: 'string',
              maxLength: 255,
              description: 'Optional support message from donor',
              example: 'Espero que esta doação ajude muitas crianças!'
            }
          },
          required: ['valor']
        },

        // Comentario schemas
        Comentario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the comment',
              example: 1
            },
            texto: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
              description: 'Comment text',
              example: 'Excelente iniciativa! Parabéns pelo projeto.'
            },
            data: {
              type: 'string',
              format: 'date-time',
              description: 'Comment timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            usuario_id: {
              type: 'integer',
              description: 'ID of the user who made the comment',
              example: 1
            },
            campanha_id: {
              type: 'integer',
              description: 'ID of the campaign being commented on',
              example: 1
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Comment creation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Comment last update timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          },
          required: ['id', 'texto', 'data', 'usuario_id', 'campanha_id', 'createdAt', 'updatedAt']
        },
        ComentarioInput: {
          type: 'object',
          properties: {
            texto: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
              description: 'Comment text',
              example: 'Excelente iniciativa! Parabéns pelo projeto.'
            }
          },
          required: ['texto']
        },

        // Common response schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operação realizada com sucesso'
            },
            requestId: {
              type: 'string',
              description: 'Unique request identifier',
              example: 'req_123456789'
            }
          },
          required: ['message']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Erro de validação'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field with error',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    description: 'Field error message',
                    example: 'Email deve ser válido'
                  }
                }
              },
              description: 'Array of validation errors'
            },
            requestId: {
              type: 'string',
              description: 'Unique request identifier',
              example: 'req_123456789'
            }
          },
          required: ['message']
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {},
              description: 'Array of items'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  description: 'Items per page',
                  example: 10
                },
                total: {
                  type: 'integer',
                  description: 'Total number of items',
                  example: 50
                },
                totalPages: {
                  type: 'integer',
                  description: 'Total number of pages',
                  example: 5
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Token de acesso requerido',
                requestId: 'req_123456789'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Acesso negado',
                requestId: 'req_123456789'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Recurso não encontrado',
                requestId: 'req_123456789'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Erro de validação',
                errors: [
                  {
                    field: 'email',
                    message: 'Email deve ser válido'
                  }
                ],
                requestId: 'req_123456789'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Erro interno do servidor',
                requestId: 'req_123456789'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API files
};

const specs = swaggerJsdoc(options);

module.exports = specs;