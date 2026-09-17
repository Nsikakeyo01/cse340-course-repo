import pool from './db.js';

/**
 * Get all registered users.
 * Used by the admin users page.
 */
async function getAllUsers() {
    const sql = `
        SELECT
            user_id,
            name,
            email,
            role
        FROM users
        ORDER BY name ASC
    `;

    return pool.query(sql);
}


/**
 * Get one user by email address.
 * Used during login.
 */
async function getUserByEmail(email) {
    const sql = `
        SELECT
            user_id,
            name,
            email,
            password,
            role
        FROM users
        WHERE email = $1
    `;

    const result = await pool.query(sql, [email]);

    return result.rows[0];
}


/**
 * Get one user by ID.
 */
async function getUserById(userId) {
    const sql = `
        SELECT
            user_id,
            name,
            email,
            password,
            role
        FROM users
        WHERE user_id = $1
    `;

    const result = await pool.query(sql, [userId]);

    return result.rows[0];
}


/**
 * Create a new user.
 * The password should already be hashed before
 * this function is called.
 */
async function registerUser(name, email, hashedPassword) {
    const sql = `
        INSERT INTO users
            (name, email, password)
        VALUES
            ($1, $2, $3)
        RETURNING user_id, name, email, role
    `;

    const result = await pool.query(sql, [
        name,
        email,
        hashedPassword
    ]);

    return result.rows[0];
}


export {
    getAllUsers,
    getUserByEmail,
    getUserById,
    registerUser
};