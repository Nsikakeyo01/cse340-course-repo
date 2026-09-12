import {
    getAllProjects,
    getProjectDetails,
    getCategoriesByProjectId
} from '../models/projects.js';

const showProjectsPage = async (req, res) => {
    try {
        const title = 'Service Projects';
        const projects = await getAllProjects();

        res.render('projects', {
            title,
            projects
        });
    } catch (error) {
        console.error('Error loading projects:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesByProjectId(projectId);

        if (!project) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }

        res.render('project', {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        console.error('Error loading project details:', error);

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage
};