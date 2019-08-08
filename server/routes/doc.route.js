import express from 'express';
import * as docCtrl from '../controllers/doc.controller';
// import validate from '../config/joi.validate';
// import schema from '../utils/validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: doc
 *     description: doc operations
 */

/**
 * @swagger
 * definitions:
 *   doc:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier representing a specific doc
 *         example: 2
 *       ID:
 *         type: string
 *         description: ID of the doc
 *         example: Krishna
 *       FileName:
 *         type: string
 *         description: FileName of the doc
 *         example: Timilsina
 *       DocType:
 *         type: string
 *         description: DocType of the doc
 *       RunDate:
 *         type: string
 *         description: RunDate of the doc
 *       Logger:
 *         type: string
 *         description: Logger of the doc
 *       Well_ID:
 *         type: string
 *         description: Well_ID of the doc
 *       AddedDate:
 *         type: string
 *         description: AddedDate of the doc
 *       created_at:
 *         type: string
 *         format: date-time
 *         description: doc creation datetime
 *       updated_at:
 *         type: string
 *         format: date-time
 *         description: doc update datetime
 *   Error:
 *     type: object
 *     properties:
 *        message:
 *           type: string
 *        error:
 *           type: boolean
 *           default: true
 */

router.route('/')

/**
 * @swagger
 * /docs:
 *   get:
 *     tags:
 *       - doc
 *     summary: "List all docs"
 *     operationId: findAll
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters: []
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *            type: object
 */

.get( (req, res) => {
    docCtrl.findAll(req, res);
});

export default router;