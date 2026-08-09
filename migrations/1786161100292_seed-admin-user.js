import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = async (pgm) => {
    const adminId = `user-${nanoid(16)}`;
    const adminUsername = process.env.ADMIN_USERNAME;
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const role = 'admin';
    const fullName = 'Admin Kasir';

    await pgm.db.query(
        `INSERT INTO users VALUES ($1, $2, $3, $4, $5)`,
        [adminId, adminUsername, hashedPassword, role, fullName]);

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = async (pgm) => {
    await pgm.db.query(
        `DELETE FROM users WHERE username = $1`,
        [process.env.ADMIN_USERNAME]);
};
