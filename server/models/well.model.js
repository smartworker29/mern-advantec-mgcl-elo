import bookshelf from '../config/bookshelf';

const TABLE_NAME = 'dbo.Wells';

/**
 * User model.
 */
class Well extends bookshelf.Model {

    /**
     * Get table name.
     */
    get tableName() {
        return TABLE_NAME;
    }

    /**
     * Table has timestamps.
     */
    get hasTimestamps() {
        return true;
    }

}

export default Well;