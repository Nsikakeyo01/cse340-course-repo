import db from './db.js';

/**
 * Get all partner organizations.
 */
const getAllOrganizations = async () => {
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
};

/**
 * Get one organization by ID.
 */
const getOrganizationDetails = async (organizationId) => {
    const sql = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organizations
        WHERE organization_id = $1;
    `;

    const queryParams = [organizationId];

    const result = await db.query(sql, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Get all projects belonging to an organization.
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const sql = `
        SELECT
            project_id,
            title,
            description,
            date,
            location,
            organization_id
        FROM projects
        WHERE organization_id = $1
        ORDER BY date ASC;
    `;

    const queryParams = [organizationId];

    const result = await db.query(sql, queryParams);

    return result.rows;
};

export {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganizationId
};