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

const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home'
    });
});

// Organization routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Create organization routes
router.get('/new-organization', showNewOrganization);
router.post('/new-organization', createOrganizationController);

// Edit organization routes
router.get('/edit-organization/:id', showEditOrganization);
router.post('/edit-organization/:id', editOrganizationController);

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Create project routes
router.get('/new-project', showNewProject);
router.post('/new-project', createProjectController);

// Edit project routes
router.get('/edit-project/:id', showEditProject);
router.post('/edit-project/:id', editProjectController);

// Update project categories routes
router.get(
    '/update-project-categories/:id',
    showUpdateProjectCategories
);

router.post(
    '/update-project-categories/:id',
    updateProjectCategoriesController
);

// Category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Create category routes
router.get('/new-category', showNewCategory);
router.post('/new-category', createCategoryController);

// Edit category routes
router.get('/edit-category/:id', showEditCategory);
router.post('/edit-category/:id', editCategoryController);

export default router;