const express = require('express');
const router = express.Router();

// Import controller and middleware
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const categoriaValidator = require('../validators/categoriaValidator');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Campaign category management endpoints
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: List all categories
 *     description: Retrieve all available campaign categories (public endpoint)
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *             example:
 *               - id: 1
 *                 nome: "Saúde"
 *                 descricao: "Campanhas relacionadas à saúde e bem-estar"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *               - id: 2
 *                 nome: "Educação"
 *                 descricao: "Campanhas para apoio educacional"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Public routes (no authentication required)
// GET /api/categorias - List all categories
router.get('/', categoriaController.getAll);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a specific category by its ID (public endpoint)
 *     tags: [Categories]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *             example:
 *               id: 1
 *               nome: "Saúde"
 *               descricao: "Campanhas relacionadas à saúde e bem-estar"
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// GET /api/categorias/:id - Get category by ID
router.get('/:id', 
  categoriaValidator.getById,
  validationMiddleware,
  categoriaController.getById
);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Create new category
 *     description: Create a new campaign category (requires authentication)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *           example:
 *             nome: "Saúde"
 *             descricao: "Campanhas relacionadas à saúde e bem-estar"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria criada com sucesso"
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Category name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Nome da categoria já existe"
 *               requestId: "req_123456789"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Protected routes (authentication required)
// POST /api/categorias - Create new category
router.post('/',
  authMiddleware,
  categoriaValidator.create,
  validationMiddleware,
  categoriaController.create
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Update category
 *     description: Update an existing category (requires authentication)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaInput'
 *           example:
 *             nome: "Saúde e Bem-estar"
 *             descricao: "Campanhas relacionadas à saúde, bem-estar e qualidade de vida"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria atualizada com sucesso"
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Category name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Nome da categoria já existe"
 *               requestId: "req_123456789"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// PUT /api/categorias/:id - Update category
router.put('/:id',
  authMiddleware,
  categoriaValidator.update,
  validationMiddleware,
  categoriaController.update
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Delete category
 *     description: Delete an existing category (requires authentication)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria deletada com sucesso"
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// DELETE /api/categorias/:id - Delete category
router.delete('/:id',
  authMiddleware,
  categoriaValidator.delete,
  validationMiddleware,
  categoriaController.delete
);

module.exports = router;