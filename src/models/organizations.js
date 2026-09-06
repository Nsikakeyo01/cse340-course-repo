import db from './db.js';

/**
 * Get all partner organizations.
 */
async function getAllOrganizations() {
    const sql = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organizations
        ORDER BY name;
    `;

    const result = await db.query(sql);

    return result.rows;
}

export { getAllOrganizations };