const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const comentarioValidator = require('../validators/comentarioValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management endpoints
 */

/**
 * @swagger
 * /api/campanhas/{id}/comentarios:
 *   post:
 *     summary: Add comment to campaign
 *     description: Add a new comment to a specific campaign (requires authentication)
 *     tags: [Comments]
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
 *             $ref: '#/components/schemas/ComentarioInput'
 *           example:
 *             texto: "Excelente iniciativa! Parabéns pelo projeto."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentário criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Comentario'
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
router.post('/campanhas/:id/comentarios', 
  authMiddleware,
  comentarioValidator.create,
  validationMiddleware,
  comentarioController.create
);

/**
 * @swagger
 * /api/campanhas/{id}/comentarios:
 *   get:
 *     summary: List campaign comments
 *     description: Retrieve all comments for a specific campaign (public endpoint)
 *     tags: [Comments]
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
 *         description: Comments list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentários encontrados com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comentario'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/campanhas/:id/comentarios',
  comentarioValidator.getByCampaign,
  validationMiddleware,
  comentarioController.getByCampaign
);

/**
 * @swagger
 * /api/comentarios/{id}:
 *   get:
 *     summary: Get comment by ID
 *     description: Retrieve a specific comment by its ID (public endpoint)
 *     tags: [Comments]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentário encontrado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Comentario'
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/comentarios/:id',
  comentarioValidator.getById,
  validationMiddleware,
  comentarioController.getById
);

/**
 * @swagger
 * /api/comentarios/{id}:
 *   put:
 *     summary: Update comment
 *     description: Update an existing comment (requires authentication and ownership)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComentarioInput'
 *           example:
 *             texto: "Excelente iniciativa! Parabéns pelo projeto atualizado."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentário atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Comentario'
 *                 requestId:
 *                   type: string
 *                   example: "req_123456789"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/comentarios/:id',
  authMiddleware,
  comentarioValidator.update,
  validationMiddleware,
  comentarioController.update
);

/**
 * @swagger
 * /api/comentarios/{id}:
 *   delete:
 *     summary: Delete comment
 *     description: Delete an existing comment (requires authentication and ownership)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentário deletado com sucesso"
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
router.delete('/comentarios/:id',
  authMiddleware,
  comentarioValidator.delete,
  validationMiddleware,
  comentarioController.delete
);

module.exports = router;