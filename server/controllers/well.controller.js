import HttpStatus from 'http-status-codes';
import Well from '../models/well.model';

/**
 * Find all the users
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findAll(req, res) {
    Well.forge()
        .query(function(qb) {
            qb.offset(0).limit(1000);
        })
        .fetchAll()
        .then(user => res.json({
                error: false,
                data: user.toJSON()
            })
        )
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            })
        );
}
