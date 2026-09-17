import bcrypt from 'bcryptjs';

import {
    getUserByEmail,
    registerUser
} from '../models/users.js';


// ============================================
// Show Login Page
// ============================================

async function showLogin(req, res) {
    res.render('login', {
        title: 'Login'
    });
}


// ============================================
// Show Registration Page
// ============================================

async function showRegister(req, res) {
    res.render('register', {
        title: 'Register'
    });
}


// ============================================
// Process Registration
// ============================================

async function registerAccount(req, res, next) {
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
// Process Login
// ============================================

async function loginAccount(req, res, next) {
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
// Account Dashboard
// ============================================

async function showAccount(req, res) {
    res.render('account', {
        title: 'Account',
        user: req.session.user
    });
}


// ============================================
// Logout
// ============================================

function logoutAccount(req, res, next) {
    req.session.destroy(error => {
        if (error) {
            return next(error);
        }

        res.redirect('/');
    });
}


export {
    showLogin,
    showRegister,
    registerAccount,
    loginAccount,
    showAccount,
    logoutAccount
};