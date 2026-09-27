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
            `, 
            values: [id, status], 
        };

        await this.pool.query(query);
    }
}

export default new OrderRepositories();