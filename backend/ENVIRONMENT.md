# Environment Variables Documentation

This document provides comprehensive information about all environment variables used in the Sistema de Doações API.

## Required Environment Variables

### Database Configuration

#### `DATABASE_URL` (Required)
- **Description**: PostgreSQL database connection string
- **Format**: `postgres://username:password@host:port/database?sslmode=require`
- **Example**: `postgres://user:pass@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`
- **Notes**: 
  - For NeonDB, always include `?sslmode=require`
  - Ensure the database user has CREATE, READ, UPDATE, DELETE permissions
  - The database will be created automatically if it doesn't exist

### Authentication Configuration

#### `JWT_SECRET` (Required)
- **Description**: Secret key used for signing JWT tokens
- **Format**: String (minimum 32 characters recommended)
- **Example**: `your-super-secret-jwt-key-with-at-least-32-chars`
- **Security Notes**:
  - Use a cryptographically secure random string
  - Never commit this to version control
  - Different secrets for development/production environments
  - Consider using a key management service for production

#### `JWT_EXPIRES_IN` (Optional)
- **Description**: JWT token expiration time
- **Default**: `8h`
- **Format**: String (time format: s, m, h, d)
- **Examples**: `1h`, `30m`, `7d`, `24h`
- **Notes**: Balance security (shorter) vs user experience (longer)

## Optional Environment Variables

### Server Configuration

#### `NODE_ENV` (Optional)
- **Description**: Application environment mode
- **Default**: `development`
- **Valid Values**: `development`, `test`, `production`
- **Effects**:
  - `development`: Detailed error messages, debug logging
  - `test`: Test database configuration, minimal logging
  - `production`: Optimized performance, error sanitization

#### `PORT` (Optional)
- **Description**: Server port number
- **Default**: `3000`
- **Format**: Integer (1-65535)
- **Examples**: `3000`, `8080`, `5000`
- **Notes**: 
  - Render automatically sets this in production
  - Use different ports for multiple local instances

### API Configuration

#### `API_URL` (Optional)
- **Description**: Base URL for API documentation
- **Default**: `http://localhost:3000` (development)
- **Format**: Full URL with protocol
- **Examples**: 
  - Development: `http://localhost:3000`
  - Production: `https://your-app.render.com`
- **Usage**: Used in Swagger documentation server configuration

#### `PRODUCTION_URL` (Optional)
- **Description**: Production deployment URL for Swagger documentation
- **Default**: `https://your-deployment-url.render.com`
- **Format**: Full HTTPS URL
- **Example**: `https://sistema-doacoes-api.render.com`
- **Usage**: Displayed in API documentation as production server option

## Environment-Specific Configurations

### Development Environment (.env.development)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/doacoes_dev
JWT_SECRET=development-secret-key-change-in-production
JWT_EXPIRES_IN=8h
API_URL=http://localhost:3000
```

### Test Environment (.env.test)
```env
NODE_ENV=test
PORT=3001
DATABASE_URL=postgres://username:password@localhost:5432/doacoes_test
JWT_SECRET=test-secret-key-different-from-production
JWT_EXPIRES_IN=1h
API_URL=http://localhost:3001
```

### Production Environment (Render Dashboard)
```env
NODE_ENV=production
# PORT is automatically set by Render
DATABASE_URL=postgres://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=production-super-secure-secret-key-32-chars-minimum
JWT_EXPIRES_IN=8h
PRODUCTION_URL=https://your-actual-deployment-url.render.com
```

## Database Connection Examples

### Local PostgreSQL
```env
DATABASE_URL=postgres://postgres:password@localhost:5432/sistema_doacoes
```

### NeonDB (Recommended for Production)
```env
DATABASE_URL=postgres://username:password@ep-cool-darkness-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Heroku Postgres
```env
DATABASE_URL=postgres://username:password@ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com:5432/database?sslmode=require
```

### Railway PostgreSQL
```env
DATABASE_URL=postgres://postgres:password@containers-us-west-xxx.railway.app:5432/railway?sslmode=require
```

