# Requirements Document - Sistema de Doações API

## Introduction

The Sistema de Doações (Donation System) is a comprehensive REST API that enables users to create and manage donation campaigns, make donations, and engage with campaigns through comments. The system supports user authentication, campaign categorization, and provides complete CRUD operations for all entities with proper security and validation.

## Glossary

- **Sistema_Doacoes**: The complete donation system API application
- **Usuario**: A registered user who can create campaigns, make donations, and comment
- **Campanha**: A fundraising campaign with a monetary goal and deadline
- **Doacao**: A monetary contribution made by a user to a specific campaign
- **Categoria**: A classification system for organizing campaigns by theme
- **Comentario**: User-generated text content associated with a campaign
- **JWT_Token**: JSON Web Token used for user authentication and authorization
- **CRUD_Operations**: Create, Read, Update, Delete operations for data management
- **NeonDB**: PostgreSQL cloud database service used for data persistence
- **Sequelize_ORM**: Object-Relational Mapping tool for database operations

## Requirements

### Requirement 1

**User Story:** As a new user, I want to register an account with my personal information, so that I can access the donation system features.

#### Acceptance Criteria

1. WHEN a user submits registration data with name, email and password, THE Sistema_Doacoes SHALL create a new Usuario record with encrypted password
2. THE Sistema_Doacoes SHALL validate that the email address is unique in the system
3. THE Sistema_Doacoes SHALL hash the password using bcrypt before storing in the database
4. IF the email already exists, THEN THE Sistema_Doacoes SHALL return an error message indicating duplicate email
5. THE Sistema_Doacoes SHALL return a success confirmation when Usuario is created successfully

### Requirement 2

**User Story:** As a registered user, I want to authenticate with my credentials, so that I can access protected features of the system.

#### Acceptance Criteria

1. WHEN a user submits valid email and password, THE Sistema_Doacoes SHALL generate a JWT_Token with 8-hour expiration
2. THE Sistema_Doacoes SHALL verify the password against the stored hash using bcrypt
3. IF credentials are invalid, THEN THE Sistema_Doacoes SHALL return an authentication error
4. THE Sistema_Doacoes SHALL include user identification data in the JWT_Token payload
5. THE Sistema_Doacoes SHALL require JWT_Token for all protected endpoints

### Requirement 3

**User Story:** As a system administrator, I want to manage campaign categories, so that campaigns can be properly organized and filtered.

#### Acceptance Criteria

1. THE Sistema_Doacoes SHALL provide CRUD_Operations for Categoria entities
2. WHEN creating a Categoria, THE Sistema_Doacoes SHALL require name and description fields
3. THE Sistema_Doacoes SHALL validate that category names are unique
4. THE Sistema_Doacoes SHALL allow public access to category listing without authentication
5. THE Sistema_Doacoes SHALL restrict category creation and modification to authenticated users

### Requirement 4

**User Story:** As an authenticated user, I want to create fundraising campaigns, so that I can raise money for causes I care about.

#### Acceptance Criteria

1. WHEN an authenticated user creates a Campanha, THE Sistema_Doacoes SHALL associate it with the user's ID
2. THE Sistema_Doacoes SHALL require titulo, descricao, meta_arrecadacao, data_limite, and categoria_id fields
3. THE Sistema_Doacoes SHALL validate that data_limite is a future date
4. THE Sistema_Doacoes SHALL initialize valor_atual to zero and status to 'ativa'
5. THE Sistema_Doacoes SHALL include related Usuario and Categoria data when retrieving campaigns

### Requirement 5

**User Story:** As a user, I want to make donations to campaigns, so that I can support causes I believe in.

#### Acceptance Criteria

1. WHEN an authenticated user makes a Doacao, THE Sistema_Doacoes SHALL record the valor, data, and optional mensagem_apoio
2. THE Sistema_Doacoes SHALL associate the Doacao with both the Usuario and Campanha
3. THE Sistema_Doacoes SHALL update the Campanha valor_atual by adding the donation amount
4. THE Sistema_Doacoes SHALL validate that the donation valor is a positive decimal number
5. THE Sistema_Doacoes SHALL automatically set the current timestamp as the donation date

### Requirement 6

**User Story:** As a user, I want to comment on campaigns, so that I can engage with the community and show support.

#### Acceptance Criteria

1. WHEN an authenticated user creates a Comentario, THE Sistema_Doacoes SHALL associate it with the user and campaign
2. THE Sistema_Doacoes SHALL require texto field and automatically set the current date
3. THE Sistema_Doacoes SHALL validate that texto is not empty
4. THE Sistema_Doacoes SHALL include Usuario information when retrieving comments
5. THE Sistema_Doacoes SHALL allow public access to view comments without authentication

### Requirement 7

**User Story:** As a developer, I want comprehensive API documentation, so that I can understand and integrate with all endpoints.

#### Acceptance Criteria

1. THE Sistema_Doacoes SHALL provide Swagger documentation at the /api-docs endpoint
2. THE Sistema_Doacoes SHALL document all API endpoints with request and response schemas
3. THE Sistema_Doacoes SHALL include authentication requirements in the documentation
4. THE Sistema_Doacoes SHALL provide example requests and responses for each endpoint
5. THE Sistema_Doacoes SHALL document error responses and status codes

### Requirement 8

**User Story:** As a system operator, I want proper error handling and logging, so that I can monitor and troubleshoot the system effectively.

#### Acceptance Criteria

1. THE Sistema_Doacoes SHALL implement at least 5 middleware functions for request processing
2. THE Sistema_Doacoes SHALL log all incoming requests with timestamp and method information
3. THE Sistema_Doacoes SHALL provide centralized error handling with consistent response format
4. THE Sistema_Doacoes SHALL validate all input data using express-validator before processing
5. THE Sistema_Doacoes SHALL assign unique request IDs for tracking purposes

### Requirement 9

**User Story:** As a quality assurance engineer, I want automated tests, so that I can verify the system functionality and prevent regressions.

#### Acceptance Criteria

1. THE Sistema_Doacoes SHALL include unit tests for core business logic functions
2. THE Sistema_Doacoes SHALL include integration tests for all CRUD_Operations
3. THE Sistema_Doacoes SHALL achieve test coverage for authentication and authorization flows
4. THE Sistema_Doacoes SHALL use Jest and Supertest frameworks for testing
5. THE Sistema_Doacoes SHALL run tests against a separate test database environment

### Requirement 10

**User Story:** As an end user, I want to access the API from anywhere, so that I can use the donation system from any location.

#### Acceptance Criteria

1. THE Sistema_Doacoes SHALL be deployed on Render cloud platform with public access
2. THE Sistema_Doacoes SHALL use NeonDB cloud database for data persistence
3. THE Sistema_Doacoes SHALL run database migrations automatically during deployment
4. THE Sistema_Doacoes SHALL provide a functional API endpoint accessible via HTTPS
5. THE Sistema_Doacoes SHALL include deployment URL in the project documentation