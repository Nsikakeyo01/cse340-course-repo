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

/**
 * Get all categories.
 */
const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            name
        FROM categories
        ORDER BY name ASC
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Get category IDs assigned to a project.
 */
const getCategoryIdsByProjectId = async (projectId) => {
    const query = `
        SELECT
            category_id
        FROM project_categories
        WHERE project_id = $1
    `;

    const queryParams = [projectId];

    const result = await db.query(query, queryParams);

    return result.rows.map(row => row.category_id);
};

/**
 * Create a new service project.
 */
const createProject = async (
    title,
    description,
    projectDate,
    location,
    organizationId
) => {
    const query = `
        INSERT INTO projects (
            title,
            description,
            project_date,
            location,
            organization_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id
    `;

    const queryParams = [
        title,
        description,
        projectDate,
        location,
        organizationId
    ];

    const result = await db.query(query, queryParams);

    return result.rows[0];
};

/**
 * Update an existing service project.
 */
const updateProject = async (
    projectId,
    title,
    description,
    projectDate,
    location,
    organizationId
) => {
    const query = `
        UPDATE projects
        SET
            title = $1,
            description = $2,
            project_date = $3,
            location = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id
    `;

    const queryParams = [
        title,
        description,
        projectDate,
        location,
        organizationId,
        projectId
    ];

    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Update the categories assigned to a project.
 */
const updateProjectCategories = async (projectId, categoryIds) => {
    await db.query(
        `
            DELETE FROM project_categories
            WHERE project_id = $1
        `,
        [projectId]
    );

    for (const categoryId of categoryIds) {
        await db.query(
            `
                INSERT INTO project_categories (
                    project_id,
                    category_id
                )
                VALUES ($1, $2)
            `,
            [projectId, categoryId]
        );
    }

    return true;
};

export {
    getAllProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    getAllCategories,
    getCategoryIdsByProjectId,
    createProject,
    updateProject,
    updateProjectCategories
};