
import 'dotenv/config';

import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import routes from './src/routes.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// ============================================
// View engine
// ============================================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));


// ============================================
// Middleware for parsing HTML form submissions
// ============================================

app.use(express.urlencoded({ extended: true }));


// ============================================
// Session middleware
// ============================================

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            'cse340-development-secret',
        resave: false,
        saveUninitialized: false
    })
);


// ============================================
// Flash message middleware
// ============================================

app.use(flash());


// ============================================
// Make logged-in user available to all views
// ============================================

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


// ============================================
// Make flash messages available to all EJS views
// ============================================

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});


// ============================================
// Static files
// ============================================

app.use(express.static(path.join(__dirname, 'public')));


// ============================================
// MVC routes
// ============================================

app.use('/', routes);


// ============================================
// 404 error handler
// ============================================

app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found'
    });
});


// ============================================
// 500 error handler
// ============================================

app.use((err, req, res, next) => {
    console.error('Server error:', err);

    res.status(500).render('500', {
        title: 'Server Error'
    });
});


// ============================================
// Start server
// ============================================

app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(
            `Server is running at http://127.0.0.1:${PORT}`
        );

        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error(
            'Unable to connect to the database:',
            error.message
        );
    }
});