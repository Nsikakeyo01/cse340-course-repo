


import db from './db.js';

/**
 * Get all service project categories.
 */
async function getAllCategories() {
    const sql = `
        SELECT
            category_id,
            name
        FROM categories
        ORDER BY name;
    `;

    const result = await db.query(sql);

    return result.rows;
}

export { getAllCategories };