import { Pool } from 'pg';

class AuthenticationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addRefreshToken(token) {
    await this.pool.query(
      'INSERT INTO authentications VALUES($1)', [token]
    );
  }

  async deleteRefreshToken(token) {
    await this.pool.query(
      `DELETE FROM authentications
            WHERE token = $1`, [token]
    );
  }

  async verifyRefreshToken(token) {
    const result = await this.pool.query(
      `SELECT token FROM authentications
            WHERE token = $1`, [token]
    );

    return result.rowCount;
  }
}

export default new AuthenticationRepositories();