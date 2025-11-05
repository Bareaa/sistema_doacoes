const express = require('express');
const router = express.Router();

// Import controller and middleware
const campanhaController = require('../controllers/campanhaController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const campanhaValidator = require('../validators/campanhaValidator');

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management endpoints
 */

// Public routes (no authentication required)

/**
 * @swagger
 * /api/campanhas:
 *   get:
 *     summary: List all campaigns
 *     description: Retrieve all campaigns with optional filtering and pagination (public endpoint)
 *     tags: [Campaigns]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da categoria
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativa, concluida, cancelada]
 *         description: Filtrar por status
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Lista de campanhas recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Campanha'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Parâmetros de consulta inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', 
  campanhaValidator.getAll,
  validationMiddleware,
  campanhaController.getAll
);

/**
 * @swagger
 * /api/campanhas/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     description: Retrieve a specific campaign by its ID (public endpoint)
 *     tags: [Campaigns]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da campanha
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Campanha encontrada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Campanha'
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       404:
 *         description: Campanha não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', 
  campanhaValidator.getById,
  validationMiddleware,
  campanhaController.getById
);

// Protected routes (authentication required)

/**
 * @swagger
 * /api/campanhas:
 *   post:
 *     summary: Create new campaign
 *     description: Create a new fundraising campaign (requires authentication)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampanhaInput'
 *           example:
 *             titulo: "Ajude a construir um hospital infantil"
 *             descricao: "Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil na região."
 *             meta_arrecadacao: 50000.00
 *             data_limite: "2024-12-31"
 *             categoria_id: 1
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Campanha criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Campanha'
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Token de autenticação necessário
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/',
  authMiddleware,
  campanhaValidator.create,
  validationMiddleware,
  campanhaController.create
);

/**
 * @swagger
 * /api/campanhas/{id}:
 *   put:
 *     summary: Update campaign
 *     description: Update an existing campaign (requires authentication and ownership)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da campanha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampanhaInput'
 *           example:
 *             titulo: "Ajude a construir um hospital infantil - ATUALIZADO"
 *             descricao: "Esta campanha visa arrecadar fundos para a construção de um novo hospital infantil na região. Descrição atualizada."
 *             meta_arrecadacao: 75000.00
 *             data_limite: "2024-12-31"
 *             categoria_id: 1
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Campanha atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Campanha'
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas o criador pode editar
 *       404:
 *         description: Campanha não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id',
  authMiddleware,
  campanhaValidator.update,
  validationMiddleware,
  campanhaController.update
);

/**
 * @swagger
 * /api/campanhas/{id}:
 *   delete:
 *     summary: Delete campaign
 *     description: Delete an existing campaign (requires authentication and ownership)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da campanha
 *     responses:
 *       204:
 *         description: Campanha excluída com sucesso
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas o criador pode excluir
 *       404:
 *         description: Campanha não encontrada
 *       409:
 *         description: Campanha possui doações e não pode ser excluída
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id',
  authMiddleware,
  campanhaValidator.delete,
  validationMiddleware,
  campanhaController.delete
);

module.exports = router;