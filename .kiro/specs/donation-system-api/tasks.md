# Implementation Plan - Sistema de Doações API

- [x] 1. Set up project foundation and database configuration









  - Initialize Node.js project with package.json and install all required dependencies (express, sequelize, pg, dotenv, jwt, bcrypt, express-validator, swagger packages, jest, supertest)
  - Create project directory structure with src folder and all subdirectories (controllers, middlewares, models, routes, validators, utils, tests, config)
  - Configure environment variables setup with .env file template and database connection
  - Set up Sequelize CLI configuration for NeonDB with SSL settings
  - _Requirements: 10.2, 10.3_

- [x] 2. Create database models and migrations





  - [x] 2.1 Generate Sequelize models and migrations for all 5 entities


    - Create Usuario model with id, nome, email, senha_hash fields
    - Create Categoria model with id, nome, descricao fields  
    - Create Campanha model with all fields including foreign keys to Usuario and Categoria
    - Create Doacao model with valor, data, mensagem_apoio and foreign keys
    - Create Comentario model with texto, data and foreign keys
    - _Requirements: 1.1, 3.1, 4.1, 5.1, 6.1_

  - [x] 2.2 Define model associations and relationships


    - Configure belongsTo and hasMany relationships between all models
    - Set up foreign key constraints and cascade options
    - Add model validation rules and constraints
    - _Requirements: 1.1, 3.1, 4.1, 5.1, 6.1_

- [x] 3. Implement core middleware functions





  - [x] 3.1 Create authentication middleware with JWT verification


    - Implement JWT token verification logic
    - Extract user ID from token payload and attach to request object
    - Handle token validation errors and unauthorized access
    - _Requirements: 2.5, 8.1_

  - [x] 3.2 Create logging and request tracking middleware


    - Implement request logging middleware with timestamp and method
    - Create request ID middleware using uuid for unique tracking
    - Add error handling middleware for centralized error processing
    - _Requirements: 8.2, 8.3, 8.5_

  - [x] 3.3 Set up input validation middleware


    - Create validation middleware that checks express-validator results
    - Implement standardized error response format for validation failures
    - _Requirements: 8.4_

- [x] 4. Implement authentication system





  - [x] 4.1 Create user registration functionality


    - Implement authController.register method with email uniqueness check
    - Add password hashing using bcrypt with salt rounds = 10
    - Create input validation for registration data (name, email, password)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 4.2 Create user login functionality  


    - Implement authController.login method with credential verification
    - Add password comparison using bcrypt.compare
    - Generate JWT token with 8-hour expiration on successful login
    - Create input validation for login credentials
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.3 Set up authentication routes


    - Create authRoutes.js with POST /register and POST /login endpoints
    - Apply validation middleware to authentication routes
    - _Requirements: 1.1, 2.1_

- [x] 5. Implement categoria (category) CRUD operations





  - [x] 5.1 Create categoria controller with full CRUD methods


    - Implement getAll, create, getById, update, delete methods
    - Add proper error handling and response formatting
    - Include input validation for category creation and updates
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 5.2 Set up categoria routes and validation


    - Create categoriaRoutes.js with all RESTful endpoints
    - Apply authentication middleware to protected routes (create, update, delete)
    - Keep listing routes public as specified in requirements
    - Create categoriaValidator.js with validation rules for name and description
    - _Requirements: 3.4, 3.5_

- [x] 6. Implement campanha (campaign) CRUD operations





  - [x] 6.1 Create campanha controller with CRUD and business logic


    - Implement getAll with include for Usuario and Categoria data
    - Create campaign creation method that associates with authenticated user
    - Add getById, update, delete methods with ownership validation
    - Implement campaign status management logic
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 6.2 Set up campanha routes and validation


    - Create campanhaRoutes.js with all RESTful endpoints
    - Apply authentication middleware to protected operations
    - Create campanhaValidator.js with validation for titulo, meta_arrecadacao, data_limite
    - Add date validation to ensure data_limite is in the future
    - _Requirements: 4.1, 4.3_

- [x] 7. Implement doacao (donation) functionality





  - [x] 7.1 Create doacao controller with donation processing


    - Implement donation creation method that updates campaign valor_atual
    - Add donation listing for campaigns and user-specific donations
    - Include proper decimal handling for monetary values
    - Add validation for positive donation amounts
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.2 Set up doacao routes and validation


    - Create donation routes under campaigns (POST /campanhas/:id/doacoes)
    - Add individual donation retrieval with ownership checks
    - Create doacaoValidator.js with decimal validation for valor field
    - _Requirements: 5.1, 5.4_

- [x] 8. Implement comentario (comment) functionality





  - [x] 8.1 Create comentario controller with comment management


    - Implement comment creation associated with user and campaign
    - Add comment listing for campaigns with user information
    - Include update and delete methods with ownership validation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 8.2 Set up comentario routes and validation


    - Create comment routes under campaigns (POST /campanhas/:id/comentarios)
    - Add individual comment management endpoints
    - Create comentarioValidator.js with text validation
    - _Requirements: 6.1, 6.3_

- [x] 9. Set up Express application and server configuration





  - [x] 9.1 Create app.js with middleware pipeline


    - Configure Express application with JSON parsing
    - Set up middleware chain in correct order (logging, requestId, auth, validation, error)
    - Register all route modules with appropriate base paths
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 9.2 Create server.js with startup logic


    - Implement server startup with environment configuration
    - Add database connection testing on startup
    - Configure port and environment variable handling
    - _Requirements: 10.1, 10.4_

- [x] 10. Implement API documentation with Swagger





  - [x] 10.1 Set up Swagger configuration and schemas


    - Create swaggerConfig.js with OpenAPI 3.0 specification
    - Define component schemas for all data models
    - Configure JWT authentication scheme in Swagger
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 10.2 Add Swagger documentation to all routes


    - Document all endpoints with JSDoc comments in route files
    - Include request/response examples and error codes
    - Add authentication requirements documentation
    - Set up /api-docs endpoint with Swagger UI
    - _Requirements: 7.4, 7.5_

- [x] 11. Create comprehensive test suite





  - [x] 11.1 Set up testing environment and configuration


    - Configure Jest with test database setup
    - Create test utilities for database seeding and cleanup
    - Set up Supertest for API endpoint testing
    - _Requirements: 9.4_

  - [x] 11.2 Write unit tests for business logic


    - Create unit tests for utility functions (date validation, password hashing)
    - Test campaign status management logic
    - Test donation calculation functions
    - _Requirements: 9.1_

  - [x] 11.3 Write integration tests for all CRUD operations


    - Create integration tests for authentication flow (register/login)
    - Test all categoria CRUD operations
    - Test campanha CRUD with authentication and ownership
    - Test doacao creation and campaign value updates
    - Test comentario CRUD with proper associations
    - _Requirements: 9.2, 9.3_

- [x] 12. Prepare for deployment







  - [x] 12.1 Create deployment configuration


    - Set up package.json scripts for production
    - Configure database migration command for deployment
    - Create comprehensive README.md with setup instructions
    - _Requirements: 10.1, 10.5_


  - [x] 12.2 Finalize environment and documentation



    - Document all environment variables and configuration
    - Add deployment URL placeholders in Swagger configuration
    - Create final project documentation with API examples
    - _Requirements: 10.2, 10.5_