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
            project_date AS date,
            location,
            organization_id
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date ASC;
    `;

    const queryParams = [organizationId];

    const result = await db.query(sql, queryParams);

    return result.rows;
};

/**
 * Create a new organization.
 */
const createOrganization = async (
    name,
    description,
    contactEmail,
    logoFilename
) => {
    const sql = `
        INSERT INTO organizations (
            name,
            description,
            contact_email,
            logo_filename
        )
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;

    const queryParams = [
        name,
        description,
        contactEmail,
        logoFilename
    ];

    const result = await db.query(sql, queryParams);

    return result.rows[0];
};

/**
 * Update an existing organization.
 */
const updateOrganization = async (
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename
) => {
    const sql = `
        UPDATE organizations
        SET
            name = $1,
            description = $2,
            contact_email = $3,
            logo_filename = $4
        WHERE organization_id = $5
        RETURNING organization_id;
    `;

    const queryParams = [
        name,
        description,
        contactEmail,
        logoFilename,
        organizationId
    ];

    const result = await db.query(sql, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

export {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
};