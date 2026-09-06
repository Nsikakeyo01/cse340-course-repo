import db from './db.js';

/**
 * Get all service projects with their organization names.
 */
async function getAllProjects() {
    const sql = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM projects AS p
        JOIN organizations AS o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date;
    `;

    const result = await db.query(sql);

    return result.rows;
}

export { getAllProjects };