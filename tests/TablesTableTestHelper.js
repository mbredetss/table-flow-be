import pool from "./pool";

/* istanbul ignore file */
const TablesTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM tables');
    }
}

export default TablesTableTestHelper;