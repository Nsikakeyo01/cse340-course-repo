import 'dotenv/config';

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';
import { getAllOrganizations } from './src/models/organizations.js';
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

// Organizations page
app.get('/organizations', async (req, res) => {
    try {
        const title = 'Our Partner Organizations';
        const organizations = await getAllOrganizations();

        console.log('ORGANIZATIONS FROM DATABASE:', organizations);

        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error loading organizations:', error);
        res.status(500).send('Unable to load organizations.');
    }
});

// Projects page
app.get('/projects', async (req, res) => {
    try {
        const title = 'Service Projects';
        const projects = await getAllProjects();

        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).send('Unable to load service projects.');
    }
});

// Categories page
app.get('/categories', async (req, res) => {
    console.log('CATEGORIES ROUTE WAS CALLED');

    try {
        const title = 'Service Project Categories';
        const categories = await getAllCategories();

        console.log('CATEGORIES FROM DATABASE:', categories);

        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error loading categories:', error);
        res.status(500).send('Unable to load service project categories.');
    }
});


// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();

        const projects = await getAllProjects();
        console.log('Projects:', projects);

        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
});