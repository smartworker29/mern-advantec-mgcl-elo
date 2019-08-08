import bookshelf from '../config/bookshelf';

const TABLE_NAME = 'dbo.Docs';

/**
 * User model.
 */
class Doc extends bookshelf.Model {

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

export default Doc;