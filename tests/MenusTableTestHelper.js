import pool from "./pool";

/* istanbul ignore file */
const MenusTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM menus');
    }
}

export default MenusTableTestHelper;