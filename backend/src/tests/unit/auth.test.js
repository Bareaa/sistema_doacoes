/**
 * Unit tests for authentication utilities
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Authentication Utilities', () => {
  describe('Password Hashing', () => {
    const testPassword = 'testPassword123';
    
    it('should hash password correctly', async () => {
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(testPassword);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should verify password correctly', async () => {
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      const isValid = await bcrypt.compare(testPassword, hashedPassword);
      expect(isValid).toBe(true);
      
      const isInvalid = await bcrypt.compare('wrongPassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });

    it('should generate different hashes for same password', async () => {
      const hash1 = await bcrypt.hash(testPassword, 10);
      const hash2 = await bcrypt.hash(testPassword, 10);
      
      expect(hash1).not.toBe(hash2);
      
      // But both should verify correctly
      expect(await bcrypt.compare(testPassword, hash1)).toBe(true);
      expect(await bcrypt.compare(testPassword, hash2)).toBe(true);
    });
  });

  describe('JWT Token Management', () => {
    const testSecret = 'test-secret-key';
    const testUserId = 123;
    
    beforeAll(() => {
      process.env.JWT_SECRET = testSecret;
    });

    it('should generate valid JWT token', () => {
      const token = jwt.sign(
        { userId: testUserId },
        testSecret,
        { expiresIn: '8h' }
      );
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should verify JWT token correctly', () => {
      const token = jwt.sign(
        { userId: testUserId },
        testSecret,
        { expiresIn: '8h' }
      );
      
      const decoded = jwt.verify(token, testSecret);
      
      expect(decoded.userId).toBe(testUserId);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        jwt.verify(invalidToken, testSecret);
      }).toThrow();
    });

    it('should reject token with wrong secret', () => {
      const token = jwt.sign(
        { userId: testUserId },
        'wrong-secret',
        { expiresIn: '8h' }
      );
      
      expect(() => {
        jwt.verify(token, testSecret);
      }).toThrow();
    });
  });
});