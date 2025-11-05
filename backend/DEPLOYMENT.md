# Deployment Guide - Sistema de Doações API

This guide provides step-by-step instructions for deploying the Sistema de Doações API to production using Render and NeonDB.

## 🚀 Quick Deployment Overview

1. **Database Setup**: Create PostgreSQL database on NeonDB
2. **Code Preparation**: Ensure code is ready for production
3. **Platform Setup**: Configure Render web service
4. **Environment Configuration**: Set production environment variables
5. **Deploy & Verify**: Deploy and test the application

## 📋 Prerequisites

- Git repository with your code (GitHub, GitLab, or Bitbucket)
- NeonDB account for PostgreSQL database
- Render account for application hosting
- Basic understanding of environment variables

## 🗄️ Database Setup (NeonDB)

### Step 1: Create NeonDB Account
1. Visit [neon.tech](https://neon.tech)
2. Sign up with GitHub, Google, or email
3. Verify your email address

### Step 2: Create Database
1. Click "Create Project"
2. Choose your preferred region (closest to your users)
3. Enter project name: `sistema-doacoes-db`
4. Select PostgreSQL version (latest stable)
5. Click "Create Project"

### Step 3: Get Connection Details
1. Go to your project dashboard
2. Navigate to "Connection Details"
3. Copy the connection string (it looks like):
   ```
   postgres://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```
4. Save this for later use in environment variables

### Step 4: Configure Database (Optional)
```sql
-- Connect to your database and run these commands if needed
-- (Usually not necessary as migrations handle this)

-- Check connection
SELECT version();

-- Verify SSL is enabled
SHOW ssl;
```

## 🔧 Code Preparation

### Step 1: Verify Package.json
Ensure your `package.json` has the correct scripts:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "deploy": "npm run migrate && npm start",
    "postinstall": "npm run migrate",
    "migrate": "npx sequelize-cli db:migrate"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

### Step 2: Environment Variables Template
Create `.env.example` with all required variables:
```env
NODE_ENV=production
DATABASE_URL=postgres://username:password@host:port/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=8h
PRODUCTION_URL=https://your-deployment-url.render.com
```

### Step 3: Commit and Push
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

## 🌐 Render Deployment

### Step 1: Create Render Account
1. Visit [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy repo access)
3. Verify your email address

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your Git repository
3. Select the repository containing your API code
4. Configure the service:
   - **Name**: `sistema-doacoes-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your production branch)
   - **Runtime**: `Node`

### Step 3: Configure Build Settings
- **Build Command**: `npm install`
- **Start Command**: `npm run deploy`
- **Node Version**: `16` or higher

### Step 4: Set Environment Variables
In the Render dashboard, go to "Environment" tab and add:

```env
NODE_ENV=production
DATABASE_URL=postgres://your-neondb-connection-string
JWT_SECRET=your-production-jwt-secret-32-chars-minimum
JWT_EXPIRES_IN=8h
PRODUCTION_URL=https://your-actual-service-name.onrender.com
```

**Important Notes:**
- Replace `your-neondb-connection-string` with actual NeonDB URL
- Generate a secure JWT_SECRET (32+ characters)
- Update `PRODUCTION_URL` with your actual Render service URL

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically start the deployment
3. Monitor the build logs for any errors
4. Wait for deployment to complete (usually 2-5 minutes)

## ✅ Post-Deployment Verification

### Step 1: Basic Health Check
```bash
# Replace with your actual deployment URL
curl https://your-service-name.onrender.com/health

# Expected response: 200 OK
```

### Step 2: API Documentation
Visit your Swagger documentation:
```
https://your-service-name.onrender.com/api-docs
```

### Step 3: Test Authentication Endpoints
```bash
# Test user registration
curl -X POST https://your-service-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Test User",
    "email": "test@example.com",
    "senha": "testpassword123"
  }'

# Expected: 201 Created with user data
```

```bash
# Test user login
curl -X POST https://your-service-name.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "senha": "testpassword123"
  }'

# Expected: 200 OK with JWT token
```

### Step 4: Test Protected Endpoints
```bash
# Get JWT token from login response, then test protected endpoint
curl -X GET https://your-service-name.onrender.com/api/categorias \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Expected: 200 OK with categories list
```

## 📊 API Usage Examples

### Authentication Flow
```javascript
// 1. Register a new user
const registerResponse = await fetch('https://your-api-url.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@example.com',
    senha: 'minhasenha123'
  })
});

// 2. Login to get JWT token
const loginResponse = await fetch('https://your-api-url.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@example.com',
    senha: 'minhasenha123'
  })
});

const { token } = await loginResponse.json();

// 3. Use token for authenticated requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

