# Sistema de Doações API

REST API for donation system with campaign management, user authentication, and donation processing.

## 🚀 Live Demo

**API Base URL**: `https://your-deployment-url.render.com`  
**API Documentation**: `https://your-deployment-url.render.com/api-docs`

## ✨ Features

- 🔐 User registration and authentication with JWT
- 📋 Campaign creation and management with categories
- 💰 Donation processing with real-time campaign updates
- 💬 Comment system for campaigns
- 🏷️ Category-based campaign organization
- 📚 Comprehensive API documentation with Swagger
- 🧪 Full test coverage with Jest
- 🔒 Input validation and security middleware
- 📊 Request logging and error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: PostgreSQL (NeonDB Cloud)
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Documentation**: Swagger (OpenAPI 3.0)
- **Testing**: Jest + Supertest
- **Deployment**: Render

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- PostgreSQL database (NeonDB recommended for cloud deployment)
- Git

## 🚀 Quick Start

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sistema-doacoes-api.git
   cd sistema-doacoes-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgres://username:password@localhost:5432/doacoes_db
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=8h
   ```

4. **Set up the database**
   ```bash
   # Run migrations to create tables
   npm run migrate
   
   # (Optional) Seed with sample data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the API**
   - API Base: `http://localhost:3000`
   - Documentation: `http://localhost:3000/api-docs`

### Production Deployment (Render)

1. **Prepare your repository**
   - Ensure all code is committed to your Git repository
   - Push to GitHub/GitLab

2. **Set up NeonDB (Database)**
   - Create account at [neon.tech](https://neon.tech)
   - Create a new PostgreSQL database
   - Copy the connection string

3. **Deploy to Render**
   - Create account at [render.com](https://render.com)
   - Create new Web Service
   - Connect your Git repository
   - Configure deployment settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm run deploy`
     - **Node Version**: 16 or higher

4. **Configure environment variables in Render**
   ```env
   NODE_ENV=production
   DATABASE_URL=your-neondb-connection-string
   JWT_SECRET=your-production-jwt-secret
   JWT_EXPIRES_IN=8h
   ```

5. **Deploy and verify**
   - Render will automatically deploy your application
   - Check logs for any deployment issues
   - Test API endpoints using the provided URL

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `PORT` | Server port | `3000` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | `8h` | No |

### Database URL Format
```
postgres://username:password@host:port/database?sslmode=require
```

For NeonDB, the URL typically looks like:
```
postgres://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Build for production (no-op for Node.js) |
| `npm run deploy` | Run migrations and start production server |
| `npm test` | Run complete test suite |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:ci` | Run tests for CI/CD with coverage |
| `npm run migrate` | Run database migrations |
| `npm run migrate:status` | Check migration status |
| `npm run migrate:undo` | Undo last migration |
| `npm run seed` | Seed database with sample data |
| `npm run db:reset` | Reset database (undo migrations, migrate, seed) |
| `npm run health` | Health check endpoint test |

## 📚 API Documentation

### Interactive Documentation
Visit `/api-docs` endpoint for Swagger UI with interactive API testing.

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### Categories
- `GET /api/categorias` - List all categories (public)
- `POST /api/categorias` - Create category (auth required)
- `GET /api/categorias/:id` - Get category by ID (public)
- `PUT /api/categorias/:id` - Update category (auth required)
- `DELETE /api/categorias/:id` - Delete category (auth required)

#### Campaigns
- `GET /api/campanhas` - List campaigns with filters (public)
- `POST /api/campanhas` - Create campaign (auth required)
- `GET /api/campanhas/:id` - Get campaign details (public)
- `PUT /api/campanhas/:id` - Update campaign (auth required, owner only)
- `DELETE /api/campanhas/:id` - Delete campaign (auth required, owner only)

#### Donations
- `GET /api/campanhas/:id/doacoes` - List campaign donations (public)
- `POST /api/campanhas/:id/doacoes` - Make donation (auth required)
- `GET /api/doacoes/:id` - Get donation details (auth required, owner only)

#### Comments
- `GET /api/campanhas/:id/comentarios` - List campaign comments (public)
- `POST /api/campanhas/:id/comentarios` - Add comment (auth required)
- `PUT /api/comentarios/:id` - Update comment (auth required, owner only)
- `DELETE /api/comentarios/:id` - Delete comment (auth required, owner only)

## 🏗️ Project Structure

```
sistema-doacoes-api/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js             # Server startup and database connection
│   ├── config/
│   │   ├── connection.js     # Database connection setup
│   │   └── swaggerConfig.js  # API documentation configuration
│   ├── controllers/          # Request/response handling logic
│   │   ├── authController.js
│   │   ├── categoriaController.js
│   │   ├── campanhaController.js
│   │   ├── doacaoController.js
│   │   └── comentarioController.js
│   ├── middlewares/          # Custom middleware functions
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── loggingMiddleware.js
│   │   ├── requestIdMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/              # Sequelize models (auto-generated)
│   ├── routes/              # Route definitions
│   │   ├── authRoutes.js
│   │   ├── categoriaRoutes.js
│   │   ├── campanhaRoutes.js
│   │   ├── doacaoRoutes.js
│   │   └── comentarioRoutes.js
│   ├── validators/          # Input validation schemas
│   │   ├── authValidator.js
│   │   ├── categoriaValidator.js
│   │   ├── campanhaValidator.js
│   │   ├── doacaoValidator.js
│   │   └── comentarioValidator.js
│   ├── utils/               # Utility functions
│   │   └── validators.js    # Business logic validators
│   ├── tests/               # Test suites
│   │   ├── unit/           # Unit tests
│   │   ├── integration/    # Integration tests
│   │   └── helpers/        # Test utilities
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── .env.example             # Environment variables template
├── .sequelizerc            # Sequelize CLI configuration
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:ci

# Run specific test suites
npm run test:unit
npm run test:integration

# Watch mode for development
npm run test:watch
```

### Test Structure
- **Unit Tests**: Test individual functions and utilities
- **Integration Tests**: Test complete API endpoints and workflows
- **Test Database**: Uses separate test database configuration

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **SQL Injection Protection**: Sequelize ORM parameterized queries
- **Error Handling**: Centralized error handling with sanitized responses
- **Request Logging**: Comprehensive request tracking and logging

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Ensure database server is running
   - Check SSL requirements for cloud databases

2. **Migration Errors**
   - Run `npm run migrate:status` to check current state
   - Use `npm run migrate:undo` to rollback if needed
   - Ensure database user has proper permissions

3. **JWT Token Issues**
   - Verify JWT_SECRET is set in environment
   - Check token expiration settings
   - Ensure Authorization header format is correct

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

### Getting Help

1. Check the API documentation at `/api-docs`
2. Review application logs for error details
3. Verify environment variables are properly set
4. Test database connectivity separately

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Express.js and Sequelize
- Database hosting by NeonDB
- Deployment platform: Render
- Testing framework: Jest
- API documentation: Swagger/OpenAPI