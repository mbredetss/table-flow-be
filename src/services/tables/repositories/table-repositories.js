import { nanoid } from "nanoid";
import { Pool } from "pg";

class TableRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async addTable(name) {
        const id = `table-${nanoid(16)}`;
        const query = {
            text: `
            INSERT INTO tables
            VALUES($1, $2)
            `, 
            values: [id, name], 
        };

        await this.pool.query(query);
    }

    async getTableById(id) {
        const query = {
            text: `
            SELECT * FROM tables
            WHERE id = $1 
            `, 
            values: [id]
        };
        const result = await this.pool.query(query);

        return result.rows;
    }

    async getAllTable() {
        const result = await this.pool.query('SELECT * FROM tables;');

        return result.rows;
    }
}

export default new TableRepositories();