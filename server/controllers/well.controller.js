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
        township: req.query.township,
        keyword: req.query.keyword
    };
    
    Well.forge()
        .query(function(qb) {
            if (options.keyword) {
                qb.where(function() {
                    this.where('API', 'like', `%${options.keyword}%`);
                    if (options.state) {
                        this.where('State', options.state);
                    }
                    if (options.county) {
                        this.where('County', options.county);
                    }
                    if (options.meridian) {
                        this.where('Meridan', options.meridian);
                    }
                    if (options.section) {
                        this.where('Section', 'like', `%${options.section}%`);
                    }
                    if (options.range) {
                        this.where('Range', 'like', `%${options.range}%`);
                    }
                    if (options.township) {
                        this.where('Township', 'like', `%${options.township}%`);
                    }
                });
                qb.orWhere(function() {
                    this.where('Lease', 'like', `%${options.keyword}%`);
                    if (options.state) {
                        this.where('State', options.state);
                    }
                    if (options.county) {
                        this.where('County', options.county);
                    }
                    if (options.meridian) {
                        this.where('Meridan', options.meridian);
                    }
                    if (options.section) {
                        this.where('Section', 'like', `%${options.section}%`);
                    }
                    if (options.range) {
                        this.where('Range', 'like', `%${options.range}%`);
                    }
                    if (options.township) {
                        this.where('Township', 'like', `%${options.township}%`);
                    }
                });
                qb.orWhere(function() {
                    this.where('Operator', 'like', `%${options.keyword}%`);
                    if (options.state) {
                        this.where('State', options.state);
                    }
                    if (options.county) {
                        this.where('County', options.county);
                    }
                    if (options.meridian) {
                        this.where('Meridan', options.meridian);
                    }
                    if (options.section) {
                        this.where('Section', 'like', `%${options.section}%`);
                    }
                    if (options.range) {
                        this.where('Range', 'like', `%${options.range}%`);
                    }
                    if (options.township) {
                        this.where('Township', 'like', `%${options.township}%`);
                    }
                });
            } else {
                qb.select('*');
                if (options.state) {
                    qb.andWhere('State', options.state);
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
