import HttpStatus from 'http-status-codes';
import Doc from '../models/doc.model';
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
        wells: req.query.wells ? req.query.wells : [],
        state: req.query.state,
        county: req.query.county,
        meridian: req.query.meridian,
        section: req.query.section,
        range: req.query.range,
        township: req.query.township
    };
    if (options.state || options.county || options.meridian || options.section || options.range || options.township) {
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
        .then(ress => {
            const wells = ress.toJSON().map(well => well.ID);
            if (wells.length === 0) {
                return ress;
            }
            return Doc.forge()
                .query(function(qb) {
                    qb.where('Well_ID', 'in', wells.slice(0, 500));
                })
                .fetchAll();
        })
        .then(docs => res.json({
            error: false,
            data: docs.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            })
        );
    
    } else if (options.wells.length === 0) {
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
