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
    pgm.createType('order_status', ['success', 'failure', 'pending']);

    pgm.createTable('orders', {
        id: {
            type: 'CHAR(30)', 
            notNull: true, 
        }, 
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
        }, 
        status: {
            type: 'order_status', 
            default: 'pending'
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('orders');
    pgm.dropType('order_status')
};
