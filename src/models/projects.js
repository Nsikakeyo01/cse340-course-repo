import db from './db.js';

/**
 * Get all service projects.
 */
const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects AS p
        JOIN organizations AS o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Get one project by ID.
 */
const getProjectDetails = async (projectId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects AS p
        JOIN organizations AS o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;

    const queryParams = [projectId];

    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Get all categories belonging to a project.
 */
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM categories AS c
        JOIN project_categories AS pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC
    `;

    const queryParams = [projectId];

    const result = await db.query(query, queryParams);

    return result.rows;
};

export {
    getAllProjects,
    getProjectDetails,
    getCategoriesByProjectId
};