const express = require('express');
const router = express.Router();
const doacaoController = require('../controllers/doacaoController');
const doacaoValidator = require('../validators/doacaoValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Donations
 *   description: Donation management endpoints
 */

/**
 * @swagger
 * /api/campanhas/{id}/doacoes:
 *   post:
 *     summary: Make donation to campaign
 *     description: Make a monetary donation to a specific campaign (requires authentication)
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoacaoInput'
 *           example:
 *             valor: 100.00
 *             mensagem_apoio: "Espero que esta doação ajude muitas crianças!"
 *     responses:
 *       201:
 *         description: Donation made successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doação realizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Doacao'
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
router.post('/campanhas/:id/doacoes', 
  authMiddleware,
  doacaoValidator.create,
  validationMiddleware,
  doacaoController.create
);

/**
 * @swagger
 * /api/campanhas/{id}/doacoes:
 *   get:
 *     summary: List campaign donations
 *     description: Retrieve all donations for a specific campaign (public endpoint)
 *     tags: [Donations]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *         example: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Donations list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doações encontradas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doacao'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/campanhas/:id/doacoes',
  doacaoValidator.getByCampaign,
  validationMiddleware,
  doacaoController.getByCampaign
);

/**
 * @swagger
 * /api/campanhas/{id}/doacoes/stats:
 *   get:
 *     summary: Get campaign donation statistics
 *     description: Retrieve donation statistics for a specific campaign (public endpoint)
 *     tags: [Donations]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estatísticas recuperadas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     campanha_id:
 *                       type: integer
 *                       example: 1
 *                     total_doacoes:
 *                       type: integer
 *                       example: 15
 *                     total_arrecadado:
 *                       type: number
 *                       format: decimal
 *                       example: 1500.00
 *                     valor_medio:
 *                       type: number
 *                       format: decimal
 *                       example: 100.00
 *                     maior_doacao:
 *                       type: number
 *                       format: decimal
 *                       example: 500.00
 *                     menor_doacao:
 *                       type: number
 *                       format: decimal
 *                       example: 10.00
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/campanhas/:id/doacoes/stats',
  doacaoValidator.getStats,
  validationMiddleware,
  doacaoController.getStatsByCampaign
);

/**
 * @swagger
 * /api/doacoes/{id}:
 *   get:
 *     summary: Get donation by ID
 *     description: Retrieve a specific donation by its ID (requires authentication and ownership)
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Donation ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Donation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doação encontrada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Doacao'
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/doacoes/:id',
  authMiddleware,
  doacaoValidator.getById,
  validationMiddleware,
  doacaoController.getById
);

/**
 * @swagger
 * /api/doacoes/minhas:
 *   get:
 *     summary: List my donations
 *     description: Retrieve all donations made by the authenticated user
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: User donations list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Suas doações encontradas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doacao'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/doacoes/minhas',
  authMiddleware,
  doacaoController.getByUser
);

module.exports = router;