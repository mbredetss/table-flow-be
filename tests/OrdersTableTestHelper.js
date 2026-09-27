import pool from "./pool";

const OrdersTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM orders');
    }
};

export default OrdersTableTestHelper;