### Category Management
```javascript
// Create a new category
const categoryResponse = await fetch('https://your-api-url.com/api/categorias', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    nome: 'Saúde',
    descricao: 'Campanhas relacionadas à saúde e bem-estar'
  })
});

// List all categories (public endpoint)
const categoriesResponse = await fetch('https://your-api-url.com/api/categorias');
const categories = await categoriesResponse.json();
```

### Campaign Management
```javascript
// Create a new campaign
const campaignResponse = await fetch('https://your-api-url.com/api/campanhas', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    titulo: 'Ajude a construir um hospital infantil',
    descricao: 'Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil.',
    meta_arrecadacao: 50000.00,
    data_limite: '2024-12-31',
    categoria_id: 1
  })
});

// List campaigns with filters
const campaignsResponse = await fetch('https://your-api-url.com/api/campanhas?categoria_id=1&status=ativa');
const campaigns = await campaignsResponse.json();
```

### Donation Processing
```javascript
// Make a donation to a campaign
const donationResponse = await fetch('https://your-api-url.com/api/campanhas/1/doacoes', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    valor: 100.00,
    mensagem_apoio: 'Espero que esta doação ajude muitas crianças!'
  })
});

// List donations for a campaign
const donationsResponse = await fetch('https://your-api-url.com/api/campanhas/1/doacoes');
const donations = await donationsResponse.json();
```

### Comment System
```javascript
// Add a comment to a campaign
const commentResponse = await fetch('https://your-api-url.com/api/campanhas/1/comentarios', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    texto: 'Excelente iniciativa! Parabéns pelo projeto.'
  })
});

// List comments for a campaign
const commentsResponse = await fetch('https://your-api-url.com/api/campanhas/1/comentarios');
const comments = await commentsResponse.json();
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### Build Failures
```
Error: Cannot find module 'some-package'
```
**Solution**: Ensure all dependencies are in `package.json` dependencies (not devDependencies)

#### Database Connection Issues
```
Error: getaddrinfo ENOTFOUND
```
**Solution**: 
1. Verify DATABASE_URL is correctly set in Render environment variables
2. Ensure NeonDB allows connections from Render IPs
3. Check that `?sslmode=require` is included in the connection string

#### Migration Failures
```
Error: relation "usuarios" does not exist
```
**Solution**:
1. Check that migrations are running during deployment
2. Verify Sequelize configuration is correct
3. Manually run migrations if needed:
   ```bash
   # In Render shell (if available)
   npm run migrate
   ```

#### JWT Token Issues
```
Error: jwt malformed
```
**Solution**:
1. Verify JWT_SECRET is set in production environment
2. Ensure JWT_SECRET is at least 32 characters long
3. Check that tokens are being sent with correct format: `Bearer <token>`

### Performance Optimization

#### Database Optimization
```javascript
// Use connection pooling (already configured in Sequelize)
// Add database indexes for frequently queried fields
// Consider read replicas for high-traffic applications
```

#### Caching Strategy
```javascript
// Add Redis for session caching (optional enhancement)
// Implement response caching for public endpoints
// Use CDN for static assets if added later
```

### Monitoring and Logging

#### Render Logs
1. Go to your service dashboard
2. Click "Logs" tab
3. Monitor for errors and performance issues

#### Custom Logging
```javascript
// Application logs are automatically captured by Render
console.log('Info: User registered successfully');
console.error('Error: Database connection failed');
```

#### Health Monitoring
```javascript
// Add health check endpoint (already implemented)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🔄 Continuous Deployment

### Automatic Deployments
Render automatically deploys when you push to your connected branch:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Render will automatically detect changes and redeploy
```

### Manual Deployments
1. Go to your Render service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Monitor deployment progress in logs

### Rollback Procedures
If a deployment fails:
1. Go to "Deployments" tab in Render dashboard
2. Find the last successful deployment
3. Click "Redeploy" on that version
4. Monitor rollback progress

## 📈 Scaling and Maintenance

### Vertical Scaling
- Render automatically handles basic scaling
- Upgrade to higher-tier plans for more resources
- Monitor performance metrics in dashboard

### Database Maintenance
- NeonDB handles backups automatically
- Monitor database performance and storage usage
- Consider upgrading NeonDB plan for higher traffic

### Security Updates
- Regularly update npm dependencies
- Monitor for security vulnerabilities
- Keep Node.js version updated in Render settings

## 🆘 Support and Resources

### Documentation Links
- [Render Documentation](https://render.com/docs)
- [NeonDB Documentation](https://neon.tech/docs)
- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

### Community Support
- [Render Community Forum](https://community.render.com/)
- [NeonDB Discord](https://discord.gg/neon)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/render.com)

### Emergency Contacts
- Render Status: [status.render.com](https://status.render.com)
- NeonDB Status: [status.neon.tech](https://status.neon.tech)

---

**🎉 Congratulations!** Your Sistema de Doações API is now deployed and ready for production use. Remember to monitor logs, update dependencies regularly, and scale resources as your user base grows.