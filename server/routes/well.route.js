import express from 'express';
import * as wellCtrl from '../controllers/well.controller';
// import validate from '../config/joi.validate';
// import schema from '../utils/validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: well
 *     description: well operations
 */

/**
 * @swagger
 * definitions:
 *   well:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier representing a specific well
 *         example: 2
 *       ID:
 *         type: string
 *         description: ID of the well
 *         example: Krishna
 *       API:
 *         type: string
 *         description: API of the well
 *         example: Timilsina
 *       Operator:
 *         type: string
 *         description: Operator of the well
 *       Lat:
 *         type: string
 *         description: Latitude of the well
 *       Long:
 *         type: string
 *         description: Longitude of the well
 *       Meridan:
 *         type: string
 *         description: Meridan of the well
 *       Section:
 *         type: string
 *         description: Section of the well
 *       State:
 *         type: string
 *         description: State of the well
 *       County:
 *         type: string
 *         description: County of the well
 *       Township:
 *         type: string
 *         description: Township of the well
 *       Range:
 *         type: string
 *         description: Range of the well
 *       created_at:
 *         type: string
 *         format: date-time
 *         description: well creation datetime
 *       updated_at:
 *         type: string
 *         format: date-time
 *         description: well update datetime
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
 * /wells:
 *   get:
 *     tags:
 *       - well
 *     summary: "List all wells"
 *     operationId: findAll
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "state"
 *         in: "query"
 *         description: "Query for Products with same state"
 *         type: "string"
 *         default: ""
 *       - name: "county"
 *         in: "query"
 *         description: "Query for Products with same county"
 *         type: "string"
 *         default: ""
 *       - name: "meridian"
 *         in: "query"
 *         description: "Query for Products with same meridian"
 *         type: "string"
 *         default: ""
 *       - name: "section"
 *         in: "query"
 *         description: "Query for Products with same section"
 *         type: "string"
 *         default: ""
 *       - name: "township"
 *         in: "query"
 *         description: "Query for Products with same township"
 *         type: "string"
 *         default: ""
 *       - name: "range"
 *         in: "query"
 *         description: "Query for Products with same range"
 *         type: "string"
 *         default: ""
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *            type: object
 */

.get( (req, res) => {
    wellCtrl.findAll(req, res);
});

export default router;