import pool from "./pool";

/* istanbul ignore file */
const OrdersTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM orders');
    }, 

    async getOrderStatus(id) {
        const query = {
            text: `
            SELECT status FROM orders
            WHERE id = $1
            `, 
            values: [id], 
        };

        const result = await pool.query(query);

        return result.rows[0].status;
    }
};

export default OrdersTableTestHelper;