## Security Best Practices

### JWT Secret Generation
```bash
# Generate a secure JWT secret (Linux/Mac)
openssl rand -base64 32

# Generate using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate using online tool (use with caution)
# Visit: https://generate-secret.vercel.app/32
```

### Environment Variable Management

#### Development
- Use `.env` file (never commit to git)
- Copy from `.env.example` template
- Use different values than production

#### Production (Render)
1. Go to your service dashboard
2. Navigate to "Environment" tab
3. Add each variable individually
4. Use "Add from .env" for bulk import (without sensitive values)

#### CI/CD (GitHub Actions)
```yaml
env:
  NODE_ENV: test
  DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
  JWT_SECRET: ${{ secrets.TEST_JWT_SECRET }}
```

## Validation and Testing

### Environment Validation Script
Create a script to validate environment variables:

```javascript
// scripts/validate-env.js
const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
const optionalVars = ['NODE_ENV', 'PORT', 'JWT_EXPIRES_IN'];

console.log('🔍 Validating environment variables...\n');

// Check required variables
let hasErrors = false;
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required variable: ${varName}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

// Check optional variables
optionalVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: ${process.env[varName]}`);
  } else {
    console.log(`⚠️  ${varName}: Using default`);
  }
});

if (hasErrors) {
  console.error('\n❌ Environment validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ Environment validation passed!');
}
```

### Database Connection Test
```javascript
// scripts/test-db.js
const { Sequelize } = require('sequelize');

async function testConnection() {
  const sequelize = new Sequelize(process.env.DATABASE_URL);
  
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    const [results] = await sequelize.query('SELECT version()');
    console.log('📊 Database version:', results[0].version);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

testConnection();
```

## Troubleshooting

### Common Issues

#### Database Connection Errors
```
Error: getaddrinfo ENOTFOUND
```
- **Cause**: Invalid database host or network issues
- **Solution**: Verify DATABASE_URL format and network connectivity

```
Error: password authentication failed
```
- **Cause**: Incorrect username/password in DATABASE_URL
- **Solution**: Verify credentials in your database provider dashboard

```
Error: SSL connection required
```
- **Cause**: Missing SSL configuration for cloud databases
- **Solution**: Add `?sslmode=require` to DATABASE_URL

#### JWT Token Issues
```
Error: jwt malformed
```
- **Cause**: Invalid JWT_SECRET or token format
- **Solution**: Verify JWT_SECRET is properly set and tokens are valid

```
Error: jwt expired
```
- **Cause**: Token has exceeded JWT_EXPIRES_IN duration
- **Solution**: Request new token or increase expiration time

#### Port Conflicts
```
Error: EADDRINUSE: address already in use :::3000
```
- **Cause**: Another process is using the specified port
- **Solution**: Change PORT variable or kill existing process

### Environment Debugging

#### Check Current Environment
```bash
# List all environment variables
printenv | grep -E "(NODE_ENV|PORT|DATABASE_URL|JWT_)"

# Check specific variable
echo $DATABASE_URL
```

#### Validate Configuration
```bash
# Run environment validation
npm run validate-env

# Test database connection
npm run test-db

# Check server health
npm run health
```

## Migration and Deployment

### Pre-deployment Checklist
- [ ] All required environment variables set
- [ ] Database accessible from deployment platform
- [ ] JWT_SECRET is production-ready (32+ characters)
- [ ] NODE_ENV set to 'production'
- [ ] PRODUCTION_URL matches actual deployment URL
- [ ] Database migrations will run automatically

### Post-deployment Verification
- [ ] API responds at base URL
- [ ] Swagger documentation accessible at /api-docs
- [ ] Database migrations completed successfully
- [ ] Authentication endpoints working
- [ ] All CRUD operations functional

### Rollback Procedures
If deployment fails:
1. Check environment variables in platform dashboard
2. Review deployment logs for specific errors
3. Verify database connectivity
4. Test with previous working configuration
5. Use platform rollback feature if available

## Additional Resources

- [NeonDB Documentation](https://neon.tech/docs)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)