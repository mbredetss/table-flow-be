/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('menus', {
        id: {
            type: 'CHAR(22)', 
            notNull: true, 
        }, 
        name: {
            type: 'TEXT', 
            notNull: true, 
        }, 
        price: {
            type: 'integer', 
            notNull: true, 
            default: 0, 
        }, 
        description: {
            type: 'TEXT',
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('menus');
};
