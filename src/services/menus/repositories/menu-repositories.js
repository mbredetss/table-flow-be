import { nanoid } from "nanoid";
import pg from "pg";
import { Pool } from "pg";

class MenuRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async addMenu(name, price, description) {
        const id = `menu-${nanoid(16)}`;
        const query = {
            text: `
            INSERT INTO menus 
            VALUES($1, $2, $3, $4) 
            RETURNING id`,
            values: [id, name, price, description],
        };

        const result = await this.pool.query(query);

        return result.rows[0].id;
    }

    async editMenu(id, name, price, description) {
        const query = {
            text: `
            UPDATE menus
            SET name = $1, 
                price = $2, 
                description = $3
            WHERE id = $4
            RETURNING id, name, price, description`, 
            values: [name, price, description, id], 
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async deleteMenu(id) {
        const query = {
            text: `
            DELETE FROM menus
            WHERE id = $1
            RETURNING id`, 
            values: [id], 
        };

        const result = await this.pool.query(query);

        return result.rows;
    }

    async getMenus() {
        const query = {
            text: 'SELECT * FROM menus',
        };

        const result = await this.pool.query(query);

        return result.rows;
    }
}

export default new MenuRepositories();