import HttpStatus from 'http-status-codes';
import Doc from '../models/doc.model';

/**
 * Find all the users
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findAll(req, res) {
    const options = {
        wells: req.query.wells ? req.query.wells : []
    };
    if (options.wells.length === 0) {
        Doc.forge()
            .query(function(qb) {
                qb.offset(0).limit(5000);
            })
            .fetchAll()
            .then(docs => res.json({
                    error: false,
                    data: docs.toJSON()
                })
            )
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                })
            );
    } else {
        Doc.forge()
            .where('Well_ID', 'in', options.wells)
            .fetchAll()
            .then(docs => res.json({
                    error: false,
                    data: docs.toJSON()
                })
            )
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                })
            );
    }
}
