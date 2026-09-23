
import bcrypt from 'bcryptjs';

import {
    getUserByEmail,
    registerUser
} from '../models/users.js';

import {
    getProjectsByUser
} from '../models/volunteering.js';

// ============================================
// Show User Registration Form
// ============================================

async function showUserRegistrationForm(req, res) {
    res.render('register', {
        title: 'Register'
    });
}

// ============================================
// Process User Registration Form
// ============================================

async function processUserRegistrationForm(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            req.flash(
                'notice',
                'Please provide your name, email, and password.'
            );

            return res.redirect('/account/register');
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            req.flash(
                'notice',
                'An account with that email already exists.'
            );

            return res.redirect('/account/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await registerUser(
            name,
            email,
            hashedPassword
        );

        req.flash(
            'notice',
            'Registration successful. Please log in.'
        );

        return res.redirect('/account/login');

    } catch (error) {
        next(error);
    }
}

// ============================================
// Show Login Form
// ============================================

async function showLoginForm(req, res) {
    res.render('login', {
        title: 'Login'
    });
}

// ============================================
// Process Login Form
// ============================================

async function processLoginForm(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash(
                'notice',
                'Please provide your email and password.'
            );

            return res.redirect('/account/login');
        }

        const user = await getUserByEmail(email);

        if (!user) {
            req.flash(
                'notice',
                'Invalid email or password.'
            );

            return res.redirect('/account/login');
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            req.flash(
                'notice',
                'Invalid email or password.'
            );

            return res.redirect('/account/login');
        }

        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash(
            'notice',
            'You are now logged in.'
        );

        return res.redirect('/account');

    } catch (error) {
        next(error);
    }
}

// ============================================
// Process Logout
// ============================================

function processLogout(req, res, next) {
    req.session.user = null;

    req.flash(
        'notice',
        'You have been successfully logged out.'
    );

    req.session.save(error => {
        if (error) {
            return next(error);
        }

        return res.redirect('/');
    });
}

// ============================================
// Require Login
// ============================================

function requireLogin(req, res, next) {
    if (!req.session.user) {
        req.flash(
            'notice',
            'Please log in to access that page.'
        );

        return res.redirect('/account/login');
    }

    next();
}

// ============================================
// Require Specific Role
// ============================================

function requireRole(requiredRole) {
    return (req, res, next) => {
        if (!req.session.user) {
            req.flash(
                'notice',
                'Please log in to access that page.'
            );

            return res.redirect('/account/login');
        }

        if (req.session.user.role !== requiredRole) {
            req.flash(
                'notice',
                'You do not have permission to access that page.'
            );

            return res.redirect('/account');
        }

        next();
    };
}

// ============================================
// Show Dashboard
// ============================================

async function showDashboard(req, res, next) {
    try {
        const user = req.session.user;

        const volunteerProjects = await getProjectsByUser(
            user.user_id
        );

        res.render('account', {
            title: 'Account',
            user,
            volunteerProjects
        });

    } catch (error) {
        console.error(
            'ERROR LOADING ACCOUNT DASHBOARD:',
            error
        );

        next(error);
    }
}

// ============================================
// Export Controller Functions
// ============================================

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard
};
