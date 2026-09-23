
import express from 'express';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganization,
    createOrganizationController,
    showEditOrganization,
    editOrganizationController
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProject,
    createProjectController,
    showEditProject,
    editProjectController,
    showUpdateProjectCategories,
    updateProjectCategoriesController
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategory,
    createCategoryController,
    showEditCategory,
    editCategoryController
} from './controllers/categories.js';

import {
    buildUsersView
} from './controllers/users.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard
} from './controllers/user.js';

import {
    addVolunteerController,
    removeVolunteerController
} from './controllers/volunteering.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home'
    });
});

router.get(
    '/organizations',
    showOrganizationsPage
);

router.get(
    '/organization/:id',
    showOrganizationDetailsPage
);

router.get(
    '/new-organization',
    requireRole('admin'),
    showNewOrganization
);

router.post(
    '/new-organization',
    requireRole('admin'),
    createOrganizationController
);

router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganization
);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    editOrganizationController
);

router.get(
    '/projects',
    showProjectsPage
);

router.get(
    '/project/:id',
    showProjectDetailsPage
);

/* W06 VOLUNTEERING ROUTES */

router.post(
    '/project/:id/volunteer',
    (req, res, next) => {
        console.log('VOLUNTEER ROUTE REACHED');
        next();
    },
    requireLogin,
    addVolunteerController
);

router.post(
    '/project/:id/remove-volunteer',
    requireLogin,
    removeVolunteerController
);

/* END W06 VOLUNTEERING ROUTES */

router.get(
    '/new-project',
    requireRole('admin'),
    showNewProject
);

router.post(
    '/new-project',
    requireRole('admin'),
    createProjectController
);

router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProject
);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    editProjectController
);

router.get(
    '/update-project-categories/:id',
    requireRole('admin'),
    showUpdateProjectCategories
);

router.post(
    '/update-project-categories/:id',
    requireRole('admin'),
    updateProjectCategoriesController
);

router.get(
    '/categories',
    showCategoriesPage
);

router.get(
    '/category/:id',
    showCategoryDetailsPage
);

router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategory
);

router.post(
    '/new-category',
    requireRole('admin'),
    createCategoryController
);

router.get(
    '/edit-category/:id',
    requireRole('admin'),
    showEditCategory
);

router.post(
    '/edit-category/:id',
    requireRole('admin'),
    editCategoryController
);

router.get(
    '/users',
    requireRole('admin'),
    buildUsersView
);

router.get(
    '/account/register',
    showUserRegistrationForm
);

router.post(
    '/account/register',
    processUserRegistrationForm
);

router.get(
    '/account/login',
    showLoginForm
);

router.post(
    '/account/login',
    processLoginForm
);

router.get(
    '/account',
    requireLogin,
    showDashboard
);

router.get(
    '/account/logout',
    processLogout
);

export default router;
