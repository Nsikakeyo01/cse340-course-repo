
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

const router = express.Router();


// ============================================
// Home page
// ============================================

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home'
    });
});


// ============================================
// Organization routes
// ============================================

router.get(
    '/organizations',
    showOrganizationsPage
);

router.get(
    '/organization/:id',
    showOrganizationDetailsPage
);


// ============================================
// Create organization routes
// Admin only
// ============================================

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


// ============================================
// Edit organization routes
// Admin only
// ============================================

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


// ============================================
// Project routes
// ============================================

router.get(
    '/projects',
    showProjectsPage
);

router.get(
    '/project/:id',
    showProjectDetailsPage
);


// ============================================
// Create project routes
// Admin only
// ============================================

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


// ============================================
// Edit project routes
// Admin only
// ============================================

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


// ============================================
// Update project categories routes
// Admin only
// ============================================

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


// ============================================
// Category routes
// ============================================

router.get(
    '/categories',
    showCategoriesPage
);

router.get(
    '/category/:id',
    showCategoryDetailsPage
);


// ============================================
// Create category routes
// Admin only
// ============================================

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


// ============================================
// Edit category routes
// Admin only
// ============================================

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


// ============================================
// Users route
// Admin only
// ============================================

router.get(
    '/users',
    requireRole('admin'),
    buildUsersView
);


// ============================================
// Authentication routes
// ============================================

// Registration form
router.get(
    '/account/register',
    showUserRegistrationForm
);

// Process registration
router.post(
    '/account/register',
    processUserRegistrationForm
);

// Login form
router.get(
    '/account/login',
    showLoginForm
);

// Process login
router.post(
    '/account/login',
    processLoginForm
);

// Dashboard / account page
// Login required
router.get(
    '/account',
    requireLogin,
    showDashboard
);

// Logout
router.get(
    '/account/logout',
    processLogout
);


export default router;