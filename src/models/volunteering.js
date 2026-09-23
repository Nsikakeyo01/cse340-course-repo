import db from './db.js';

/**
 * Add a user as a volunteer for a project.
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteers (
            user_id,
            project_id
        )
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id, project_id
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows[0] || null;
};

/**
 * Remove a user from a project.
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteers
        WHERE user_id = $1
          AND project_id = $2
        RETURNING user_id, project_id
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows[0] || null;
};

/**
 * Check whether a user is volunteering for a project.
 */
const checkVolunteer = async (userId, projectId) => {
    const query = `
        SELECT user_id, project_id
        FROM volunteers
        WHERE user_id = $1
          AND project_id = $2
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows.length > 0;
};

/**
 * Get all projects for which a user has volunteered.
 */
const getProjectsByUser = async (userId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM volunteers AS v
        JOIN projects AS p
            ON v.project_id = p.project_id
        JOIN organizations AS o
            ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.project_date ASC, p.title ASC
    `;

    const result = await db.query(query, [userId]);

    return result.rows;
};

export {
    addVolunteer,
    removeVolunteer,
    checkVolunteer,
    getProjectsByUser
};
