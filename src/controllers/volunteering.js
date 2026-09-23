import {
    addVolunteer,
    removeVolunteer,
    getProjectsByUser
} from '../models/volunteering.js';

import { getProjectDetails } from '../models/projects.js';

/**
 * Add the logged-in user as a volunteer for a project.
 */
const addVolunteerController = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        await addVolunteer(userId, projectId);

        req.flash(
            'notice',
            `You are now volunteering for "${project.title}".`
        );

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

/**
 * Remove the logged-in user as a volunteer from a project.
 */
const removeVolunteerController = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        await removeVolunteer(userId, projectId);

        req.flash(
            'notice',
            `You are no longer volunteering for "${project.title}".`
        );

        const redirectTo = req.body.redirectTo || `/project/${projectId}`;

        res.redirect(redirectTo);
    } catch (error) {
        console.error('Error removing volunteer:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

/**
 * Get the logged-in user's volunteer projects.
 */
const getVolunteerProjectsController = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        return getProjectsByUser(userId);
    } catch (error) {
        console.error('Error loading volunteer projects:', error);
        throw error;
    }
};

export {
    addVolunteerController,
    removeVolunteerController,
    getVolunteerProjectsController
};
