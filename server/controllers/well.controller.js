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
    const options = {
        state: req.query.state,
        county: req.query.county,
        meridian: req.query.meridian,
        section: req.query.section,
        range: req.query.range,
        township: req.query.township
    };
    
    Well.forge()
        .query(function(qb) {
            if (options.state) {
                qb.where('State', options.state);
            }
            if (options.county) {
                qb.andWhere('County', options.county);
            }
            if (options.meridian) {
                qb.andWhere('Meridan', options.meridian);
            }
            if (options.section) {
                qb.andWhere('Section', 'like', `%${options.section}%`);
            }
            if (options.range) {
                qb.andWhere('Range', 'like', `%${options.range}%`);
            }
            if (options.township) {
                qb.andWhere('Township', 'like', `%${options.township}%`);
            }
        })
        .fetchAll()
        .then(wells => res.json({
                error: false,
                data: wells.toJSON()
            })
        )
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            })
        );
}
