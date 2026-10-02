import { Pool } from "pg";

class OrderRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async addOrder(id, tableId, menuId, quantity) {
        const query = {
            text: `
            INSERT INTO orders 
            VALUES($1, $2, $3, $4)
            `, 
            values: [id, tableId, menuId, quantity]
        }

        await this.pool.query(query);
    }

    async updateOrderStatus(id, status) {
        const query = {
            text: `
            UPDATE orders
            SET transaction_status = $2
            WHERE id = $1
            `, 
            values: [id, status], 
        };

        await this.pool.query(query);
    }

    async getOrder(id) {
        const query = {
            text: `
            SELECT menus.name as "menuName", orders.quantity as quantity
            FROM orders
            JOIN menus ON menus.id = orders.menu_id
            WHERE orders.id = $1
            `, 
            values: [id]
        };
        const result = await this.pool.query(query);

        return result.rows;
    }
}

export default new OrderRepositories();