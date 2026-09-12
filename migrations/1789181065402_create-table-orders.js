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
    pgm.createTable('orders', {
        table_id: {
            type: 'CHAR(22)', 
            references: 'tables', 
        }, 
        menu_id: {
            type: 'CHAR(22)', 
            references: 'menus', 
        }, 
        quantity: {
            type: 'SMALLINT', 
            notNull: true, 
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => { };
