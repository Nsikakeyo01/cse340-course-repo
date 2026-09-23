import {
    getAllProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    getAllCategories,
    getCategoryIdsByProjectId,
    createProject,
    updateProject,
    updateProjectCategories
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

import { checkVolunteer } from '../models/volunteering.js';


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

        const categories =
            await getCategoriesByProjectId(projectId);


        if (!project) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }


        // Default to false for users who are not logged in.
        let isVolunteer = false;


        // Check whether the logged-in user has volunteered
        // for this particular project.
        if (req.session.user) {
            isVolunteer = await checkVolunteer(
                req.session.user.user_id,
                projectId
            );
        }


        res.render('project', {
            title: project.title,
            project,
            categories,
            isVolunteer
        });


    } catch (error) {
        console.error(
            'Error loading project details:',
            error
        );

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};


const showNewProject = async (req, res) => {
    try {
        const organizations =
            await getAllOrganizations();

        res.render('new-project', {
            title: 'Create New Service Project',
            organizations
        });

    } catch (error) {
        console.error(
            'Error loading new project page:',
            error
        );

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};


const createProjectController = async (req, res) => {
    try {
        let {
            title,
            description,
            project_date,
            location,
            organization_id
        } = req.body;


        title = title ? title.trim() : '';
        description = description ? description.trim() : '';
        project_date = project_date ? project_date.trim() : '';
        location = location ? location.trim() : '';
        organization_id =
            organization_id
                ? organization_id.trim()
                : '';


        const organizations =
            await getAllOrganizations();


        if (!title) {
            return res.status(400).render(
                'new-project',
                {
                    title: 'Create New Service Project',
                    error: 'Project title is required.',
                    projectTitle: title,
                    description,
                    project_date,
                    location,
                    organization_id,
                    organizations
                }
            );
        }


        if (title.length < 3) {
            return res.status(400).render(
                'new-project',
                {
                    title: 'Create New Service Project',
                    error:
                        'Project title must be at least 3 characters long.',
                    projectTitle: title,
                    description,
                    project_date,
                    location,
                    organization_id,
                    organizations
                }
            );
        }


        if (title.length > 100) {
            return res.status(400).render(
                'new-project',
                {
                    title: 'Create New Service Project',
                    error:
                        'Project title must not exceed 100 characters.',
                    projectTitle: title,
                    description,
                    project_date,
                    location,
                    organization_id,
                    organizations
                }
            );
        }


        if (!organization_id) {
            return res.status(400).render(
                'new-project',
                {
                    title: 'Create New Service Project',
                    error:
                        'Please select an organization.',
                    projectTitle: title,
                    description,
                    project_date,
                    location,
                    organization_id,
                    organizations
                }
            );
        }


        await createProject(
            title,
            description,
            project_date,
            location,
            organization_id
        );


        req.flash(
            'notice',
            'Service project created successfully.'
        );


        res.redirect('/projects');


    } catch (error) {
        console.error(
            'Error creating project:',
            error
        );

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};


const showEditProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project =
            await getProjectDetails(projectId);


        if (!project) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }


        const organizations =
            await getAllOrganizations();


        res.render('edit-project', {
            title: 'Edit Service Project',

            project: {
                project_id: project.project_id,
                title: project.title || '',
                description:
                    project.description || '',

                date: project.date
                    ? new Date(project.date)
                        .toISOString()
                        .split('T')[0]
                    : '',

                location:
                    project.location || '',

                organization_id:
                    project.organization_id
            },

            organizations
        });


    } catch (error) {
        console.error(
            'Error loading edit project page:',
            error
        );

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};


const editProjectController = async (req, res) => {
    try {
        const projectId = req.params.id;


        let {
            title,
            description,
            project_date,
            location,
            organization_id
        } = req.body;


        title = title ? title.trim() : '';
        description = description ? description.trim() : '';
        project_date = project_date ? project_date.trim() : '';
        location = location ? location.trim() : '';
        organization_id =
            organization_id
                ? organization_id.trim()
                : '';


        const organizations =
            await getAllOrganizations();


        if (!title) {
            return res.status(400).render(
                'edit-project',
                {
                    title: 'Edit Service Project',
                    error:
                        'Project title is required.',

                    project: {
                        project_id: projectId,
                        title,
                        description,
                        date: project_date,
                        location,
                        organization_id
                    },

                    organizations
                }
            );
        }


        if (title.length < 3) {
            return res.status(400).render(
                'edit-project',
                {
                    title: 'Edit Service Project',
                    error:
                        'Project title must be at least 3 characters long.',

                    project: {
                        project_id: projectId,
                        title,
                        description,
                        date: project_date,
                        location,
                        organization_id
                    },

                    organizations
                }
            );
        }


        if (title.length > 100) {
            return res.status(400).render(
                'edit-project',
                {
                    title: 'Edit Service Project',
                    error:
                        'Project title must not exceed 100 characters.',

                    project: {
                        project_id: projectId,
                        title,
                        description,
                        date: project_date,
                        location,
                        organization_id
                    },

                    organizations
                }
            );
        }


        if (!organization_id) {
            return res.status(400).render(
                'edit-project',
                {
                    title: 'Edit Service Project',
                    error:
                        'Please select an organization.',

                    project: {
                        project_id: projectId,
                        title,
                        description,
                        date: project_date,
                        location,
                        organization_id
                    },

                    organizations
                }
            );
        }


        const updatedProject =
            await updateProject(
                projectId,
                title,
                description,
                project_date,
                location,
                organization_id
            );


        if (!updatedProject) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }


        req.flash(
            'notice',
            'Service project updated successfully.'
        );


        res.redirect('/projects');


    } catch (error) {
        console.error(
            'Error updating project:',
            error
        );

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};


const showUpdateProjectCategories = async (req, res) => {
    try {
        const projectId = req.params.id;


        const project =
            await getProjectDetails(projectId);


        if (!project) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }


        const categories =
            await getAllCategories();


        const assignedCategoryIds =
            await getCategoryIdsByProjectId(
                projectId
            );


        res.render(
            'update-project-categories',
            {
                title:
                    'Update Project Categories',

                project,

                categories,

                assignedCategoryIds
            }
        );


    } catch (error) {
        console.error(
            'Error loading project categories:',
            error
        );

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};


const updateProjectCategoriesController = async (
    req,
    res
) => {
    try {
        const projectId = req.params.id;


        const project =
            await getProjectDetails(projectId);


        if (!project) {
            return res.status(404).render('404', {
                title: 'Page Not Found'
            });
        }


        let categoryIds =
            req.body.category_ids || [];


        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }


        await updateProjectCategories(
            projectId,
            categoryIds
        );


        req.flash(
            'notice',
            'Project categories updated successfully.'
        );


        res.redirect(
            `/project/${projectId}`
        );


    } catch (error) {
        console.error(
            'Error updating project categories:',
            error
        );

        res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};


export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProject,
    createProjectController,
    showEditProject,
    editProjectController,
    showUpdateProjectCategories,
    updateProjectCategoriesController
};