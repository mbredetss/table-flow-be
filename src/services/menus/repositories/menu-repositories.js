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
}

export default new MenuRepositories();