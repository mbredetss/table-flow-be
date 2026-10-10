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
            SET status = $2
            WHERE id = $1
            RETURNING status
            `, 
            values: [id, status], 
        };

        const result = await this.pool.query(query);
        
        return result;
    }

    async getOrderSSE(id) {
        const query = {
            text: `
            SELECT menus.name as "menuName", orders.quantity as quantity, orders.id as "orderId", tables.id as "tableId"
            FROM orders
            JOIN menus ON menus.id = orders.menu_id
            JOIN tables ON tables.id = orders.table_id
            WHERE orders.id = $1
            `, 
            values: [id]
        };
        const result = await this.pool.query(query);

        return result.rows;
    }
}

export default new OrderRepositories();