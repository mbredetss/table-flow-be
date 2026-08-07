import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

class UserRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createUser(username, password, fullname) {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const result = await this.pool.query(`INSERT INTO users
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [id, username, hashedPassword, fullname, createdAt, updatedAt]);

    return result.rows[0];
  }

  async verifyNewUsername(username) {
    const result = await this.pool.query(
      `SELECT id FROM users
            WHERE username = $1`, [username]
    );

    return result.rowCount;
  }

  async verifyUserCredential(username) {
    const result = await this.pool.query(
      'SELECT id, password FROM users WHERE username = $1', [username]
    );

    return result.rows[0];
  }

  async getUsername(id) {
    const result = await this.pool.query(
      `SELECT username FROM users
            WHERE id = $1`, [id]
    );

    return result.rows[0].username;
  }
}

export default new UserRepositories();